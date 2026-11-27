import classNames from 'classnames';
import CONSTANT from '../constants';
import { sectionId, startsOpen } from '../navList';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/NavList/NavList.scss';

export interface NavListItem {
  /** What the link says. */
  label: Child;
  /** Where it goes. The item whose href equals `current` is marked as the current page. */
  href: string;
  /** Draws a hairline above this item, to split a section into groups. */
  divider?: boolean;
}

export interface NavListSection {
  /** Stable id: names the section's open state and links its toggle to its list. Defaults to the title. */
  id?: string;
  /** The section heading. */
  title: string;
  /** Makes the heading a link too (e.g. to the section's overview page). */
  href?: string;
  /** The section's links. */
  items: NavListItem[];
}

export interface NavListProps extends ElementProps {
  /** The sections, in order. */
  sections: NavListSection[];
  /** The href of the page being shown: its link is marked, and its section opens. */
  current?: string;
  /** Which sections start open: true (all), false (none) or a map of section id -> open. Defaults to all. */
  defaultOpen?: boolean | Record<string, boolean>;
  /** Called when a section opens or closes (e.g. to remember it). */
  onToggle?: (id: string, open: boolean) => void;
  /** Called when any link is clicked, with its href (e.g. to close a drawer). */
  onNavigate?: (href: string, event: MouseEvent) => void;
  /** Accessible name of the navigation landmark. */
  label?: string;
  /** Prefix for the ids that link each toggle to its list. Defaults to "nav-list". */
  id?: string;
}

/**
 * Site navigation: sections of links that open and close (an accordion, with
 * a smooth animation), and the current page marked by a bar beside it. A
 * click on a toggle opens or closes its section in place (the element stays
 * the same); update({ current }) marks another page and opens its section.
 */
export default function NavList(props: NavListProps): NurvusElement<HTMLElement, NavListProps> {
  return updatable(({
    sections, current, defaultOpen = true, onToggle, onNavigate, label = 'Pages', id = 'nav-list', className, ...rest
  }: NavListProps, keep) => {
    const open: Record<string, boolean> = Object.fromEntries(sections.map((s) => [sectionId(s), startsOpen(defaultOpen, sectionId(s))]));
    // The current page's section always starts open, as in React.
    const home = sections.find((s) => s.items.some((item) => item.href === current));
    if (home) open[sectionId(home)] = true;

    const navigate = (href: string) => ({ click: (event: MouseEvent) => { if (onNavigate) onNavigate(href, event); } });

    const renderSection = (section: NavListSection): HTMLElement => {
      const sid = sectionId(section);
      const listId = `${id}-${sid}`;
      const toggles: HTMLElement[] = [];
      const toggle = () => {
        open[sid] = !open[sid];
        keep({ defaultOpen: { ...open } });
        el.setAttribute('data-open', String(open[sid]));
        toggles.forEach((t) => {
          t.setAttribute('aria-expanded', String(open[sid]));
          if (t.hasAttribute('aria-label')) t.setAttribute('aria-label', `${open[sid] ? 'Hide' : 'Show'} ${section.title}`);
        });
        if (onToggle) onToggle(sid, open[sid]);
      };
      const toggleProps = (extra: Record<string, unknown>) => ({
        tag: 'button', type: 'button', 'aria-expanded': open[sid], 'aria-controls': listId, events: { click: toggle }, ...extra,
      });
      const heading = section.href
        ? [
          spawn({ tag: 'a', className: 'nav-list-title', href: section.href, 'data-active': current === section.href, events: navigate(section.href), children: section.title }),
          spawn(toggleProps({ className: 'nav-list-toggle', 'aria-label': `${open[sid] ? 'Hide' : 'Show'} ${section.title}` })),
        ]
        : [spawn(toggleProps({ className: 'nav-list-title nav-list-toggle', children: section.title }))];
      heading.forEach((h) => { if (h.tagName === 'BUTTON') toggles.push(h); });

      const el: HTMLElement = spawn({
        className: 'nav-list-section',
        'data-section': sid,
        'data-open': open[sid],
        children: [
          spawn({ className: 'nav-list-heading', children: heading }),
          spawn({
            className: 'nav-list-items',
            id: listId,
            children: spawn({
              tag: 'ul',
              children: section.items.map((item) => spawn({
                tag: 'li',
                'data-divider': item.divider || undefined,
                children: spawn({
                  tag: 'a',
                  className: 'nav-list-item',
                  href: item.href,
                  'data-active': current === item.href,
                  'aria-current': current === item.href ? 'page' : undefined,
                  events: navigate(item.href),
                  children: item.label,
                }),
              })),
            }),
          }),
        ],
      });
      return el;
    };

    return spawn<HTMLElement>({
      tag: 'nav',
      className: classNames(className, 'nav-list', CONSTANT.CLASS_PREFIX),
      'aria-label': label,
      ...rest,
      children: sections.map(renderSection),
    });
  }, props);
}
