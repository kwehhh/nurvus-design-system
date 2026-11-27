import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Title.scss';

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' };

/**
 * A heading, `<h1>` to `<h6>`, in the theme's text color. For the larger
 * type roles (display, title, caption) use `Text` with a `variant`.
 */
export default function Title({
  children,
  className,
  level = 1,
  type = 'primary',
  ...restProps
}) {
  return React.createElement(
    TAGS[level] || 'h6',
    {
      className: classNames(className, 'title', CONSTANT.CLASS_PREFIX),
      ['data-type']: type,
      ...restProps
    },
    children
  );
}

Title.propTypes = {
  /**
   * Heading level: 1 renders `<h1>` (24px) down to 6 (`<h6>`).
   */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  /**
   * `primary` uses the theme's text color; `secondary` the muted one.
   */
  type: PropTypes.oneOf(['primary', 'secondary']),
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * The heading text.
   */
  children: PropTypes.node
};
