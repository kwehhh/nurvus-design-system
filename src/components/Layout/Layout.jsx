import React from 'react';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Layout.scss';

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
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'layout', className) }
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
