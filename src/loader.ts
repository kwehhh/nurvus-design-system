// Loader's drawing, shared by the React and the Respawn Loader (no React here).
import { LOGO_INNER, LOGO_OUTER, LogoSegment } from './logo';

export { LOGO_VIEWBOX } from './logo';

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** The middle of a segment's gradient: its one color when there are no gradients. */
const middle = (from: string, to: string) => `#${hex(from).map((v, i) => Math.round((v + hex(to)[i]) / 2).toString(16).padStart(2, '0')).join('')}`;

export interface LoaderSegment {
  d: string;
  /** "url(#<id>-<n>)" with gradients, else one color. */
  fill: string;
  /** Where it sits round the ring, 0 to 1 from the top, clockwise: the pulse reaches it then. */
  angle: number;
}

export interface LoaderGradient {
  id: string;
  x1: number; y1: number; x2: number; y2: number;
  from: string; to: string;
}

/**
 * The two rings' segments. With an `id`, each segment is filled with its own
 * gradient (ids "<id>-0", "<id>-1"…), as in the logo; without one, with its
 * gradient's middle color, so a page can show any number of loaders with no
 * ids at all. They look the same up to about 64 pixels.
 */
export function loaderRings(id?: string): { inner: LoaderSegment[]; outer: LoaderSegment[]; gradients: LoaderGradient[] } {
  const gradients: LoaderGradient[] = [];
  let n = 0;
  const seg = ([d, from, to, [x1, y1, x2, y2], angle]: LogoSegment): LoaderSegment => {
    if (!id) return { d, fill: middle(from, to), angle };
    const gid = `${id}-${n}`;
    n += 1;
    gradients.push({ id: gid, x1, y1, x2, y2, from, to });
    return { d, fill: `url(#${gid})`, angle };
  };
  const inner = LOGO_INNER.map(seg);
  const outer = LOGO_OUTER.map(seg);
  return { inner, outer, gradients };
}
