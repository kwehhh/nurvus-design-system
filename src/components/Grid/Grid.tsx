import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { Spacing } from '../../spacing';
import { Responsive, responsiveData } from '../../breakpoints';
import './Grid.scss';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How many equal columns: 1 to 12. Can change with the width: { base: 1, md: 2, lg: 3 }. */
  columns?: Responsive<GridColumns>;
  /** Instead of a count: as many columns as fit, each at least this wide (e.g. "15rem" or 240). They fill the row. */
  minItemWidth?: string | number;
  /** Space between cells, from the 4px grid: 0, 2, 4, 8, 12, 16, 24, 32, 48 or 64. */
  gap?: Spacing;
  /** Space between rows when it differs from gap. */
  rowGap?: Spacing;
  /** How cells line up in their row. Defaults to stretch (equal heights). */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** What to lay out. A child spans more columns with style={{ gridColumn: 'span 2' }}. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * Lays its children out in columns: a fixed count that changes at the
 * breakpoints (1 on phones, 3 on desktops), or as many as fit at a minimum
 * width. Columns share the width equally and never overflow it.
 */
export default function Grid({
  columns,
  minItemWidth,
  gap = 16,
  rowGap,
  align,
  className,
  style,
  ...restProps
}: GridProps) {
  const fit = minItemWidth !== undefined;
  return (
    <div
      className={ classNames(className, 'grid', CONSTANT.CLASS_PREFIX) }
      { ...(fit ? { 'data-fit': true } : responsiveData('columns', columns === undefined ? 1 : columns)) }
      data-gap={ gap }
      data-row-gap={ rowGap }
      data-align={ align }
      style={ fit ? { '--nurvus-grid-min': typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth, ...style } as React.CSSProperties : style }
      { ...restProps }
    />
  );
}
