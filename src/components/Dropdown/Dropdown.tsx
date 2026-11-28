import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import Button, { ButtonSize, ButtonType } from '../Button/Button';
import Menu, { MenuItem, MenuSection } from '../Menu/Menu';
import { focusItem, triggerKey } from '../../dropdown';
import './Dropdown.scss';

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** What the button says (text, or an Icon with a label for an icon-only button). */
  label: React.ReactNode;
  /** The actions, in groups (each may have a title). */
  sections?: MenuSection[];
  /** Or the actions as one flat list. */
  items?: MenuItem[];
  /** Which edge of the button the menu lines up with. */
  align?: 'start' | 'end';
  /** The button's look. Defaults to secondary. */
  type?: ButtonType;
  /** The button's size. */
  size?: ButtonSize;
  /** Stops the button working. */
  disabled?: boolean;
  /** Names the button and the menu ("<id>-button", "<id>-menu"). */
  id: string;
  /** Custom class name. */
  className?: string;
}

/**
 * A button that opens a menu of actions (the WAI-ARIA menu button pattern).
 * A click, Enter, Space or ↓ opens it on its first item, ↑ on its last; inside,
 * the Menu's keys work (↑ ↓ Home End, type a letter); choosing an action runs
 * it, closes the menu and puts focus back on the button; Esc does the same
 * without choosing; Tab or a click outside closes it.
 */
export default function Dropdown({
  label,
  sections,
  items,
  align = 'start',
  type = 'secondary',
  size = 'medium',
  disabled = false,
  id,
  className,
  ...restProps
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const button = React.useRef<HTMLButtonElement>(null);
  const pending = React.useRef<'first' | 'last' | null>(null);

  // Focus goes into the menu once it shows.
  React.useEffect(() => {
    if (open && pending.current && root.current) { focusItem(root.current, pending.current); pending.current = null; }
  }, [open]);

  // A press anywhere outside closes it.
  React.useEffect(() => {
    if (!open) return undefined;
    const away = (event: MouseEvent) => { if (root.current && !root.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);

  const show = (which: 'first' | 'last') => { pending.current = which; setOpen(true); };
  const close = (refocus: boolean) => { setOpen(false); if (refocus && button.current) button.current.focus(); };

  // Choosing an action runs it, then closes the menu with focus on the button.
  const wrap = (list: MenuItem[]): MenuItem[] => list.map((item) => ({
    ...item,
    onSelect: (event) => { if (item.onSelect) item.onSelect(event); close(true); },
  }));
  const groups: MenuSection[] = (sections || [{ items: items || [] }]).map((s) => ({ ...s, items: wrap(s.items) }));

  return (
    <div
      ref={ root }
      className={ classNames(className, 'dropdown', CONSTANT.CLASS_PREFIX) }
      data-open={ open }
      data-align={ align }
      { ...restProps }
      onKeyDown={ (event) => {
        if (event.key === 'Escape' && open) { event.preventDefault(); close(true); }
      } }
      onBlur={ (event) => { if (open && root.current && !root.current.contains(event.relatedTarget as Node)) setOpen(false); } }
    >
      <Button
        ref={ button }
        id={ `${id}-button` }
        className="dropdown-trigger"
        type={ type }
        size={ size }
        disabled={ disabled }
        aria-haspopup="menu"
        aria-expanded={ open }
        aria-controls={ `${id}-menu` }
        onClick={ () => (open ? close(false) : show('first')) }
        onKeyDown={ (event) => { const which = triggerKey(event.nativeEvent); if (which) { event.preventDefault(); show(which); } } }
      >
        { label }
        <span className="dropdown-chevron" aria-hidden="true" />
      </Button>
      <div className="dropdown-popup">
        <Menu kind="actions" id={ `${id}-menu` } aria-labelledby={ `${id}-button` } sections={ groups } />
      </div>
    </div>
  );
}
