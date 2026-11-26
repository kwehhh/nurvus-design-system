import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CONSTANT from '../../constants.js';
import './Tag.scss';

/**
 * A small pill for a status or label ("new", "preview", "demo"). The text and
 * the border take the tone's theme color; the fill is a faint tint of it.
 */
export default function Tag({
  tone = 'neutral',
  children,
  className,
  ...restProps
}) {
  return (
    <span
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'tag', className) }
      data-tone={ tone }
      { ...restProps }
    >
      { children }
    </span>
  );
}

Tag.propTypes = {
  /**
   * Color: neutral (muted text) or one of the theme's accent / status colors.
   */
  tone: PropTypes.oneOf(['neutral', 'accent', 'success', 'warning', 'danger', 'info']),
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * The label.
   */
  children: PropTypes.node
};
