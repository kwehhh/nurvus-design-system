import React from 'react';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Title.scss';

function getTag(level) {
  switch (level) {
    case 1:
      return 'h1';
      break;
    case 2:
      return 'h2';
      break;
    case 3:
      return 'h3';
      break;
    case 4:
      return 'h4';
      break;
    case 5:
      return 'h5';
      break;
    case 6:
    default:
      return 'h6';
 }
}

/**
 * Title component.
 * @returns {ReactElement} of Title component.
 */
export default function Title({
  children,
  className,
  level = 1,
  type = "primary",
  ...restProps
}) {
    return React.createElement(
      getTag(level),
      {
        className: classNames(`${CONSTANT.CLASS_PREFIX}`, 'title', className),
        ['data-type']: type,
        ...restProps
      },
      children
    );
}