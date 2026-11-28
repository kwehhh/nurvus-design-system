import classNames from 'classnames';
import CONSTANT from '../constants';
import { focusItem, triggerKey } from '../dropdown';
import Button, { ButtonSize, ButtonType } from './Button';
import Menu, { MenuItem, MenuSection } from './Menu';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Dropdown/Dropdown.scss';

export interface DropdownProps extends ElementProps {
  /** What the button says (text, or an Icon with a label for an icon-only button). */
  label: Child;
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
}

/**
 * A button that opens a menu of actions, the same markup and keys as the React
 * Dropdown. Opening and closing change it in place (the element stays the same).
 */
export default function Dropdown(props: DropdownProps): NurvusElement<HTMLDivElement, DropdownProps> {
  return updatable(({
    label, sections, items, align = 'start', type = 'secondary', size = 'medium', disabled = false, id, className, ...rest
  }: DropdownProps) => {
    let open = false;
    let root: HTMLDivElement;
    let button: HTMLButtonElement;
    const away = (event: MouseEvent) => { if (!root.contains(event.target as Node)) set(false); };
    function set(next: boolean, which?: 'first' | 'last', refocus = false) {
      open = next;
      root.setAttribute('data-open', String(open));
      button.setAttribute('aria-expanded', String(open));
      if (open) {
        document.addEventListener('mousedown', away);
        if (which) focusItem(root, which);
      } else {
        document.removeEventListener('mousedown', away);
        if (refocus) button.focus();
      }
    }
    // Choosing an action runs it, then closes the menu with focus on the button.
    const wrap = (list: MenuItem[]): MenuItem[] => list.map((item) => ({
      ...item,
      onSelect: (event: MouseEvent) => { if (item.onSelect) item.onSelect(event); set(false, undefined, true); },
    }));
    const groups: MenuSection[] = (sections || [{ items: items || [] }]).map((s) => ({ ...s, items: wrap(s.items) }));

    button = Button({
      id: `${id}-button`,
      className: 'dropdown-trigger',
      type,
      size,
      disabled,
      'aria-haspopup': 'menu',
      'aria-expanded': false,
      'aria-controls': `${id}-menu`,
      events: {
        click: () => (open ? set(false) : set(true, 'first')),
        keydown: (event: KeyboardEvent) => { const which = triggerKey(event); if (which) { event.preventDefault(); set(true, which); } },
      },
      children: [label, spawn({ tag: 'span', className: 'dropdown-chevron', 'aria-hidden': true })],
    });
    const { events, ...others } = rest;
    root = spawn<HTMLDivElement>({
      className: classNames(className, 'dropdown', CONSTANT.CLASS_PREFIX),
      'data-open': false,
      'data-align': align,
      ...others,
      events: {
        ...(events as object),
        keydown: (event: KeyboardEvent) => { if (event.key === 'Escape' && open) { event.preventDefault(); set(false, undefined, true); } },
        focusout: (event: FocusEvent) => { if (open && !root.contains(event.relatedTarget as Node)) set(false); },
      },
      children: [button, spawn({ className: 'dropdown-popup', children: Menu({ kind: 'actions', id: `${id}-menu`, 'aria-labelledby': `${id}-button`, sections: groups }) })],
    });
    return root;
  }, props);
}
