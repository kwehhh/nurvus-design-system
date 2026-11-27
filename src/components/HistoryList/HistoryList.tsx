import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './HistoryList.scss';

export interface HistoryStep {
  /** Unique id: keys the row. */
  id: string | number;
  /** What the step did. */
  label: React.ReactNode;
  /** A second line. */
  detail?: React.ReactNode;
  /** When it happened, as a timestamp in ms. */
  time?: number;
}

export interface HistoryListProps extends React.OlHTMLAttributes<HTMLOListElement> {
  /** Every step, OLDEST first. */
  steps: HistoryStep[];
  /**
   * How many steps are applied: step N (1-based) is current when N === index,
   * and 0 means everything is undone.
   */
  index: number;
  /** Called with the step number to jump to (0 = the start row). */
  onJump?: (step: number) => void;
  /** Label of the bottom row, the state before any step. */
  startLabel?: React.ReactNode;
  /** Second line of the bottom row. */
  startDetail?: React.ReactNode;
  /** Formats a step's `time` for its row. Defaults to the locale time with seconds. */
  formatTime?: (time: number) => React.ReactNode;
  /** Custom class name. */
  className?: string;
}

const defaultFormatTime = (time: number) => new Date(time).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

/**
 * Undo history as a list (Photoshop's History panel): every step newest
 * first with its number, what it did and when, the current step marked, the
 * undone steps faded above it, and a "start" row at the bottom. Clicking any
 * row jumps to that step.
 *
 * Purely presentational: the app owns the history and passes `steps` (oldest
 * first) plus `index`, the number of steps currently applied.
 */
export default function HistoryList({
  className,
  formatTime = defaultFormatTime,
  index,
  onJump,
  startDetail = 'Before any changes',
  startLabel = 'Start',
  steps,
  ...restProps
}: HistoryListProps) {
  if (!steps.length) {
    return null;
  }

  const renderRow = (number: number, label: React.ReactNode, detail: React.ReactNode, time: number | null | undefined, key: string | number) => {
    const isCurrent = number === index;
    const isFuture = number > index;
    let title = 'Jump to this step (undo to here)';
    if (isCurrent) title = 'Current state';
    else if (isFuture) title = 'Jump to this step (redo to here)';

    return (
      <li key={ key }>
        <button
          type="button"
          className="history-list-item"
          data-current={ isCurrent }
          data-future={ isFuture }
          aria-current={ isCurrent ? 'step' : undefined }
          title={ title }
          onClick={ () => onJump && onJump(number) }
        >
          <span className="history-list-index">{ number }</span>
          <span className="history-list-text">
            <span className="history-list-label">{ label }</span>
            { detail ? <span className="history-list-detail">{ detail }</span> : null }
          </span>
          { time ? <span className="history-list-time">{ formatTime(time) }</span> : null }
        </button>
      </li>
    );
  };

  const rows = steps.map((step, i) => ({ step, number: i + 1 })).reverse();

  return (
    <ol
      className={ classNames(className, 'history-list', CONSTANT.CLASS_PREFIX) }
      aria-label="History, newest first"
      { ...restProps }
    >
      { rows.map(({ step, number }) => renderRow(number, step.label, step.detail, step.time, step.id)) }
      { renderRow(0, startLabel, startDetail, null, '__start__') }
    </ol>
  );
}
