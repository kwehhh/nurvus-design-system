import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { sectionId, startsOpen, menuKeydown, menuFocus, menuKind, MenuKind } from '../../menu';
import Tree, { TreeProps, TreeItem } from '../Tree/Tree';
import './Menu.scss';

export type { MenuKind };

export interface MenuItem {
  /** What the item says. */
  label: React.ReactNode;
  /** Makes the item a link to this address. The item whose href equals `current` is marked as the current page. */
  href?: string;
  /** Makes the item a button that calls this (an action: "Duplicate", "Sign out"). */
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Shows the item but stops it working (actions only). */
  disabled?: boolean;
  /** Draws a hairline above this item, to split a section into groups. */
  divider?: boolean;
}

export interface MenuSection {
  /** Stable id: names the section's open state and links its toggle to its list. Defaults to the title. */
  id?: string;
  /** The section heading. Optional for actions. */
  title?: React.ReactNode;
  /** Makes the heading a link too (e.g. to the section's overview page). */
  href?: string;
  /** The section's items. */
  items: MenuItem[];
}

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onToggle' | 'onClick'> {
  /**
   * What the menu is, which decides what screen readers hear and which keys
   * work: 'nav' (links: a navigation landmark), 'actions' (commands: a menu
   * of buttons) or 'tree' (rows to pick from, with Tree's props). Left out,
   * it follows the props: navigation if any item has an href, actions if none
   * has, a tree for `items`.
   */
  kind?: MenuKind;
  /** Navigation and actions: the sections, in order. */
  sections?: MenuSection[];
  /** Navigation: the href of the page being shown. Its link is marked, and its section opens. */
  current?: string;
  /** Navigation: which sections start open: true (all), false (none) or a map of section id → open. Defaults to all. */
  defaultOpen?: boolean | Record<string, boolean>;
  /** Navigation: called when a section opens or closes (e.g. to remember it). */
  onToggle?: (id: string, open: boolean) => void;
  /** Navigation: called when any link is clicked, with its href (e.g. to close a drawer). */
  onNavigate?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Tree: the rows, each with optional child `items`. */
  items?: TreeItem[];
  /** Tree: the picked row as a path of indexes, e.g. [2, 0] = the first child of the third row. */
  activePath?: number[];
  /** Tree: called when a row is picked (a click, Enter or Space), with the event and the row's path. */
  onClick?: (event: React.MouseEvent<HTMLDivElement>, path: number[]) => void;
  /** Tree: draws a row's content instead of its label. */
  itemRenderer?: (item: TreeItem) => React.ReactNode;
  /** Tree: the deepest level that still indents. */
  maxIndentDepth?: number;
  /** What screen readers call the menu ("Pages", "Actions", "Layers"). */
  label?: string;
  /** Prefix for the ids inside (each toggle names its list). Defaults to "menu". */
  id?: string;
  /** Custom class name. */
  className?: string;
}

/** Menu's props for navigation and actions. */
export type MenuListProps = Omit<MenuProps, 'items' | 'activePath' | 'onClick' | 'itemRenderer' | 'maxIndentDepth'>;
/** Menu kind="tree": Tree's props (Tree is the same thing under its own name). */
export type MenuTreeProps = TreeProps & { kind: 'tree' };

/**
 * One component for lists of things to go to, do or pick. The items decide
 * what it is, and screen readers hear it that way:
 *  - links: site navigation (sections that open and close, the current page
 *    marked), and Tab goes link by link;
 *  - actions: a menu of commands, one Tab stop, the arrow keys move;
 *  - kind="tree": a tree to pick a row from, like layers (see Tree).
 * Up and Down move between items in all three.
 */
export default function Menu(props: MenuProps) {
  const kind = menuKind(props);
  if (kind === 'tree') {
    const { kind: _kind, sections: _s, current: _c, defaultOpen: _d, onToggle: _t, onNavigate: _n, ...tree } = props;
    return <Tree { ...(tree as TreeProps) } />;
  }
  const { label = kind === 'actions' ? 'Actions' : 'Pages', items: _i, activePath: _a, onClick: _o, itemRenderer: _r, maxIndentDepth: _m, ...rest } = props;
  return kind === 'actions' ? <MenuActions label={ label } { ...rest } /> : <MenuNav label={ label } { ...rest } />;
}

function MenuNav({
  kind: _kind,
  sections = [],
  current,
  defaultOpen = true,
  onToggle,
  onNavigate,
  label,
  id = 'menu',
  className,
  onKeyDown,
  ...restProps
}: MenuListProps) {
  // The current page's section starts open, whatever defaultOpen says.
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const home = sections.find((s) => s.items.some((item) => item.href !== undefined && item.href === current));
    return Object.fromEntries(sections.map((s) => [sectionId(s), s === home || startsOpen(defaultOpen, sectionId(s))]));
  });

  // Navigating into a closed section opens it, so the current page is always visible.
  React.useEffect(() => {
    const home = sections.find((s) => s.items.some((item) => item.href !== undefined && item.href === current));
    if (home && open[sectionId(home)] === false) setOpen((was) => ({ ...was, [sectionId(home)]: true }));
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (sid: string) => {
    const next = open[sid] === false;
    setOpen((was) => ({ ...was, [sid]: next }));
    if (onToggle) onToggle(sid, next);
  };
  const navigate = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => { if (onNavigate) onNavigate(href, event); };

  return (
    <nav className={ classNames(className, 'menu', CONSTANT.CLASS_PREFIX) }
      aria-label={ label }
      data-kind="nav"
      { ...restProps }
      onKeyDown={ (e) => { menuKeydown(e.nativeEvent, e.currentTarget); if (onKeyDown) onKeyDown(e); } }
    >
      { sections.map((section) => {
        const sid = sectionId(section);
        const shown = open[sid] !== false;
        const listId = `${id}-${sid}`;
        const toggleProps = {
          type: 'button' as const,
          'aria-expanded': shown,
          'aria-controls': listId,
          onClick: () => toggle(sid),
        };
        return (
          <div key={ sid } className="menu-section" data-section={ sid } data-open={ shown }>
            <div className="menu-heading">
              { section.href ? (
                <>
                  <a className="menu-title" href={ section.href } data-active={ current === section.href } onClick={ navigate(section.href) }>
                    { section.title }
                  </a>
                  <button className="menu-toggle" aria-label={ `${shown ? 'Hide' : 'Show'} ${String(section.title)}` } { ...toggleProps } />
                </>
              ) : (
                <button className="menu-title menu-toggle" { ...toggleProps }>{ section.title }</button>
              ) }
            </div>
            <div className="menu-items" id={ listId }>
              <ul>
                { section.items.map((item, i) => (
                  <li key={ item.href || i } data-divider={ item.divider || undefined }>
                    { item.href !== undefined ? (
                      <a
                        className="menu-item"
                        href={ item.href }
                        data-active={ current === item.href }
                        aria-current={ current === item.href ? 'page' : undefined }
                        onClick={ navigate(item.href) }
                      >
                        { item.label }
                      </a>
                    ) : (
                      <button type="button" className="menu-item" disabled={ item.disabled } onClick={ item.onSelect }>
                        { item.label }
                      </button>
                    ) }
                  </li>
                )) }
              </ul>
            </div>
          </div>
        );
      }) }
    </nav>
  );
}

function MenuActions({
  kind: _kind,
  sections = [],
  label,
  id = 'menu',
  className,
  onKeyDown,
  onFocus,
  current: _current,
  defaultOpen: _defaultOpen,
  onToggle: _onToggle,
  onNavigate: _onNavigate,
  ...restProps
}: MenuListProps) {
  let first = true;
  return (
    <div
      className={ classNames(className, 'menu', CONSTANT.CLASS_PREFIX) }
      role="menu"
      aria-label={ label }
      data-kind="actions"
      { ...restProps }
      onKeyDown={ (e) => { menuKeydown(e.nativeEvent, e.currentTarget); if (onKeyDown) onKeyDown(e); } }
      onFocus={ (e) => { menuFocus(e.nativeEvent, e.currentTarget); if (onFocus) onFocus(e); } }
    >
      { sections.map((section, s) => {
        const sid = sectionId({ id: section.id, title: section.title ?? `section-${s + 1}` });
        const titleId = `${id}-${sid}-title`;
        return (
          <div key={ sid } className="menu-section" data-section={ sid } role="group" aria-labelledby={ section.title ? titleId : undefined }>
            { section.title && (
              <div className="menu-heading"><span className="menu-title" id={ titleId }>{ section.title }</span></div>
            ) }
            <div className="menu-items">
              <ul role="none">
                { section.items.map((item, i) => {
                  const tabIndex = first ? 0 : -1;
                  first = false;
                  return (
                    <li key={ i } role="none" data-divider={ item.divider || undefined }>
                      <button
                        type="button"
                        role="menuitem"
                        className="menu-item"
                        tabIndex={ tabIndex }
                        aria-disabled={ item.disabled || undefined }
                        onClick={ (event) => { if (!item.disabled && item.onSelect) item.onSelect(event); } }
                      >
                        { item.label }
                      </button>
                    </li>
                  );
                }) }
              </ul>
            </div>
          </div>
        );
      }) }
    </div>
  );
}
