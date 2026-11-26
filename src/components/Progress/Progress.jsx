import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Progress.scss';

/**
 * Progress component. Use it to track progress!
 * @returns {ReactElement} of Progress component.
 */
function Progress({
  className,
  percent = 0,
  size = 'medium',
  status = 'active'
}) {
  return (
    <div
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'progress', className) }
      data-size={ size }
      data-status={ status }
    >
      <div className="bar" style={{ width: `${percent}%` }} />
    </div>
  );
}

Progress.propTypes = {
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * Progress percent.
   */
  percent: PropTypes.number,
  /**
   * Bar height.
   */
  size: PropTypes.oneOf([
    'small',
    'medium',
    'large'
  ]),
  /**
   * Progress status: the bar color (accent, success, warning, danger).
   */
  status: PropTypes.oneOf([
    'active',
    'success',
    'warning',
    'critical'
  ])
};

export default  Progress;
