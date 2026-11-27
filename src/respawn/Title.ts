import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Title/Title.scss';

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TitleType = 'primary' | 'secondary';

export interface TitleProps extends ElementProps {
  /** Heading level: 1 renders `<h1>` (24px) down to 6 (`<h6>`). */
  level?: TitleLevel;
  /** `primary` uses the theme's text color; `secondary` the muted one. */
  type?: TitleType;
  /** The heading text. */
  children?: Child;
}

const TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;

/** A heading, `<h1>` to `<h6>`, in the theme's text color. */
export default function Title(props: TitleProps = {}): NurvusElement<HTMLHeadingElement, TitleProps> {
  return updatable(({ children, className, level = 1, type = 'primary', ...rest }: TitleProps) => spawn<HTMLHeadingElement>({
    className: classNames(className, 'title', CONSTANT.CLASS_PREFIX),
    'data-type': type,
    ...rest,
    tag: TAGS[level] || 'h6',
    children,
  }), props);
}
