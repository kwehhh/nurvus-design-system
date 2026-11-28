import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { loaderRings, LOGO_VIEWBOX } from '../../loader';
import './Loader.scss';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width and height of the mark. Defaults to 2em (twice the text size). A number is pixels. */
  size?: number | string;
  /** What is loading, for screen readers ("Loading photos"). Defaults to "Loading". */
  label?: string;
  /** Shows the label beside the mark, not only to screen readers. */
  showLabel?: boolean;
  /** Fills the segments with the logo's gradients (for big loaders); their ids start with this. Without it, one color each. */
  id?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * Shows that something is loading: the NURVUS mark with a light running round
 * it (the logo's Pulse). Screen readers hear the label once, politely
 * (role="status"). The light keeps running with reduced motion: it only
 * changes brightness, nothing moves, and a loader that stopped would look
 * stuck (WCAG 2.2.2 counts a loading animation as essential).
 */
export default function Loader({
  size = '2em',
  label = 'Loading',
  showLabel = false,
  id,
  className,
  ...restProps
}: LoaderProps) {
  const { inner, outer, gradients } = loaderRings(id);
  const ring = (cls: string, segments: typeof inner) => (
    <g className={ `loader-ring ${cls}` }>
      { segments.map((s, i) => (
        <path key={ i } className="loader-seg" d={ s.d } fill={ s.fill } style={ { '--nurvus-loader-at': String(s.angle) } as React.CSSProperties } />
      )) }
    </g>
  );
  return (
    <div
      className={ classNames(className, 'loader', CONSTANT.CLASS_PREFIX) }
      role="status"
      data-label={ showLabel ? 'shown' : 'hidden' }
      id={ id }
      { ...restProps }
    >
      <svg className="loader-mark" viewBox={ LOGO_VIEWBOX } width={ size } height={ size } aria-hidden="true" focusable="false">
        { gradients.length > 0 && (
          <defs>
            { gradients.map((g) => (
              <linearGradient key={ g.id } id={ g.id } gradientUnits="userSpaceOnUse" x1={ g.x1 } y1={ g.y1 } x2={ g.x2 } y2={ g.y2 }>
                <stop stopColor={ g.from } />
                <stop offset="1" stopColor={ g.to } />
              </linearGradient>
            )) }
          </defs>
        ) }
        { ring('loader-inner', inner) }
        { ring('loader-outer', outer) }
      </svg>
      <span className="loader-label">{ label }</span>
    </div>
  );
}
