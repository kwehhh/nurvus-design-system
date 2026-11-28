import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { iconNodes, IconName } from '../../icons';
import './Icon.scss';

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'name'> {
  /** Which icon (Foundations > Icons lists them all). */
  name: IconName;
  /** Width and height. Defaults to 1em: the icon is as big as the text around it. A number is pixels. */
  size?: number | string;
  /** Says what the icon means, for an icon that stands alone (screen readers read it). Leave it out when text beside it already says it. */
  label?: string;
  /** Line thickness in grid units (the grid is 24). */
  strokeWidth?: number;
  /** Custom class name. */
  className?: string;
}

/**
 * An icon from the NURVUS set: drawn on a 24-unit grid with round 2-unit
 * lines, in the text's color (currentColor), and 1em by default so it matches
 * the text it sits in. Decorative unless you give it a label.
 */
export default function Icon({ name, size = '1em', label, strokeWidth = 2, className, ...restProps }: IconProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: 'false' as const };
  return (
    <svg
      className={ classNames(className, 'icon', CONSTANT.CLASS_PREFIX) }
      data-icon={ name }
      viewBox="0 0 24 24"
      width={ size }
      height={ size }
      fill="none"
      stroke="currentColor"
      strokeWidth={ strokeWidth }
      strokeLinecap="round"
      strokeLinejoin="round"
      { ...a11y }
      { ...restProps }
    >
      { iconNodes(name).map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs })) }
    </svg>
  );
}
