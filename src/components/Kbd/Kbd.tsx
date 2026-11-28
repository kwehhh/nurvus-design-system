import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Kbd.scss';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** The keys of a shortcut, in order: ['⌘', 'B']. Each is drawn as a key cap. */
  keys?: string[];
  /** One key, when there is only one (instead of keys). */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * A keyboard key, or a shortcut of several (⌘ B), drawn as key caps. The HTML
 * way: a <kbd> for the shortcut holding a <kbd> per key, so screen readers and
 * search engines know it is keyboard input. Sized in em, so it matches the
 * text around it.
 */
export default function Kbd({ keys, children, className, ...restProps }: KbdProps) {
  const caps = keys && keys.length ? keys : [children];
  return (
    <kbd className={ classNames(className, 'kbd', CONSTANT.CLASS_PREFIX) } { ...restProps }>
      { caps.map((key, i) => <kbd key={ i } className="kbd-key">{ key }</kbd>) }
    </kbd>
  );
}
