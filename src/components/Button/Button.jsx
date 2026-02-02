import React from 'react';
import classNames  from 'classnames';
import PropTypes from 'prop-types';
import CONSTANT from '../../constants.js';
import './Button.scss';

/**
 * Button component.
 * @returns {ReactElement} of Button component.
 */
const Button = React.forwardRef(function Button(props, ref) {
  const {
    className,
    children,
    size = 'medium',
    type = 'primary',
    ...restProps
  } = props;

  return (
    <button
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'button', className) }
      data-size={ size }
      data-type={ type }
      ref={ ref }
      { ...restProps }
    >
      { children }
    </button>
  );
});

Button.propTypes = {
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * Content to render inside button.
   */
  children: PropTypes.node,
  /**
   * Size of button.
   */
  size: PropTypes.oneOf([
    'extra-large',
    'large',
    'medium',
    'small',
    'mini'
  ]),
  /**
   * Size of button.
   */
  type: PropTypes.oneOf([
    'primary',
    'secondary'
  ])
};

export default Button;
