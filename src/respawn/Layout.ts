import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Layout/Layout.scss';

// Shared with the React Layout, so both snap and warn the same way.
import { Spacing, LegacySpacing, toGrid } from '../spacing';

export type { Spacing, LegacySpacing };

export interface LayoutProps extends ElementProps {
  /** `block` stacks the children top to bottom; `flex` puts them in a row. */
  display?: 'block' | 'flex';
  /** With `display: 'flex'`: `column` stacks the children instead of a row. */
  flexDirection?: 'row' | 'column';
  /** Space between the children, in px, from the 4px grid: 0, 2, 4, 8, 12, 16, 24, 32, 48 or 64. The old values (10, 13, 20, 30, 40) still work: they snap to the grid, with a console warning. */
  itemSpacing?: Spacing | LegacySpacing;
  /** With `display: 'flex'`: how the children line up across the row (CSS `align-items`). */
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  /** With `display: 'flex'`: how the children spread along the row (CSS `justify-content`). */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  /** `block` makes every child `display: block` (e.g. links stacked one per line). */
  itemDisplay?: 'block';
  /** What to lay out. */
  children?: Child;
}

/** Stacks its children in a column (`block`) or a row (`flex`) with even space between them. */
export default function Layout(props: LayoutProps = {}): NurvusElement<HTMLDivElement, LayoutProps> {
  return updatable(({
    alignItems, className, display = 'block', flexDirection, justifyContent, itemDisplay, itemSpacing = 16, ...rest
  }: LayoutProps) => spawn<HTMLDivElement>({
    className: classNames(className, 'layout', CONSTANT.CLASS_PREFIX),
    'data-align-items': alignItems,
    'data-display': display,
    'data-flex-direction': flexDirection,
    'data-item-display': itemDisplay,
    'data-item-spacing': toGrid(itemSpacing),
    'data-justify-content': justifyContent,
    ...rest,
    tag: 'div',
  }), props);
}
