import classNames from 'classnames';
import CONSTANT from '../constants';
import { AnchorItem, anchorRail, anchorDash, anchorRange, anchorGo } from '../anchor';
import Icon from './Icon';
import { spawn, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Anchor/Anchor.scss';

export type { AnchorItem };

const SVG = 'http://www.w3.org/2000/svg';

export interface AnchorProps extends ElementProps {
  /** The sections, in page order: each an "#id" href, a label and a level (1, 2…). */
  items: AnchorItem[];
  /** The heading above the list. */
  title?: string;
  /** Prefix for the ids inside (the title is "<id>-title"). Defaults to "anchor". */
  id?: string;
  /** How far below the top a section's heading must be scrolled to count as "in view", in pixels. */
  offset?: number;
  /** The section in view, set by you (its href). Left out, the Anchor follows the scrolling itself. */
  current?: string;
  /** Scroll-spy inside this element instead of the page: an element or a CSS selector. */
  scrollRoot?: Element | string;
  /** Writes the section's #id in the address bar when one is picked. Turn off for hash routers. */
  updateHash?: boolean;
  /** Called when a row is picked, with its href. Call event.preventDefault() to handle it yourself. */
  onNavigate?: (href: string, event: MouseEvent) => void;
  /** A soft wash behind the row being read, fading to the right. */
  fade?: boolean;
}

/**
 * "On this page", the same markup as the React Anchor: the rail bends with the
 * nesting and its highlight slides to the section in view, in place (the
 * element stays the same while you scroll).
 */
export default function Anchor(props: AnchorProps): NurvusElement<HTMLElement, AnchorProps> {
  return updatable(({
    items, title = 'On this page', id = 'anchor', offset = 96, current, scrollRoot, updateHash = true, onNavigate, fade = false, className, ...rest
  }: AnchorProps) => {
    const controlled = current !== undefined;
    const rail = anchorRail(items.map((item) => item.level || 1));
    const fixed = controlled ? Math.max(0, items.findIndex((item) => item.href === current)) : 0;
    let range: [number, number] = [fixed, fixed];
    const links: HTMLElement[] = [];
    const dashOf = (r: [number, number]) => { const d = anchorDash(rail, r[0], r[1]); return { 'stroke-dasharray': d.dasharray, 'stroke-dashoffset': String(d.dashoffset) }; };
    const thumb = spawn<any>({ tag: 'path', namespace: SVG, className: 'anchor-thumb', d: rail.d, style: dashOf(range) });
    const caps = items.length ? [0, 1].map((k) => spawn<any>({ tag: 'circle', namespace: SVG, className: 'anchor-cap', cx: rail.caps[k][0], cy: rail.caps[k][1], r: '2.25', 'data-lit': k === 0 ? range[0] === 0 : range[1] === items.length - 1 })) : [];
    const mark = (r: [number, number]) => {
      range = r;
      const d = dashOf(r);
      thumb.style.setProperty('stroke-dasharray', d['stroke-dasharray']);
      thumb.style.setProperty('stroke-dashoffset', d['stroke-dashoffset']);
      if (caps.length) { caps[0].setAttribute('data-lit', String(r[0] === 0)); caps[1].setAttribute('data-lit', String(r[1] === items.length - 1)); }
      links.forEach((link, k) => {
        link.setAttribute('data-active', String(k === r[0]));
        link.setAttribute('data-inview', String(k >= r[0] && k <= r[1]));
        if (k === r[0]) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    };

    const el = spawn<HTMLElement>({
      tag: 'nav',
      className: classNames(className, 'anchor', CONSTANT.CLASS_PREFIX),
      'aria-labelledby': `${id}-title`,
      'data-fade': fade || undefined,
      ...rest,
      children: [
        spawn({ tag: 'p', className: 'anchor-title', children: [Icon({ name: 'align-left', size: '1.125em' }), spawn({ tag: 'span', id: `${id}-title`, children: title })] }),
        spawn({
          className: 'anchor-body',
          children: [
            spawn<any>({
              tag: 'svg',
              namespace: SVG,
              className: 'anchor-rail',
              viewBox: `0 0 ${rail.width} ${rail.height}`,
              style: { width: `${rail.width / 16}rem`, height: `${rail.height / 16}rem` },
              'aria-hidden': true,
              focusable: 'false',
              children: [spawn<any>({ tag: 'path', namespace: SVG, className: 'anchor-track', d: rail.d }), thumb, ...caps],
            }),
            spawn({
              tag: 'ul',
              className: 'anchor-list',
              children: items.map((item, i) => {
                const link = spawn({
                  tag: 'a',
                  className: 'anchor-link',
                  href: item.href,
                  title: item.label,
                  'data-active': i === range[0],
                  'data-inview': i >= range[0] && i <= range[1],
                  'aria-current': i === range[0] ? 'location' : undefined,
                  events: {
                    click: (event: MouseEvent) => {
                      if (onNavigate) onNavigate(item.href, event);
                      if (event.defaultPrevented) return;
                      if (anchorGo(item.href, updateHash)) { event.preventDefault(); if (!controlled) mark([i, i]); }
                    },
                  },
                  children: item.label,
                });
                links.push(link);
                return spawn({ tag: 'li', style: { '--anchor-level': String((item.level || 1) - 1) }, children: link });
              }),
            }),
          ],
        }),
      ],
    });

    // Follow the scrolling once it is on the page (and stop once it is gone).
    if (!controlled && typeof window !== 'undefined') {
      let frame = 0;
      let seen = false;
      const root = () => (typeof scrollRoot === 'string' ? document.querySelector(scrollRoot) : scrollRoot || null);
      const update = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (!el.isConnected) { if (seen) { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); } return; }
          seen = true;
          const next = anchorRange(items, offset, root());
          if (next[0] !== range[0] || next[1] !== range[1]) mark(next);
        });
      };
      window.addEventListener('scroll', update, { passive: true, capture: true });
      window.addEventListener('resize', update);
      update();
    }
    return el;
  }, props);
}
