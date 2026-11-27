import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Button.scss';

export type ButtonSize = 'extra-large' | 'large' | 'medium' | 'small' | 'mini';
export type ButtonType = 'primary' | 'secondary';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Size of the button. */
  size?: ButtonSize;
  /** Look: primary (filled with the accent) or secondary (quiet). Not the HTML type attribute. */
  type?: ButtonType;
  /** Content to render inside the button. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * A button. Any other prop (onClick, disabled, aria-*) goes on the `<button>`,
 * and a ref reaches it too.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  className,
  children,
  size = 'medium',
  type = 'primary',
  ...restProps
}, ref) {
  return (
    <button
      className={ classNames(className, 'button', CONSTANT.CLASS_PREFIX) }
      data-size={ size }
      data-type={ type }
      ref={ ref }
      { ...restProps }
    >
      { children }
    </button>
  );
});

export default Button;
