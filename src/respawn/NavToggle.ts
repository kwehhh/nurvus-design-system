import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/NavToggle/NavToggle.scss';

const SVG = 'http://www.w3.org/2000/svg';

export type NavToggleMorph = 'slide' | 'cross' | 'squeeze' | 'elastic' | 'spin' | 'arrow' | 'chevron' | 'collapse';

export interface NavToggleProps extends ElementProps {
  /** Whether the navigation it controls is showing. */
  open: boolean;
  /** 'hamburger' (three bars) or 'sidebar' (a window with a side pane). */
  variant?: 'hamburger' | 'sidebar';
  /** Hamburger: how the bars change while open. */
  morph?: NavToggleMorph;
  /** Hamburger: bars of one length, or 'asymmetric'. */
  lines?: 'even' | 'asymmetric';
  /** What it shows and hides, for its name. */
  label?: string;
  /** The id of the navigation it controls (aria-controls). */
  controls?: string;
}

/**
 * The show/hide navigation button, the same markup as the React NavToggle.
 * toggle.update({ open }) changes it in place, so the shapes animate.
 */
export default function NavToggle(props: NavToggleProps): NurvusElement<HTMLButtonElement, NavToggleProps> {
  const draw = ({ open, variant = 'hamburger', morph = 'slide', lines = 'even', label = 'navigation', controls, className, ...rest }: NavToggleProps) => {
    const sidebar = variant === 'sidebar';
    return spawn<HTMLButtonElement>({
      tag: 'button',
      type: 'button',
      className: classNames(className, 'nav-toggle', CONSTANT.CLASS_PREFIX),
      'data-variant': variant,
      'data-morph': sidebar ? undefined : morph,
      'data-lines': sidebar ? undefined : lines,
      'data-open': open,
      'aria-expanded': open,
      'aria-controls': controls,
      'aria-label': `${open ? 'Hide' : 'Show'} ${label}`,
      ...rest,
      children: sidebar
        ? spawn<any>({
          tag: 'svg',
          namespace: SVG,
          className: 'nav-toggle-panel',
          viewBox: '0 0 24 24',
          'aria-hidden': true,
          focusable: 'false',
          children: [
            spawn<any>({ tag: 'rect', namespace: SVG, className: 'nav-toggle-outline', x: '2.5', y: '4', width: '19', height: '16', rx: '2.5' }),
            spawn<any>({ tag: 'rect', namespace: SVG, className: 'nav-toggle-fill', x: '4', y: '5.5', width: '5', height: '13', rx: '0.5' }),
            spawn<any>({ tag: 'path', namespace: SVG, className: 'nav-toggle-divider', d: 'M10 4V20' }),
          ],
        })
        : spawn({ tag: 'span', className: 'nav-toggle-bars', 'aria-hidden': true, children: [spawn({ tag: 'span' }), spawn({ tag: 'span' }), spawn({ tag: 'span' })] }),
    });
  };
  // Opening and closing change the element in place (so the bars move); other changes rebuild it, keeping the open state.
  let current = props;
  const wire = (el: NurvusElement<HTMLButtonElement, NavToggleProps>): NurvusElement<HTMLButtonElement, NavToggleProps> => {
    const rebuild = el.update;
    el.update = (changes) => {
      current = { ...current, ...changes };
      if (!Object.keys(changes).every((k) => k === 'open')) return wire(rebuild({ ...changes, open: current.open }));
      const open = !!current.open;
      el.setAttribute('data-open', String(open));
      el.setAttribute('aria-expanded', String(open));
      el.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} ${current.label || 'navigation'}`);
      return el;
    };
    return el;
  };
  return wire(updatable(draw, props));
}
