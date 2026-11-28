import classNames from 'classnames';
import CONSTANT from '../constants';
import { loaderRings, LOGO_VIEWBOX, LoaderSegment } from '../loader';
import { spawn, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Loader/Loader.scss';

const SVG = 'http://www.w3.org/2000/svg';

export interface LoaderProps extends ElementProps {
  /** Width and height of the mark. Defaults to 2em (twice the text size). A number is pixels. */
  size?: number | string;
  /** What is loading, for screen readers ("Loading photos"). Defaults to "Loading". */
  label?: string;
  /** Shows the label beside the mark, not only to screen readers. */
  showLabel?: boolean;
  /** Fills the segments with the logo's gradients (for big loaders); their ids start with this. Without it, one color each. */
  id?: string;
}

/**
 * Shows that something is loading: the NURVUS mark with a light running round
 * it, the same markup as the React Loader. Screen readers hear the label once
 * (role="status"). Remove it when the thing has loaded.
 */
export default function Loader(props: LoaderProps = {}): NurvusElement<HTMLDivElement, LoaderProps> {
  return updatable(({ size = '2em', label = 'Loading', showLabel = false, id, className, ...rest }: LoaderProps) => {
    const { inner, outer, gradients } = loaderRings(id);
    const ring = (cls: string, segments: LoaderSegment[]) => spawn<any>({
      tag: 'g',
      namespace: SVG,
      className: `loader-ring ${cls}`,
      children: segments.map((s) => spawn<any>({
        tag: 'path', namespace: SVG, className: 'loader-seg', d: s.d, fill: s.fill, style: { '--nurvus-loader-at': String(s.angle) },
      })),
    });
    return spawn<HTMLDivElement>({
      className: classNames(className, 'loader', CONSTANT.CLASS_PREFIX),
      role: 'status',
      'data-label': showLabel ? 'shown' : 'hidden',
      id,
      ...rest,
      children: [
        spawn<any>({
          tag: 'svg',
          namespace: SVG,
          className: 'loader-mark',
          viewBox: LOGO_VIEWBOX,
          width: size,
          height: size,
          'aria-hidden': true,
          focusable: 'false',
          children: [
            gradients.length ? spawn<any>({
              tag: 'defs',
              namespace: SVG,
              children: gradients.map((g) => spawn<any>({
                tag: 'linearGradient',
                namespace: SVG,
                id: g.id,
                gradientUnits: 'userSpaceOnUse',
                x1: g.x1, y1: g.y1, x2: g.x2, y2: g.y2,
                children: [
                  spawn<any>({ tag: 'stop', namespace: SVG, 'stop-color': g.from }),
                  spawn<any>({ tag: 'stop', namespace: SVG, offset: '1', 'stop-color': g.to }),
                ],
              })),
            }) : null,
            ring('loader-inner', inner),
            ring('loader-outer', outer),
          ],
        }),
        spawn({ tag: 'span', className: 'loader-label', children: label }),
      ],
    });
  }, props);
}
