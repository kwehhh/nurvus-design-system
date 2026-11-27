import React from 'react';
import { GRADIENTS, INNER, OUTER, WORDMARK } from './logoData';

// The ring's center in the artwork's coordinates. Each current carries an
// invisible circle around it, so it turns about the ring's center.
const CX = 761;
const CY = 419;

/**
 * The NURVUS logo: the mark (two "currents" of segments) and, with
 * `wordmark`, the name under it in the text color (so it reads on light and
 * dark themes). `spin`: the currents turn slowly, opposite ways (still for
 * reduced motion). `id` keeps the gradient ids unique when the logo is on a
 * page twice. Without `title` it is decorative (hidden from screen readers).
 */
export default function Logo({ id = 'nv-logo', wordmark = false, spin = false, title, className = '' }) {
  const ref = (k) => `url(#${id}-g-${k})`;
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' };
  return (
    <svg
      className={ `nv-logo ${className}` }
      viewBox={ wordmark ? '420 120 700 750' : '492 149 540 540' }
      data-spin={ spin || undefined }
      { ...a11y }
    >
      <defs>
        { GRADIENTS.map(([k, x1, y1, x2, y2, from, to]) => (
          <linearGradient key={ k } id={ `${id}-g-${k}` } gradientUnits="userSpaceOnUse" x1={ x1 } y1={ y1 } x2={ x2 } y2={ y2 }>
            <stop stopColor={ from } />
            <stop offset="1" stopColor={ to } />
          </linearGradient>
        )) }
      </defs>
      <g className="nv-logo-current nv-logo-inner">
        <circle cx={ CX } cy={ CY } r="280" fill="none" />
        { INNER.map(([k, d]) => <path key={ k } fill={ ref(k) } d={ d } />) }
      </g>
      <g className="nv-logo-current nv-logo-outer">
        <circle cx={ CX } cy={ CY } r="280" fill="none" />
        { OUTER.map(([k, d]) => <path key={ k } fill={ ref(k) } d={ d } />) }
      </g>
      { wordmark && (
        <g fill="currentColor" fillRule="evenodd">
          { WORDMARK.map((d) => <path key={ d.slice(0, 12) } d={ d } />) }
        </g>
      ) }
    </svg>
  );
}
