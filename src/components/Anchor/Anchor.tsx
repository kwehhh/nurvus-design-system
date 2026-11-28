import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import Icon from '../Icon/Icon';
import { AnchorItem, anchorRail, anchorDash, anchorRange, anchorGo } from '../../anchor';
import './Anchor.scss';

export type { AnchorItem };

export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** The sections, in page order: each an "#id" href, a label and a level (1, 2…). */
  items: AnchorItem[];
  /** The heading above the list. */
  title?: string;
  /** Prefix for the ids inside (the title is "<id>-title"). Defaults to "anchor". */
  id?: string;
  /** How far below the top a section's heading must be scrolled to count as "in view", in pixels (room for a sticky header). */
  offset?: number;
  /** The section in view, set by you (its href). Left out, the Anchor follows the scrolling itself. */
  current?: string;
  /** Scroll-spy inside this element instead of the page: an element or a CSS selector. */
  scrollRoot?: Element | string;
  /** Writes the section's #id in the address bar when one is picked. Turn off for hash routers. */
  updateHash?: boolean;
  /** Called when a row is picked, with its href. Call event.preventDefault() to handle it yourself. */
  onNavigate?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** A soft wash behind the row being read, fading to the right. */
  fade?: boolean;
  /** Custom class name. */
  className?: string;
}

const rootOf = (scrollRoot?: Element | string): Element | null => (typeof scrollRoot === 'string' ? document.querySelector(scrollRoot) : scrollRoot || null);

/**
 * "On this page": the sections of a long page, the ones in view marked as you
 * scroll. A rail runs down beside the rows from a dot to a dot, bending in and
 * out with the nesting, and a highlight slides along it over the sections in
 * view (their names brighten; the first is the one being read). Picking a row
 * scrolls to the section and moves focus there.
 */
export default function Anchor({
  items,
  title = 'On this page',
  id = 'anchor',
  offset = 96,
  current,
  scrollRoot,
  updateHash = true,
  onNavigate,
  fade = false,
  className,
  ...restProps
}: AnchorProps) {
  const [spied, setSpied] = React.useState<[number, number]>([0, 0]);
  const controlled = current !== undefined;
  const fixed = Math.max(0, items.findIndex((item) => item.href === current));
  const [from, to] = controlled ? [fixed, fixed] : spied;
  const rail = anchorRail(items.map((item) => item.level || 1));
  const dash = anchorDash(rail, from, to);

  // Follow the scrolling (unless the section in view is set from outside).
  const list = React.useRef(items);
  list.current = items;
  const hrefs = items.map((item) => item.href).join(' ');
  React.useEffect(() => {
    if (controlled || typeof window === 'undefined') return undefined;
    const root = rootOf(scrollRoot);
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setSpied((was) => { const next = anchorRange(list.current, offset, root); return was[0] === next[0] && was[1] === next[1] ? was : next; })); };
    update();
    const target: EventTarget = root || window;
    target.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); target.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [controlled, hrefs, offset, scrollRoot]);

  const go = (href: string, i: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) onNavigate(href, event);
    if (event.defaultPrevented) return;
    if (anchorGo(href, updateHash)) { event.preventDefault(); if (!controlled) setSpied([i, i]); }
  };

  return (
    <nav className={ classNames(className, 'anchor', CONSTANT.CLASS_PREFIX) } aria-labelledby={ `${id}-title` } data-fade={ fade || undefined } { ...restProps }>
      <p className="anchor-title"><Icon name="align-left" size="1.125em" /><span id={ `${id}-title` }>{ title }</span></p>
      <div className="anchor-body">
        <svg className="anchor-rail" viewBox={ `0 0 ${rail.width} ${rail.height}` } style={ { width: `${rail.width / 16}rem`, height: `${rail.height / 16}rem` } } aria-hidden="true" focusable="false">
          <path className="anchor-track" d={ rail.d } />
          <path className="anchor-thumb" d={ rail.d } style={ { strokeDasharray: dash.dasharray, strokeDashoffset: dash.dashoffset } } />
          { items.length > 0 && <circle className="anchor-cap" cx={ rail.caps[0][0] } cy={ rail.caps[0][1] } r="2.25" data-lit={ from === 0 } /> }
          { items.length > 0 && <circle className="anchor-cap" cx={ rail.caps[1][0] } cy={ rail.caps[1][1] } r="2.25" data-lit={ to === items.length - 1 } /> }
        </svg>
        <ul className="anchor-list">
          { items.map((item, i) => (
            <li key={ item.href } style={ { '--anchor-level': String((item.level || 1) - 1) } as React.CSSProperties }>
              <a
                className="anchor-link"
                href={ item.href }
                title={ item.label }
                data-active={ i === from }
                data-inview={ i >= from && i <= to }
                aria-current={ i === from ? 'location' : undefined }
                onClick={ go(item.href, i) }
              >
                { item.label }
              </a>
            </li>
          )) }
        </ul>
      </div>
    </nav>
  );
}
