import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CONSTANT from '../../constants.js';
import './Panel.scss';

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
}) {
  return (
    <section
      className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'panel', className) }
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

Panel.propTypes = {
  /**
   * Heading at the top of the panel.
   */
  title: PropTypes.node,
  /**
   * Footer line under a hairline, in caption type.
   */
  caption: PropTypes.node,
  /**
   * Inner spacing: none (e.g. a full-bleed image), small (12px) or medium (16px).
   */
  padding: PropTypes.oneOf(['none', 'small', 'medium']),
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * The panel's content.
   */
  children: PropTypes.node
};
