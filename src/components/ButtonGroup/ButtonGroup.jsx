import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './ButtonGroup.scss';

/**
 * Joins Buttons into one row: square corners where they meet, rounded at the
 * two outer ends. Any other prop goes on the wrapping `<div>`.
 */
export default function ButtonGroup({ className, ...restProps }) {
  return (
    <div
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'button-group', className) }
      { ...restProps } />
  );
}

ButtonGroup.propTypes = {
  /**
   * The Buttons to join.
   */
  children: PropTypes.node,
  /**
   * Custom class name.
   */
  className: PropTypes.string
};
