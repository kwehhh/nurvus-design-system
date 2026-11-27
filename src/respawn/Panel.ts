import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Panel/Panel.scss';

export type PanelPadding = 'none' | 'small' | 'medium';

export interface PanelProps extends ElementProps {
  /** Heading at the top of the panel. */
  title?: Child;
  /** Footer line under a hairline, in caption type. */
  caption?: Child;
  /** Inner spacing: none (e.g. a full-bleed image), small (12px) or medium (16px). */
  padding?: PanelPadding;
  /** The panel's content. */
  children?: Child;
}

/** A card: the theme's surface, a hairline border and 12px corners, with an optional title and caption. */
export default function Panel(props: PanelProps = {}): NurvusElement<HTMLElement, PanelProps> {
  return updatable(({ title, caption, padding = 'medium', children, className, ...rest }: PanelProps) => spawn({
    className: classNames(className, 'panel', CONSTANT.CLASS_PREFIX),
    'data-padding': padding,
    ...rest,
    tag: 'section',
    // Same tests as the React Panel, so the same props give the same parts.
    children: [
      (title || children) && spawn({
        className: 'panel-body',
        children: [title && spawn({ tag: 'h3', className: 'panel-title', children: title }), children],
      }),
      caption && spawn({ className: 'panel-caption', children: caption }),
    ],
  }), props);
}
