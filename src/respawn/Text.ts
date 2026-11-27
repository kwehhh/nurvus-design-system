import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Text/Text.scss';

export type TextVariant = 'display' | 'title' | 'body' | 'caption' | 'mono';
export type TextTone = 'default' | 'muted' | 'subtle';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends ElementProps {
  /** The element to render: 'p' for a paragraph, 'span' inside a line, 'h1'…, 'label'. */
  as?: string;
  /** Type role: display, title, body, caption or mono. Without one it inherits its parent's type. */
  variant?: TextVariant;
  /** Text color from the theme: default (text), muted or subtle. */
  tone?: TextTone;
  /** Font weight, overriding the role's own: regular 400, medium 500, semibold 600, bold 700. */
  weight?: TextWeight;
  /** The text. */
  children?: Child;
}

/** Text in one of the type roles. A paragraph is `Text({ as: 'p', variant: 'body', children: '…' })`. */
export default function Text(props: TextProps = {}): NurvusElement<HTMLElement, TextProps> {
  return updatable(({ as = 'span', variant, tone, weight, children, className, ...rest }: TextProps) => spawn({
    className: classNames(className, 'text', CONSTANT.CLASS_PREFIX),
    'data-variant': variant,
    'data-tone': tone,
    'data-weight': weight,
    ...rest,
    tag: as,
    children,
  }), props);
}
