import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Title.scss';

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleType = 'primary' | 'secondary';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level: 1 renders `<h1>` (24px) down to 6 (`<h6>`). */
  level?: TitleLevel;
  /** `primary` uses the theme's text color; `secondary` the muted one. */
  type?: TitleType;
  /** The heading text. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

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
}: TitleProps) {
  return React.createElement(
    TAGS[level] || 'h6',
    {
      className: classNames(className, 'title', CONSTANT.CLASS_PREFIX),
      'data-type': type,
      ...restProps
    },
    children
  );
}
