import classNames from 'classnames';
import CONSTANT from '../constants';
import { iconNodes, IconName } from '../icons';
import { spawn, ElementProps } from './spawn';
import { updatable } from './update';
import '../components/Icon/Icon.scss';

const SVG = 'http://www.w3.org/2000/svg';

export interface IconProps extends ElementProps {
  /** Which icon (Foundations > Icons lists them all). */
  name: IconName;
  /** Width and height. Defaults to 1em: the icon is as big as the text around it. A number is pixels. */
  size?: number | string;
  /** Says what the icon means, for an icon that stands alone (screen readers read it). Leave it out when text beside it already says it. */
  label?: string;
  /** Line thickness in grid units (the grid is 24). */
  strokeWidth?: number;
}

/** The <svg> Icon returns, with update() like every other component. */
export type IconElement = SVGSVGElement & { update(changes: Partial<IconProps>): IconElement };

/**
 * An icon from the NURVUS set, as an <svg> element: the same markup as the
 * React Icon. 1em by default, in the text's color; decorative unless it has a
 * label. icon.update({ name: 'check' }) swaps it for another.
 */
export default function Icon(props: IconProps): IconElement {
  return updatable(({ name, size = '1em', label, strokeWidth = 2, className, ...rest }: IconProps) => spawn<any>({
    tag: 'svg',
    namespace: SVG,
    className: classNames(className, 'icon', CONSTANT.CLASS_PREFIX),
    'data-icon': name,
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    ...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: 'false' }),
    ...rest,
    children: iconNodes(name).map(([tag, attrs]) => spawn({ tag, namespace: SVG, ...attrs })),
  }), props) as unknown as IconElement;
}
