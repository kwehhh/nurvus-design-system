import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CONSTANT from '../../constants.js';
import './Text.scss';

/**
 * Text in one of the type roles (display, title, body, caption, mono). The
 * sizes come from the `--nv-type-*` tokens, so every NURVUS page uses the same
 * scale. Without a `variant` it inherits its parent's type, as before.
 */
export default function Text(props) {
  const {
    as: Element = 'span',
    variant,
    tone,
    children,
    className,
    ...restProps
  } = props;

  return (
    <Element
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'text', className) }
      data-variant={ variant }
      data-tone={ tone }
      { ...restProps }
    >
      { children }
    </Element>
  );
}

Text.propTypes = {
  /**
   * The element to render, e.g. 'p', 'h1', 'span'.
   */
  as: PropTypes.elementType,
  /**
   * Type role: display (the one big headline), title (section headings),
   * body (running text), caption (labels and notes), mono (values and code).
   */
  variant: PropTypes.oneOf(['display', 'title', 'body', 'caption', 'mono']),
  /**
   * Text color from the theme: default (text), muted or subtle.
   */
  tone: PropTypes.oneOf(['default', 'muted', 'subtle']),
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * The text.
   */
  children: PropTypes.node
};
