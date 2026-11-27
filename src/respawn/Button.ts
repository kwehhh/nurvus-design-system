import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps, Listener } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Button/Button.scss';

export type ButtonSize = 'extra-large' | 'large' | 'medium' | 'small' | 'mini';
export type ButtonType = 'primary' | 'secondary';

export interface ButtonProps extends ElementProps {
  /** Size of the button. */
  size?: ButtonSize;
  /** Look: primary (filled with the accent) or secondary (quiet). Not the HTML type attribute. */
  type?: ButtonType;
  /** Called on a click with the event and the button. */
  onClick?: Listener<MouseEvent>;
  /** Content to render inside the button. */
  children?: Child;
}

/** A `<button>`. Any other prop (onClick, disabled, aria-*) goes on it. Same markup as the React Button. */
export default function Button(props: ButtonProps = {}): NurvusElement<HTMLButtonElement, ButtonProps> {
  return updatable(({ className, children, size = 'medium', type = 'primary', ...rest }: ButtonProps) => spawn<HTMLButtonElement>({
    className: classNames(className, 'button', CONSTANT.CLASS_PREFIX),
    'data-size': size,
    'data-type': type,
    ...rest,
    tag: 'button',
    children,
  }), props);
}
