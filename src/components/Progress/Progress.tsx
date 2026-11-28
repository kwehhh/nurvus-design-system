import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import Icon from '../Icon/Icon';
import { PROGRESS_STATUS, clampPercent, progressValueText, ProgressStatus } from '../../progress';
import './Progress.scss';

export type ProgressSize = 'small' | 'medium' | 'large';
export type { ProgressStatus };

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How far along, 0 to 100. */
  percent?: number;
  /** Bar height. */
  size?: ProgressSize;
  /** The bar color: active (accent), success, warning or critical (danger). With a label or showValue, a status also shows as an icon and a word. */
  status?: ProgressStatus;
  /** What is in progress ("Uploading"): shown above the bar, and its name for screen readers. */
  label?: string;
  /** Keeps the label for screen readers only. */
  hideLabel?: boolean;
  /** Shows the percent (and the status, as an icon and a word) at the right, above the bar. */
  showValue?: boolean;
  /** What screen readers say for the value, instead of "40%" (e.g. "3 of 8 files"). */
  valueText?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * A progress bar: how far along something is. Screen readers hear it as a
 * progress bar with its label and value ("Uploading, progress bar, 40%").
 * Its status is never color alone: with a label or showValue it shows as an
 * icon and a word too, and screen readers hear the word.
 */
export default function Progress({
  className,
  percent = 0,
  size = 'medium',
  status = 'active',
  label,
  hideLabel = false,
  showValue = false,
  valueText,
  ...restProps
}: ProgressProps) {
  const value = clampPercent(percent);
  const meaning = PROGRESS_STATUS[status] || PROGRESS_STATUS.active;
  const head = (label && !hideLabel) || showValue;
  return (
    <div
      className={ classNames(className, 'progress', CONSTANT.CLASS_PREFIX) }
      data-size={ size }
      data-status={ status }
      role="progressbar"
      aria-label={ label || 'Progress' }
      aria-valuemin={ 0 }
      aria-valuemax={ 100 }
      aria-valuenow={ value }
      aria-valuetext={ valueText || progressValueText(value, status) }
      { ...restProps }
    >
      { head && (
        <div className="progress-head">
          { label && !hideLabel && <span className="progress-label">{ label }</span> }
          { showValue && (
            <span className="progress-value">
              { meaning.icon && <Icon name={ meaning.icon } /> }
              { meaning.word && <span className="progress-word">{ meaning.word }</span> }
              <span>{ `${value}%` }</span>
            </span>
          ) }
        </div>
      ) }
      <div className="progress-track">
        <div className="bar" style={ { width: `${value}%` } } />
      </div>
    </div>
  );
}
