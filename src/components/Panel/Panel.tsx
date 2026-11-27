import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Panel.scss';

export type PanelPadding = 'none' | 'small' | 'medium';

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Heading at the top of the panel. */
  title?: React.ReactNode;
  /** Footer line under a hairline, in caption type. */
  caption?: React.ReactNode;
  /** Inner spacing: none (e.g. a full-bleed image), small (12px) or medium (16px). */
  padding?: PanelPadding;
  /** The panel's content. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/**
 * A card: the theme's surface, a hairline border and 12px corners, with an
 * optional title and a caption footer. Use it to group related content.
 */
export default function Panel({
  title,
  caption,
  padding = 'medium',
  children,
  className,
  ...restProps
}: PanelProps) {
  return (
    <section
      className={ classNames(className, 'panel', CONSTANT.CLASS_PREFIX) }
      data-padding={ padding }
      { ...restProps }
    >
      { (title || children) && (
        <div className="panel-body">
          { title && <h3 className="panel-title">{ title }</h3> }
          { children }
        </div>
      ) }
      { caption && <div className="panel-caption">{ caption }</div> }
    </section>
  );
}
