import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { sectionId, startsOpen } from '../../navList';
import './NavList.scss';

export interface NavListItem {
  /** What the link says. */
  label: React.ReactNode;
  /** Where it goes. The item whose href equals `current` is marked as the current page. */
  href: string;
  /** Draws a hairline above this item, to split a section into groups. */
  divider?: boolean;
}

export interface NavListSection {
  /** Stable id: names the section's open state and links its toggle to its list. Defaults to the title. */
  id?: string;
  /** The section heading. */
  title: React.ReactNode;
  /** Makes the heading a link too (e.g. to the section's overview page). */
  href?: string;
  /** The section's links. */
  items: NavListItem[];
}

export interface NavListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onToggle'> {
  /** The sections, in order. */
  sections: NavListSection[];
  /** The href of the page being shown: its link is marked, and its section opens. */
  current?: string;
  /** Which sections start open: true (all), false (none) or a map of section id → open. Defaults to all. */
  defaultOpen?: boolean | Record<string, boolean>;
  /** Called when a section opens or closes (e.g. to remember it). */
  onToggle?: (id: string, open: boolean) => void;
  /** Called when any link is clicked, with its href (e.g. to close a drawer). */
  onNavigate?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** Prefix for the ids that link each toggle to its list. Defaults to "nav-list". */
  id?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * Site navigation: sections of links that open and close (an accordion, with
 * a smooth animation), and the current page marked by a bar beside it.
 * A section opens by itself when the current page is in it.
 */
export default function NavList({
  sections,
  current,
  defaultOpen = true,
  onToggle,
  onNavigate,
  label = 'Pages',
  id = 'nav-list',
  className,
  ...restProps
}: NavListProps) {
  // The current page's section starts open, whatever defaultOpen says.
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    const home = sections.find((s) => s.items.some((item) => item.href === current));
    return Object.fromEntries(sections.map((s) => [sectionId(s), s === home || startsOpen(defaultOpen, sectionId(s))]));
  });

  // Navigating into a closed section opens it, so the current page is always visible.
  React.useEffect(() => {
    const home = sections.find((s) => s.items.some((item) => item.href === current));
    if (home && open[sectionId(home)] === false) setOpen((was) => ({ ...was, [sectionId(home)]: true }));
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (sid: string) => {
    const next = open[sid] === false;
    setOpen((was) => ({ ...was, [sid]: next }));
    if (onToggle) onToggle(sid, next);
  };
  const navigate = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => { if (onNavigate) onNavigate(href, event); };

  return (
    <nav className={ classNames(className, 'nav-list', CONSTANT.CLASS_PREFIX) } aria-label={ label } { ...restProps }>
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
          <div key={ sid } className="nav-list-section" data-section={ sid } data-open={ shown }>
            <div className="nav-list-heading">
              { section.href ? (
                <>
                  <a className="nav-list-title" href={ section.href } data-active={ current === section.href } onClick={ navigate(section.href) }>
                    { section.title }
                  </a>
                  <button className="nav-list-toggle" aria-label={ `${shown ? 'Hide' : 'Show'} ${String(section.title)}` } { ...toggleProps } />
                </>
              ) : (
                <button className="nav-list-title nav-list-toggle" { ...toggleProps }>{ section.title }</button>
              ) }
            </div>
            <div className="nav-list-items" id={ listId }>
              <ul>
                { section.items.map((item) => (
                  <li key={ item.href } data-divider={ item.divider || undefined }>
                    <a
                      className="nav-list-item"
                      href={ item.href }
                      data-active={ current === item.href }
                      aria-current={ current === item.href ? 'page' : undefined }
                      onClick={ navigate(item.href) }
                    >
                      { item.label }
                    </a>
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
