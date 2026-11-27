import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Link.scss';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Content to render. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/** A link in the theme's accent color. Any other prop (href, target…) goes on the `<a>`. */
export default function Link({ children, className, ...restProps }: LinkProps) {
  return (
    <a
      className={ classNames(className, 'link', CONSTANT.CLASS_PREFIX) }
      { ...restProps }
    >
      { children }
    </a>
  );
}
