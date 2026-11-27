import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Layout.scss';

/**
 * Stacks its children in a column (`block`) or a row (`flex`) with even
 * space between them. Any other prop goes on the wrapping `<div>`.
 */
export default function Layout({
  alignItems,
  className,
  display = 'block',
  flexDirection,
  justifyContent,
  itemDisplay,
  itemSpacing = 20,
  ...restProps
}) {
  return (
    <div
      className={ classNames(className, 'layout', CONSTANT.CLASS_PREFIX) }
      data-align-items={ alignItems }
      data-display={ display }
      data-flex-direction={ flexDirection }
      data-item-display={ itemDisplay }
      data-item-spacing={ itemSpacing }
      data-justify-content={ justifyContent }
      { ...restProps }
    />
  );
}

Layout.propTypes = {
  /**
   * `block` stacks the children top to bottom; `flex` puts them in a row.
   */
  display: PropTypes.oneOf(['block', 'flex']),
  /**
   * With `display="flex"`: `column` stacks the children instead of a row.
   */
  flexDirection: PropTypes.oneOf(['row', 'column']),
  /**
   * Space between the children, in px (0 for none). A flex row takes 0, 10, 20 or 40.
   */
  itemSpacing: PropTypes.oneOf([0, 10, 13, 20, 30, 40]),
  /**
   * With `display="flex"`: how the children line up across the row (CSS `align-items`).
   */
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  /**
   * With `display="flex"`: how the children spread along the row (CSS `justify-content`).
   */
  justifyContent: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between']),
  /**
   * `block` makes every child `display: block` (e.g. links stacked one per line).
   */
  itemDisplay: PropTypes.oneOf(['block']),
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * What to lay out.
   */
  children: PropTypes.node
};
