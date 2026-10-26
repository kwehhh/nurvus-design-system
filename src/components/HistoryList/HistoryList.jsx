import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './HistoryList.scss';

const defaultFormatTime = (time) => new Date(time).toLocaleTimeString([], {
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
 * @returns {ReactElement} of HistoryList component.
 */
export default function HistoryList(props) {
  const {
    className,
    formatTime,
    index,
    onJump,
    startDetail,
    startLabel,
    steps,
    ...restProps
  } = props;

  if (!steps.length) {
    return null;
  }

  const renderRow = (number, label, detail, time, key) => {
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
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'history-list', className) }
      aria-label="History, newest first"
      { ...restProps }
    >
      { rows.map(({ step, number }) => renderRow(number, step.label, step.detail, step.time, step.id)) }
      { renderRow(0, startLabel, startDetail, null, '__start__') }
    </ol>
  );
}

HistoryList.propTypes = {
  /**
   * Every step, OLDEST first: `{ id, label, detail?, time? }`. `time` is a
   * timestamp in ms.
   */
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.node.isRequired,
    detail: PropTypes.node,
    time: PropTypes.number
  })).isRequired,
  /**
   * How many steps are applied: step N (1-based) is current when N === index,
   * and 0 means everything is undone.
   */
  index: PropTypes.number.isRequired,
  /**
   * Called with the step number to jump to (0 = the start row).
   */
  onJump: PropTypes.func,
  /**
   * Label of the bottom row, the state before any step.
   */
  startLabel: PropTypes.node,
  /**
   * Second line of the bottom row.
   */
  startDetail: PropTypes.node,
  /**
   * Formats a step's `time` for its row. Defaults to the locale time with seconds.
   */
  formatTime: PropTypes.func
};

HistoryList.defaultProps = {
  startLabel: 'Start',
  startDetail: 'Before any changes',
  formatTime: defaultFormatTime
};
