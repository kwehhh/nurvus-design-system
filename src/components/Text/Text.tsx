import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Text.scss';

export type TextVariant = 'display' | 'title' | 'body' | 'caption' | 'mono';
export type TextTone = 'default' | 'muted' | 'subtle';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** The element to render: 'p' for a paragraph, 'span' inside a line, 'h1'…, 'label'. */
  as?: React.ElementType;
  /**
   * Type role: display (the one big headline), title (section headings),
   * body (running text), caption (labels and notes), mono (values and code).
   */
  variant?: TextVariant;
  /** Text color from the theme: default (text), muted or subtle. */
  tone?: TextTone;
  /** Font weight, overriding the role's own: regular 400, medium 500, semibold 600, bold 700. */
  weight?: TextWeight;
  /** The text. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * Text in one of the type roles (display, title, body, caption, mono). The
 * sizes come from the `--nv-type-*` tokens, so every NURVUS page uses the same
 * scale. Without a `variant` it inherits its parent's type. A paragraph is
 * `<Text as="p" variant="body">`.
 */
export default function Text({
  as: Element = 'span',
  variant,
  tone,
  weight,
  children,
  className,
  ...restProps
}: TextProps) {
  return (
    <Element
      className={ classNames(className, 'text', CONSTANT.CLASS_PREFIX) }
      data-variant={ variant }
      data-tone={ tone }
      data-weight={ weight }
      { ...restProps }
    >
      { children }
    </Element>
  );
}
