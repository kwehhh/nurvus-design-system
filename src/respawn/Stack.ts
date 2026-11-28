import classNames from 'classnames';
import CONSTANT from '../constants';
import { Spacing } from '../spacing';
import { Responsive, responsiveData } from '../breakpoints';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Stack/Stack.scss';

export type StackDirection = 'column' | 'row';

export interface StackProps extends ElementProps {
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
  children?: Child;
}

/** A column or a row with even space between the children, the same markup as the React Stack. */
export default function Stack(props: StackProps = {}): NurvusElement<HTMLDivElement, StackProps> {
  return updatable(({ direction = 'column', gap = 16, align, justify, wrap = false, className, ...rest }: StackProps) => spawn<HTMLDivElement>({
    className: classNames(className, 'stack', CONSTANT.CLASS_PREFIX),
    ...responsiveData('direction', direction),
    'data-gap': gap,
    'data-align': align,
    'data-justify': justify,
    'data-wrap': wrap || undefined,
    ...rest,
  }), props);
}
