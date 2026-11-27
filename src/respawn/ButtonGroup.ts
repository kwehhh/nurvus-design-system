import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/ButtonGroup/ButtonGroup.scss';

export interface ButtonGroupProps extends ElementProps {
  /** The Buttons to join. */
  children?: Child;
}

/** Joins Buttons into one row: square corners where they meet, rounded at the two outer ends. */
export default function ButtonGroup(props: ButtonGroupProps = {}): NurvusElement<HTMLDivElement, ButtonGroupProps> {
  return updatable(({ className, ...rest }: ButtonGroupProps) => spawn<HTMLDivElement>({
    className: classNames(className, 'button-group', CONSTANT.CLASS_PREFIX),
    ...rest,
    tag: 'div',
  }), props);
}
