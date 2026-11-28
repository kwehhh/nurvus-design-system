import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import Kbd from '../Kbd/Kbd';
import { keyboardFocus } from '../../tooltip';
import './Tooltip.scss';

export interface TooltipProps {
  /** What the tooltip says. */
  content: React.ReactNode;
  /** A keyboard shortcut to show after it, as key caps: ['⌘', 'B']. */
  shortcut?: string[];
  /** The tooltip's id: the control is described by it (aria-describedby). */
  id: string;
  /** Below the control (default) or above it. */
  placement?: 'bottom' | 'top';
  /** Which edge it lines up with: centered (default), or the control's start or end edge (near the screen's edges). */
  align?: 'center' | 'start' | 'end';
  /** How long the pointer must rest on the control before it shows, in ms. Keyboard focus shows it at once. */
  delay?: number;
  /** The one control it describes. */
  children: React.ReactElement;
  /** Custom class name. */
  className?: string;
}

/**
 * A short label for a control, shown while the pointer rests on it or it has
 * keyboard focus; optionally with its keyboard shortcut as key caps. It meets
 * WCAG 1.4.13: Esc hides it without moving focus, the pointer can move onto
 * it, and it stays until the pointer or focus leaves. Screen readers get it as
 * the control's description.
 */
export default function Tooltip({ content, shortcut, id, placement = 'bottom', align = 'center', delay = 300, children, className }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hide = () => { clearTimeout(timer.current as any); setOpen(false); };
  const show = (now: boolean) => {
    clearTimeout(timer.current as any);
    if (now) setOpen(true); else timer.current = setTimeout(() => setOpen(true), delay);
  };
  React.useEffect(() => () => clearTimeout(timer.current as any), []);
  // Esc hides it (focus stays where it is).
  React.useEffect(() => {
    if (!open) return undefined;
    const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') hide(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <span
      className={ classNames(className, 'tooltip', CONSTANT.CLASS_PREFIX) }
      data-open={ open }
      data-placement={ placement }
      data-align={ align }
      onMouseEnter={ () => show(false) }
      onMouseLeave={ hide }
      onFocus={ (event) => { if (keyboardFocus(event.target)) show(true); } }
      onBlur={ hide }
    >
      { React.cloneElement(children, { 'aria-describedby': id }) }
      <span className="tooltip-bubble" role="tooltip" id={ id }>
        <span className="tooltip-text">{ content }</span>
        { shortcut && shortcut.length > 0 && <Kbd keys={ shortcut } /> }
      </span>
    </span>
  );
}
