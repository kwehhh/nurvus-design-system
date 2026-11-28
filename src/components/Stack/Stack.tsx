import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { Spacing } from '../../spacing';
import { Responsive, responsiveData } from '../../breakpoints';
import './Stack.scss';

export type StackDirection = 'column' | 'row';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** column (top to bottom, the default) or row. Can change with the width: { base: 'column', md: 'row' }. */
  direction?: Responsive<StackDirection>;
  /** Space between the children, from the 4px grid: 0, 2, 4, 8, 12, 16, 24, 32, 48 or 64. */
  gap?: Spacing;
  /** How the children line up across the stack. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** How the children spread along the stack. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Lets a row wrap onto more lines when it runs out of room. */
  wrap?: boolean;
  /** What to lay out. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * Puts its children in a column or a row with even space between them, from
 * the 4px grid (CSS gap, so wrapped rows keep their spacing too). The
 * direction can change at a breakpoint: a column on phones, a row from md up.
 */
export default function Stack({
  direction = 'column',
  gap = 16,
  align,
  justify,
  wrap = false,
  className,
  ...restProps
}: StackProps) {
  return (
    <div
      className={ classNames(className, 'stack', CONSTANT.CLASS_PREFIX) }
      { ...responsiveData('direction', direction) }
      data-gap={ gap }
      data-align={ align }
      data-justify={ justify }
      data-wrap={ wrap || undefined }
      { ...restProps }
    />
  );
}
