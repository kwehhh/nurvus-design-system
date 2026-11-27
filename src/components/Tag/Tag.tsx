import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Tag.scss';

export type TagTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color: neutral (muted text) or one of the theme's accent / status colors. */
  tone?: TagTone;
  /** The label. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * A small pill for a status or label ("new", "preview", "demo"). The text and
 * the border take the tone's theme color; the fill is a faint tint of it.
 */
export default function Tag({
  tone = 'neutral',
  children,
  className,
  ...restProps
}: TagProps) {
  return (
    <span
      className={ classNames(className, 'tag', CONSTANT.CLASS_PREFIX) }
      data-tone={ tone }
      { ...restProps }
    >
      { children }
    </span>
  );
}
