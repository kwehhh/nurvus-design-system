import classNames from 'classnames';
import CONSTANT from '../constants';
import { sectionId, startsOpen, menuKeydown, menuFocus, menuKind, MenuKind } from '../menu';
import Tree, { TreeProps } from './Tree';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Menu/Menu.scss';

export type { MenuKind };

export interface MenuItem {
  /** What the item says. */
  label: Child;
  /** Makes the item a link to this address. The item whose href equals `current` is marked as the current page. */
  href?: string;
  /** Makes the item a button that calls this (an action: "Duplicate", "Sign out"). */
  onSelect?: (event: MouseEvent) => void;
  /** Shows the item but stops it working (actions only). */
  disabled?: boolean;
  /** Draws a hairline above this item, to split a section into groups. */
  divider?: boolean;
}

export interface MenuSection {
  /** Stable id: names the section's open state and links its toggle to its list. Defaults to the title. */
  id?: string;
  /** The section heading. Optional for actions. */
  title?: string;
  /** Makes the heading a link too (e.g. to the section's overview page). */
  href?: string;
  /** The section's items. */
  items: MenuItem[];
}

/** What navigation and actions take. */
interface MenuBaseProps extends ElementProps {
  /** Navigation and actions: the sections, in order. */
  sections?: MenuSection[];
  /** The href of the page being shown: its link is marked, and its section opens. */
  current?: string;
  /** Which sections start open: true (all), false (none) or a map of section id -> open. Defaults to all. */
  defaultOpen?: boolean | Record<string, boolean>;
  /** Called when a section opens or closes (e.g. to remember it). */
  onToggle?: (id: string, open: boolean) => void;
  /** Called when any link is clicked, with its href (e.g. to close a drawer). */
  onNavigate?: (href: string, event: MouseEvent) => void;
  /** What screen readers call the menu ("Pages", "Actions"). */
  label?: string;
  /** Prefix for the ids inside (each toggle names its list). Defaults to "menu". */
  id?: string;
  /** Navigation: the chevron before the title ('start', the default: right when closed, down when open, a guide line down the items) or after it ('end'). */
  chevron?: 'start' | 'end';
}

export interface MenuProps extends MenuBaseProps {
  /** What the menu is: 'nav' (links), 'actions' (commands) or 'tree' (rows to pick from, with Tree's props). Left out, it follows the props. */
  kind?: MenuKind;
  /** Tree: the rows, each with optional child `items`. */
  items?: TreeProps['items'];
  /** Tree: the picked row as a path of indexes. */
  activePath?: number[];
  /** Tree: draws a row's content instead of its label. */
  itemRenderer?: TreeProps['itemRenderer'];
  /** Tree: the deepest level that still indents. */
  maxIndentDepth?: number;
}

/** Menu's props for navigation and actions. */
export interface MenuListProps extends MenuBaseProps {
  /** 'nav' or 'actions'; left out, it follows the items. */
  kind?: 'nav' | 'actions';
}
/** Menu kind: 'tree': Tree's props. */
export type MenuTreeProps = TreeProps & { kind: 'tree' };

/**
 * One component for lists of things to go to, do or pick, the same markup as
 * the React Menu. The items decide what it is, and screen readers hear it so:
 * links make navigation (sections open and close in place; update({ current })
 * marks another page), actions make a menu of commands (one Tab stop, the
 * arrow keys move), kind: 'tree' makes a Tree.
 */
export default function Menu(props: MenuProps = { sections: [] }): NurvusElement<HTMLElement, MenuProps> {
  const kind = menuKind(props || {});
  if (kind === 'tree') {
    const { kind: _kind, sections: _s, current: _c, defaultOpen: _d, onToggle: _t, onNavigate: _n, chevron: _ch, ...tree } = props;
    return Tree(tree as TreeProps) as any;
  }
  if (kind === 'actions') return MenuActions(props as MenuListProps) as any;
  return updatable<HTMLElement, MenuListProps>(({
    kind: _kind, sections = [], current, defaultOpen = true, onToggle, onNavigate, chevron = 'start', label = 'Pages', id = 'menu', className, ...rest
  }: MenuListProps, keep) => {
    const open: Record<string, boolean> = Object.fromEntries(sections.map((s) => [sectionId(s), startsOpen(defaultOpen, sectionId(s))]));
    // The current page's section always starts open, as in React.
    const home = sections.find((s) => s.items.some((item) => item.href !== undefined && item.href === current));
    if (home) open[sectionId(home)] = true;

    const navigate = (href: string) => ({ click: (event: MouseEvent) => { if (onNavigate) onNavigate(href, event); } });

    const renderSection = (section: MenuSection): HTMLElement => {
      const sid = sectionId(section);
      const listId = `${id}-${sid}`;
      const toggles: HTMLElement[] = [];
      const toggle = () => {
        open[sid] = !open[sid];
        keep({ defaultOpen: { ...open } });
        el.setAttribute('data-open', String(open[sid]));
        toggles.forEach((t) => {
          t.setAttribute('aria-expanded', String(open[sid]));
          if (t.hasAttribute('aria-label')) t.setAttribute('aria-label', `${open[sid] ? 'Hide' : 'Show'} ${String(section.title)}`);
        });
        if (onToggle) onToggle(sid, open[sid]);
      };
      const toggleProps = (extra: Record<string, unknown>) => ({
        tag: 'button', type: 'button', 'aria-expanded': open[sid], 'aria-controls': listId, events: { click: toggle }, ...extra,
      });
      const link = () => spawn({ tag: 'a', className: 'menu-title', href: section.href, 'data-active': current === section.href, events: navigate(section.href as string), children: section.title });
      const chev = () => spawn(toggleProps({ className: 'menu-toggle', 'aria-label': `${open[sid] ? 'Hide' : 'Show'} ${String(section.title)}` }));
      const heading = section.href
        ? (chevron === 'start' ? [chev(), link()] : [link(), chev()])
        : [spawn(toggleProps({ className: 'menu-title menu-toggle', children: section.title }))];
      heading.forEach((h) => { if (h.tagName === 'BUTTON') toggles.push(h); });

      const el: HTMLElement = spawn({
        className: 'menu-section',
        'data-section': sid,
        'data-open': open[sid],
        children: [
          spawn({ className: 'menu-heading', children: heading }),
          spawn({
            className: 'menu-items',
            id: listId,
            children: spawn({
              tag: 'ul',
              children: section.items.map((item) => spawn({
                tag: 'li',
                'data-divider': item.divider || undefined,
                children: item.href !== undefined
                  ? spawn({
                    tag: 'a',
                    className: 'menu-item',
                    href: item.href,
                    'data-active': current === item.href,
                    'aria-current': current === item.href ? 'page' : undefined,
                    events: navigate(item.href),
                    children: item.label,
                  })
                  : spawn({
                    tag: 'button',
                    type: 'button',
                    className: 'menu-item',
                    disabled: item.disabled,
                    events: { click: (event: MouseEvent) => { if (item.onSelect) item.onSelect(event); } },
                    children: item.label,
                  }),
              })),
            }),
          }),
        ],
      });
      return el;
    };

    const { events, ...others } = rest;
    return spawn<HTMLElement>({
      tag: 'nav',
      className: classNames(className, 'menu', CONSTANT.CLASS_PREFIX),
      'aria-label': label,
      'data-kind': 'nav',
      'data-chevron': chevron,
      ...others,
      events: {
        ...events,
        keydown: (event: KeyboardEvent, el: HTMLElement) => {
          menuKeydown(event, el);
          if (events && events.keydown) events.keydown(event, el);
        },
      },
      children: sections.map(renderSection),
    });
  }, props as MenuListProps) as any;
}

/** A menu of actions (role="menu"): one Tab stop that follows the focus, arrow keys, type to find. */
function MenuActions(props: MenuListProps): NurvusElement<HTMLElement, MenuListProps> {
  return updatable(({
    kind: _kind, sections = [], label = 'Actions', id = 'menu', className, current: _c, defaultOpen: _d, onToggle: _t, onNavigate: _n, chevron: _ch, ...rest
  }: MenuListProps) => {
    let first = true;
    const { events, ...others } = rest;
    return spawn<HTMLElement>({
      className: classNames(className, 'menu', CONSTANT.CLASS_PREFIX),
      role: 'menu',
      id,
      'aria-label': label,
      'data-kind': 'actions',
      ...others,
      events: {
        ...events,
        keydown: (event: KeyboardEvent, el: HTMLElement) => { menuKeydown(event, el); if (events && events.keydown) events.keydown(event, el); },
        focusin: (event: FocusEvent, el: HTMLElement) => { menuFocus(event, el); if (events && events.focusin) events.focusin(event, el); },
      },
      children: sections.map((section, s) => {
        const sid = sectionId({ id: section.id, title: section.title ?? `section-${s + 1}` });
        const titleId = `${id}-${sid}-title`;
        return spawn({
          className: 'menu-section',
          'data-section': sid,
          role: 'group',
          'aria-labelledby': section.title ? titleId : undefined,
          children: [
            section.title ? spawn({ className: 'menu-heading', children: spawn({ tag: 'span', className: 'menu-title', id: titleId, children: section.title }) }) : null,
            spawn({
              className: 'menu-items',
              children: spawn({
                tag: 'ul',
                role: 'none',
                children: section.items.map((item) => {
                  const tabindex = first ? 0 : -1;
                  first = false;
                  return spawn({
                    tag: 'li',
                    role: 'none',
                    'data-divider': item.divider || undefined,
                    children: spawn({
                      tag: 'button',
                      type: 'button',
                      role: 'menuitem',
                      className: 'menu-item',
                      tabindex,
                      'aria-disabled': item.disabled || undefined,
                      events: { click: (event: MouseEvent) => { if (!item.disabled && item.onSelect) item.onSelect(event); } },
                      children: item.label,
                    }),
                  });
                }),
              }),
            }),
          ],
        });
      }),
    });
  }, props);
}
