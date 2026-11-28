import React from 'react';
import { GRADIENTS, INNER, OUTER, WORDMARK } from './logoData';

// The ring's center in the artwork's coordinates. Each current carries an
// invisible circle around it, so it turns (and sinks) about the ring's center.
const CX = 761;
const CY = 419;

/**
 * Where each segment sits around the ring: the unit vector from the center to
 * its middle (--ux, --uy) and its angle as a fraction of a turn (--a). The
 * motions use them: ripple pushes each segment outward along its own line,
 * pulse and assemble start each one a little later as they go round.
 */
function place([k, d]) {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let x = 0; let y = 0; let count = 0;
  for (let i = 0; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; count += 1; }
  const dx = x / count - CX; const dy = y / count - CY; const len = Math.hypot(dx, dy) || 1;
  const a = ((Math.atan2(dy, dx) / (2 * Math.PI)) + 1.25) % 1; // 0 at the top, going clockwise
  return { k, d, style: { '--ux': (dx / len).toFixed(3), '--uy': (dy / len).toFixed(3), '--a': a.toFixed(3) } };
}
const INNER_PLACED = INNER.map(place);
const OUTER_PLACED = OUTER.map(place);

// The alt logo for small sizes (round 10, "One gradient" on Review): one
// blue-to-violet gradient over the whole mark, the three specks left out, every
// piece a touch bolder. Clean at 16 to 32 pixels: the header and the favicon size.
const SPECKS = ['n', 'q', 'r'];
export const MONO_STOPS = [['#2c9fd0', 0], ['#4664ee', 0.5], ['#8a3fe0', 1]];
const MONO_WEIGHT = 16; // artwork units (540 across): about 0.8px each side at 28px

/** The motions the mark can have (Foundations > Brand shows each). */
export const LOGO_MOTIONS = [
  { id: 'current', name: 'Current', about: 'The two rings turn slowly in opposite directions. The home page uses it.' },
  { id: 'whirlpool', name: 'Whirlpool', about: 'Both rings turn the same way, the inner one twice as fast, and it sinks and rises like water draining.' },
  { id: 'ripple', name: 'Ripple', about: 'A wave travels around the ring; each piece drifts outward and back in turn, so the ring breathes.' },
  { id: 'pulse', name: 'Pulse', about: 'A light runs around the ring, lighting each piece in turn. The Loader uses it.' },
  { id: 'spectrum', name: 'Spectrum', about: 'The colors drift through the whole rainbow while the rings turn.' },
  { id: 'assemble', name: 'Assemble', about: 'The pieces fly in from outside and settle into the ring, once. Good for a first visit: the header does it when the site opens.' },
];

/**
 * The NURVUS logo: the mark (two "currents" of segments) and, with
 * `wordmark`, the name under it in the text color (so it reads on light and
 * dark themes). `motion` animates it (see LOGO_MOTIONS; `spin` = "current");
 * `tone="mono"` draws the alt logo for small sizes (one gradient, no specks);
 * every motion stops for reduced motion and under Pause motion. `id` keeps the
 * gradient ids unique when the logo is on a page twice. Without `title` it is
 * decorative (hidden from screen readers).
 */
export default function Logo({ id = 'nv-logo', wordmark = false, spin = false, motion, tone = 'full', title, className = '' }) {
  const mono = tone === 'mono';
  const ref = (k) => (mono ? `url(#${id}-mono)` : `url(#${id}-g-${k})`);
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' };
  const current = motion || (spin ? 'current' : undefined);
  const ring = (cls, segments) => (
    <g className={ `nv-logo-current ${cls}` }>
      <g className="nv-logo-depth">
        <circle cx={ CX } cy={ CY } r="280" fill="none" />
        { segments.filter((s) => !(mono && SPECKS.includes(s.k))).map((s) => (
          <path key={ s.k } className="nv-logo-seg" fill={ ref(s.k) } d={ s.d } style={ s.style } stroke={ mono ? ref(s.k) : undefined } strokeWidth={ mono ? MONO_WEIGHT : undefined } strokeLinejoin="round" />
        )) }
      </g>
    </g>
  );
  return (
    <svg
      className={ `nv-logo ${className}` }
      viewBox={ wordmark ? '420 120 700 750' : '492 149 540 540' }
      data-spin={ current ? 'true' : undefined }
      data-motion={ current }
      data-tone={ tone }
      { ...a11y }
    >
      <defs>
        { mono && (
          <linearGradient id={ `${id}-mono` } gradientUnits="userSpaceOnUse" x1="520" y1="180" x2="1000" y2="660">
            { MONO_STOPS.map(([color, at]) => <stop key={ at } offset={ at } stopColor={ color } />) }
          </linearGradient>
        ) }
        { GRADIENTS.map(([k, x1, y1, x2, y2, from, to]) => (
          <linearGradient key={ k } id={ `${id}-g-${k}` } gradientUnits="userSpaceOnUse" x1={ x1 } y1={ y1 } x2={ x2 } y2={ y2 }>
            <stop stopColor={ from } />
            <stop offset="1" stopColor={ to } />
          </linearGradient>
        )) }
      </defs>
      { ring('nv-logo-inner', INNER_PLACED) }
      { ring('nv-logo-outer', OUTER_PLACED) }
      { wordmark && (
        <g fill="currentColor" fillRule="evenodd">
          { WORDMARK.map((d) => <path key={ d.slice(0, 12) } d={ d } />) }
        </g>
      ) }
    </svg>
  );
}

// "NURVUS UI" in the logo's own letters: the wordmark's six, a word space, its
// U again and an I drawn to match (the N's 15-unit stem, the caps' 80 height).
const UI_SHIFT = 572; // the U (x 578) moved to x 1150: a 70-unit word space after the S
const WORDMARK_UI = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="461 744 817 86"><g fill="#000" fill-rule="evenodd">${
  WORDMARK.map((d) => `<path d="${d}"/>`).join('')
}<path transform="translate(${UI_SHIFT} 0)" d="${WORDMARK[1]}"/><rect x="1261" y="747" width="15" height="80"/></g></svg>`;
const MASK = `url("data:image/svg+xml,${encodeURIComponent(WORDMARK_UI)}")`;

/**
 * "NURVUS UI" set in the logo's own letterforms (wide, geometric, spaced),
 * filled with the theme's flowing rainbow and a soft glow of the same colors.
 * The letters are a mask over the gradient, so the color moves with CSS and
 * stops with Pause motion. Screen readers and copy-paste get the text.
 */
export function Wordmark({ text = 'NURVUS UI', className = '' }) {
  return (
    <span className={ `nv-wordmark ${className}` } style={ { '--nv-wordmark-mask': MASK } }>
      <span className="nv-wordmark-text">{ text }</span>
      <span className="nv-wordmark-glow" aria-hidden="true"><span className="nv-wordmark-fill" /></span>
      <span className="nv-wordmark-fill" aria-hidden="true" />
      <span className="nv-wordmark-sheen" aria-hidden="true" />
    </span>
  );
}
