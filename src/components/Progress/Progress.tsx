import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Progress.scss';

export type ProgressSize = 'small' | 'medium' | 'large';
export type ProgressStatus = 'active' | 'success' | 'warning' | 'critical';

export interface ProgressProps {
  /** How far along, 0 to 100. */
  percent?: number;
  /** Bar height. */
  size?: ProgressSize;
  /** The bar color: active (accent), success, warning or critical (danger). */
  status?: ProgressStatus;
  /** Custom class name. */
  className?: string;
}

/** A progress bar. Use it to track progress! */
export default function Progress({
  className,
  percent = 0,
  size = 'medium',
  status = 'active'
}: ProgressProps) {
  return (
    <div
      className={ classNames(className, 'progress', CONSTANT.CLASS_PREFIX) }
      data-size={ size }
      data-status={ status }
    >
      <div className="bar" style={ { width: `${percent}%` } } />
    </div>
  );
}
