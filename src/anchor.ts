// Anchor rules shared by the React and the Respawn Anchor (no React here):
// the rail's drawing and which section is in view.
//
// The rail is drawn from the items alone (no measuring), so it is the same on
// the server, in React and in Respawn: every row is 1.75rem (28 units at the
// default 16px), each level indents 0.75rem (12 units), and between rows at
// different levels the line bends with a short S-curve. The highlight is the
// same path with a dash over the active row's stretch; moving the dash slides
// it along the curves.

export interface AnchorItem {
  /** "#id" of the section (or any link). */
  href: string;
  /** What the row says. */
  label: string;
  /** 1 for a top-level section, 2 for one inside it, and so on. Defaults to 1. */
  level?: number;
}

export const ANCHOR_ROW = 28;
export const ANCHOR_INDENT = 12;
const X0 = 1.5; // the line's x at level 1 (inside a 3-unit gutter)
const BEND = 7; // half the height of an S-curve
const END = 5; // the line stops this far inside the first and last rows

const xAt = (level: number) => X0 + (Math.max(1, level) - 1) * ANCHOR_INDENT;

/** Length of a cubic Bézier, by sampling (deterministic). */
function cubicLength(p0: number[], p1: number[], p2: number[], p3: number[]): number {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= 24; i += 1) {
    const t = i / 24; const u = 1 - t;
    const pt = [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
    len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }
  return len;
}

const round = (n: number) => Math.round(n * 100) / 100;

export interface AnchorRail {
  /** The path, in units (1 unit = 1px at the default text size). */
  d: string;
  width: number;
  height: number;
  /** The whole path's length. */
  length: number;
  /** Each row's stretch along the path: [start, end]. */
  spans: [number, number][];
}

/** The rail for rows at these levels. */
export function anchorRail(levels: number[]): AnchorRail {
  const n = levels.length;
  if (!n) return { d: '', width: 0, height: 0, length: 0, spans: [] };
  const x = levels.map(xAt);
  const parts: string[] = [];
  const spans: [number, number][] = [];
  let length = 0;
  let y = END;
  parts.push(`M${round(x[0])} ${y}`);
  for (let i = 0; i < n; i += 1) {
    const bottom = (i + 1) * ANCHOR_ROW;
    const bendsBelow = i < n - 1 && x[i + 1] !== x[i];
    const straightEnd = i === n - 1 ? bottom - END : bendsBelow ? bottom - BEND : bottom;
    const start = length;
    length += straightEnd - y;
    parts.push(`L${round(x[i])} ${straightEnd}`);
    spans.push([round(start), round(length)]);
    y = straightEnd;
    if (bendsBelow) {
      const p0 = [x[i], bottom - BEND]; const p1 = [x[i], bottom]; const p2 = [x[i + 1], bottom]; const p3 = [x[i + 1], bottom + BEND];
      parts.push(`C${round(x[i])} ${bottom} ${round(x[i + 1])} ${bottom} ${round(x[i + 1])} ${bottom + BEND}`);
      length += cubicLength(p0, p1, p2, p3);
      y = bottom + BEND;
    }
  }
  const width = Math.max(...x) + X0;
  return { d: parts.join(''), width: round(width), height: n * ANCHOR_ROW, length: round(length), spans };
}

/** The dash that lights row `i`'s stretch: stroke-dasharray and stroke-dashoffset. */
export function anchorDash(rail: AnchorRail, i: number): { dasharray: string; dashoffset: number } {
  const span = rail.spans[i];
  if (!span) return { dasharray: `0 ${rail.length + 1}`, dashoffset: 0 };
  return { dasharray: `${round(span[1] - span[0])} ${round(rail.length + 1)}`, dashoffset: -span[0] };
}

/** The id an "#id" href points at, or null for other links. */
export const anchorTarget = (href: string): string | null => (href.startsWith('#') && href.length > 1 ? decodeURIComponent(href.slice(1)) : null);

/**
 * Which row is in view: the last section whose top has passed `offset` pixels
 * below the top of the scroll area (the first one before any has), and the
 * last one once the area is scrolled to its end.
 */
export function anchorActive(items: AnchorItem[], offset: number, scrollRoot?: Element | null): number {
  const ids = items.map((item) => anchorTarget(item.href));
  const top = scrollRoot ? scrollRoot.getBoundingClientRect().top : 0;
  const atEnd = scrollRoot
    ? scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 2
    : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let active = 0;
  ids.forEach((id, i) => {
    const el = id ? document.getElementById(id) : null;
    if (el && el.getBoundingClientRect().top - top <= offset) active = i;
  });
  if (atEnd) {
    for (let i = ids.length - 1; i >= 0; i -= 1) if (ids[i] && document.getElementById(ids[i] as string)) return i;
  }
  return active;
}

/** Scrolls a section into view (smoothly unless people asked for less motion) and moves focus to it. */
export function anchorGo(href: string, updateHash: boolean): boolean {
  const id = anchorTarget(href);
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;
  const still = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (updateHash && typeof history !== 'undefined') history.replaceState(null, '', href);
  return true;
}
