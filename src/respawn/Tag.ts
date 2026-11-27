import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Tag/Tag.scss';

export type TagTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface TagProps extends ElementProps {
  /** Color: neutral (muted text) or one of the theme's accent / status colors. */
  tone?: TagTone;
  /** The label. */
  children?: Child;
}

/** A small pill for a status or label ("new", "preview", "demo"). */
export default function Tag(props: TagProps = {}): NurvusElement<HTMLSpanElement, TagProps> {
  return updatable(({ tone = 'neutral', children, className, ...rest }: TagProps) => spawn<HTMLSpanElement>({
    className: classNames(className, 'tag', CONSTANT.CLASS_PREFIX),
    'data-tone': tone,
    ...rest,
    tag: 'span',
    children,
  }), props);
}
