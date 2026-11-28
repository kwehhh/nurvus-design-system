import React from 'react';
import { GRADIENTS, INNER, OUTER } from './logoData';

// Logo variants for review (round 8): the same artwork, changed for small
// sizes and for light or dark backgrounds. Foundations > Brand > Review.

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const toHex = (rgb) => `#${rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')}`;
const lum = (h) => { const v = hex(h).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/** RGB <-> HSL, so a color can get darker or lighter and keep its hue. */
function toHsl([r, g, b]) {
  const max = Math.max(r, g, b); const min = Math.min(r, g, b); const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min; const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function fromHsl([h, s, l]) {
  if (!s) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q;
  const f = (t) => { let x = t; if (x < 0) x += 1; if (x > 1) x -= 1; if (x < 1 / 6) return p + (q - p) * 6 * x; if (x < 1 / 2) return q; if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6; return p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}

/** The color, darker (on white) or lighter (on navy) until it is at least `min`:1 against `bg`. */
export function reach(color, bg, min = 3) {
  let [h, s, l] = toHsl(hex(color));
  const down = lum(bg) > 0.5;
  for (let i = 0; i < 60 && contrast(toHex(fromHsl([h, s, l])), bg) < min; i += 1) {
    l += down ? -0.015 : 0.015;
    if (down) s = Math.min(1, s + 0.01);
  }
  return toHex(fromHsl([h, s, l]));
}

/** A near-white end takes the hue of its gradient's other end before it is darkened (or it turns orange). */
const borrow = (color, partner) => { const [, s, l] = toHsl(hex(color)); if (l < 0.85 && s > 0.25) return color; const [h2, s2] = toHsl(hex(partner)); return toHex(fromHsl([h2, s2, l])); };

const SPECKS = ['n', 'q', 'r']; // the three smallest segments: about 2 x 3 pixels at 28px

/**
 * The mark with changes:
 *  - tone: 'original', 'light' (every gradient end at least 3:1 on white),
 *    'dark' (at least 3:1 on the dark navy), or 'mono' (one gradient over the
 *    whole mark);
 *  - simple: leave out the three specks;
 *  - weight: a stroke of each segment's own color, in artwork units (540 across);
 *  - tile: on a dark navy rounded square, like an app icon.
 */
export default function LogoVariant({ id, size = 28, tone = 'original', simple = false, weight = 0, tile = false, title }) {
  const g = (k) => `url(#${id}-${tone === 'mono' ? 'mono' : k})`;
  const keep = ([k]) => !(simple && SPECKS.includes(k));
  const stops = (from, to) => {
    if (tone === 'light') return [reach(borrow(from, to), '#ffffff'), reach(borrow(to, from), '#ffffff')];
    if (tone === 'dark') return [reach(from, '#0b1326'), reach(to, '#0b1326')];
    return [from, to];
  };
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };
  const mark = (
    <>
      <defs>
        { GRADIENTS.map(([k, x1, y1, x2, y2, from, to]) => {
          const [f, t] = stops(from, to);
          return (
            <linearGradient key={ k } id={ `${id}-${k}` } gradientUnits="userSpaceOnUse" x1={ x1 } y1={ y1 } x2={ x2 } y2={ y2 }>
              <stop stopColor={ f } />
              <stop offset="1" stopColor={ t } />
            </linearGradient>
          );
        }) }
        <linearGradient id={ `${id}-mono` } gradientUnits="userSpaceOnUse" x1="520" y1="180" x2="1000" y2="660">
          <stop stopColor="#2c9fd0" />
          <stop offset="0.5" stopColor="#4664ee" />
          <stop offset="1" stopColor="#8a3fe0" />
        </linearGradient>
      </defs>
      { [...INNER, ...OUTER].filter(keep).map(([k, d]) => (
        <path key={ k } d={ d } fill={ g(k) } stroke={ weight ? g(k) : undefined } strokeWidth={ weight || undefined } strokeLinejoin="round" />
      )) }
    </>
  );
  if (!tile) {
    return <svg viewBox="492 149 540 540" width={ size } height={ size } { ...a11y }>{ mark }</svg>;
  }
  return (
    <svg viewBox="452 109 620 620" width={ size } height={ size } { ...a11y }>
      <rect x="452" y="109" width="620" height="620" rx="140" fill="#0b1326" />
      { mark }
    </svg>
  );
}
