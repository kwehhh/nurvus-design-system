import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Kbd/Kbd.scss';

export interface KbdProps extends ElementProps {
  /** The keys of a shortcut, in order: ['⌘', 'B']. Each is drawn as a key cap. */
  keys?: string[];
  /** One key, when there is only one (instead of keys). */
  children?: Child;
}

/** A keyboard key or shortcut as key caps: the same markup as the React Kbd. */
export default function Kbd(props: KbdProps = {}): NurvusElement<HTMLElement, KbdProps> {
  return updatable(({ keys, children, className, ...rest }: KbdProps) => spawn<HTMLElement>({
    tag: 'kbd',
    className: classNames(className, 'kbd', CONSTANT.CLASS_PREFIX),
    ...rest,
    children: (keys && keys.length ? keys : [children]).map((key) => spawn({ tag: 'kbd', className: 'kbd-key', children: key as Child })),
  }), props);
}
