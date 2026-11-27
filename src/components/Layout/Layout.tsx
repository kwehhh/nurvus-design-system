import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Layout.scss';

import { Spacing, LegacySpacing, toGrid } from '../../spacing';

export type { Spacing, LegacySpacing };

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `block` stacks the children top to bottom; `flex` puts them in a row. */
  display?: 'block' | 'flex';
  /** With `display="flex"`: `column` stacks the children instead of a row. */
  flexDirection?: 'row' | 'column';
  /** Space between the children, in px, from the 4px grid: 0, 2, 4, 8, 12, 16, 24, 32, 48 or 64. The old values (10, 13, 20, 30, 40) still work: they snap to the grid, with a console warning. */
  itemSpacing?: Spacing | LegacySpacing;
  /** With `display="flex"`: how the children line up across the row (CSS `align-items`). */
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  /** With `display="flex"`: how the children spread along the row (CSS `justify-content`). */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  /** `block` makes every child `display: block` (e.g. links stacked one per line). */
  itemDisplay?: 'block';
  /** What to lay out. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * Stacks its children in a column (`block`) or a row (`flex`) with even
 * space between them, from the 4px spacing grid. Any other prop goes on the
 * wrapping `<div>`.
 */
export default function Layout({
  alignItems,
  className,
  display = 'block',
  flexDirection,
  justifyContent,
  itemDisplay,
  itemSpacing = 16,
  ...restProps
}: LayoutProps) {
  return (
    <div
      className={ classNames(className, 'layout', CONSTANT.CLASS_PREFIX) }
      data-align-items={ alignItems }
      data-display={ display }
      data-flex-direction={ flexDirection }
      data-item-display={ itemDisplay }
      data-item-spacing={ toGrid(itemSpacing) }
      data-justify-content={ justifyContent }
      { ...restProps }
    />
  );
}
