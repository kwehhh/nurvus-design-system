import classNames from 'classnames';
import CONSTANT from '../constants';
import { Spacing } from '../spacing';
import { Responsive, responsiveData } from '../breakpoints';
import { spawn, Child, ElementProps, Style } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Grid/Grid.scss';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridProps extends ElementProps {
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
  /** What to lay out. */
  children?: Child;
}

/** Columns: a count that changes at the breakpoints, or as many as fit. The same markup as the React Grid. */
export default function Grid(props: GridProps = {}): NurvusElement<HTMLDivElement, GridProps> {
  return updatable(({ columns, minItemWidth, gap = 16, rowGap, align, className, style, ...rest }: GridProps) => {
    const fit = minItemWidth !== undefined;
    const min = typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth;
    return spawn<HTMLDivElement>({
      className: classNames(className, 'grid', CONSTANT.CLASS_PREFIX),
      ...(fit ? { 'data-fit': true } : responsiveData('columns', columns === undefined ? 1 : columns)),
      'data-gap': gap,
      'data-row-gap': rowGap,
      'data-align': align,
      style: fit ? { '--nurvus-grid-min': min, ...(typeof style === 'object' ? style : {}) } as Style : style,
      ...rest,
    });
  }, props);
}
