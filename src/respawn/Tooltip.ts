import classNames from 'classnames';
import CONSTANT from '../constants';
import { keyboardFocus } from '../tooltip';
import Kbd from './Kbd';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Tooltip/Tooltip.scss';

export interface TooltipProps extends ElementProps {
  /** What the tooltip says. */
  content: Child;
  /** A keyboard shortcut to show after it, as key caps: ['⌘', 'B']. */
  shortcut?: string[];
  /** The tooltip's id: the control is described by it (aria-describedby). */
  id: string;
  /** Below the control (default) or above it. */
  placement?: 'bottom' | 'top';
  /** Which edge it lines up with: centered (default), or the control's start or end edge. */
  align?: 'center' | 'start' | 'end';
  /** How long the pointer must rest on the control before it shows, in ms. */
  delay?: number;
  /** The one control it describes (an element: it gets aria-describedby). */
  children: HTMLElement;
}

/** A short label for a control, the same markup and behavior as the React Tooltip; it opens and closes in place. */
export default function Tooltip(props: TooltipProps): NurvusElement<HTMLSpanElement, TooltipProps> {
  return updatable(({ content, shortcut, id, placement = 'bottom', align = 'center', delay = 300, children, className }: TooltipProps) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') set(false); };
    let el: HTMLSpanElement;
    function set(open: boolean) {
      clearTimeout(timer as any);
      el.setAttribute('data-open', String(open));
      if (open) document.addEventListener('keydown', esc); else document.removeEventListener('keydown', esc);
    }
    children.setAttribute('aria-describedby', id);
    el = spawn<HTMLSpanElement>({
      tag: 'span',
      className: classNames(className, 'tooltip', CONSTANT.CLASS_PREFIX),
      'data-open': false,
      'data-placement': placement,
      'data-align': align,
      events: {
        mouseenter: () => { clearTimeout(timer as any); timer = setTimeout(() => set(true), delay); },
        mouseleave: () => set(false),
        focusin: (event: FocusEvent) => { if (keyboardFocus(event.target)) set(true); },
        focusout: () => set(false),
      },
      children: [
        children,
        spawn({
          tag: 'span',
          className: 'tooltip-bubble',
          role: 'tooltip',
          id,
          children: [spawn({ tag: 'span', className: 'tooltip-text', children: content }), shortcut && shortcut.length ? Kbd({ keys: shortcut }) : null],
        }),
      ],
    });
    return el;
  }, props);
}
