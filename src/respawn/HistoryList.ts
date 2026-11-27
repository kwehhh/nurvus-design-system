import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/HistoryList/HistoryList.scss';

export interface HistoryStep {
  /** Unique id. */
  id: string | number;
  /** What the step did. */
  label: Child;
  /** A second line. */
  detail?: Child;
  /** When it happened, as a timestamp in ms. */
  time?: number;
}

export interface HistoryListProps extends ElementProps {
  /** Every step, OLDEST first. */
  steps: HistoryStep[];
  /** How many steps are applied: step N (1-based) is current when N === index; 0 = everything undone. */
  index: number;
  /** Called with the step number to jump to (0 = the start row). */
  onJump?: (step: number) => void;
  /** Label of the bottom row, the state before any step. */
  startLabel?: Child;
  /** Second line of the bottom row. */
  startDetail?: Child;
  /** Formats a step's `time` for its row. Defaults to the locale time with seconds. */
  formatTime?: (time: number) => Child;
}

const defaultFormatTime = (time: number) => new Date(time).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/**
 * Undo history as a list, newest first, with the current step marked. Like
 * the React one it only shows what it is given: the app owns the history.
 * A click calls onJump(step); the app then moves the current step with
 * list.update({ index: step }).
 *
 * With no steps the React HistoryList renders nothing; this one returns an
 * empty, hidden <ol> instead, so there is an element to update later.
 */
export default function HistoryList(props: HistoryListProps): NurvusElement<HTMLOListElement, HistoryListProps> {
  return updatable(({
    className, formatTime = defaultFormatTime, index, onJump, startDetail = 'Before any changes', startLabel = 'Start', steps, ...rest
  }: HistoryListProps) => {
    const renderRow = (number: number, label: Child, detail: Child, time: number | null | undefined) => {
      const isCurrent = number === index;
      const isFuture = number > index;
      let title = 'Jump to this step (undo to here)';
      if (isCurrent) title = 'Current state';
      else if (isFuture) title = 'Jump to this step (redo to here)';

      return spawn({
        tag: 'li',
        children: spawn({
          tag: 'button',
          type: 'button',
          className: 'history-list-item',
          'data-current': isCurrent,
          'data-future': isFuture,
          'aria-current': isCurrent ? 'step' : undefined,
          title,
          events: { click: () => { if (onJump) onJump(number); } },
          children: [
            spawn({ tag: 'span', className: 'history-list-index', children: number }),
            spawn({
              tag: 'span',
              className: 'history-list-text',
              children: [
                spawn({ tag: 'span', className: 'history-list-label', children: label }),
                detail ? spawn({ tag: 'span', className: 'history-list-detail', children: detail }) : null,
              ],
            }),
            time ? spawn({ tag: 'span', className: 'history-list-time', children: formatTime(time) }) : null,
          ],
        }),
      });
    };

    const list = steps || [];
    const rows = list.map((step, i) => ({ step, number: i + 1 })).reverse();
    return spawn<HTMLOListElement>({
      className: classNames(className, 'history-list', CONSTANT.CLASS_PREFIX),
      'aria-label': 'History, newest first',
      ...rest,
      hidden: list.length ? rest.hidden : true,
      tag: 'ol',
      children: list.length ? [
        ...rows.map(({ step, number }) => renderRow(number, step.label, step.detail, step.time)),
        renderRow(0, startLabel, startDetail, null),
      ] : null,
    });
  }, props);
}
