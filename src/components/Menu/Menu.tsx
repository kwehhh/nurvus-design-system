import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Menu.scss';

export interface MenuItem {
  /** What the row shows (unless itemRenderer draws it). */
  label?: React.ReactNode;
  /** Child rows, shown indented under this one. */
  items?: MenuItem[];
  /** Custom class name for this row. */
  className?: string;
  /** Inline style for this row. */
  style?: React.CSSProperties;
  /** Anything else your itemRenderer needs. */
  [key: string]: any;
}

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** The rows to render; each can have child `items`. */
  items?: MenuItem[];
  /** The active row as a path of indexes, e.g. [2, 0] = the first child of the third row. */
  activePath?: number[];
  /** Draws a row's content instead of its label. */
  itemRenderer?: (item: MenuItem) => React.ReactNode;
  /** Called on a row click with the event and that row's path. */
  onClick?: (event: React.MouseEvent<HTMLDivElement>, path: number[]) => void;
  /**
   * Deepest level that still indents. Deeper rows stay at that indent, so the
   * label keeps its room in a narrow panel.
   */
  maxIndentDepth?: number;
  /** Custom class name. */
  className?: string;
}

/**
 * A nested list of rows, like a layers panel. Rows indent by depth, the
 * active one is highlighted, and a click reports the row's path.
 */
export default function Menu({
  activePath = [],
  className,
  itemRenderer,
  items,
  maxIndentDepth = 6,
  onClick,
  children: _children,
  ...props
}: MenuProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>, path: number[]) => {
    event.stopPropagation();
    if (onClick) onClick(event, path);
  };

  const renderItems = (list: MenuItem[] | undefined, active: number[], path: number[] = []): React.ReactNode => {
    if (!list) return null;
    return list.map((item, i) => {
      const { className: itemClassName, label, style } = item;
      const type = path.length > 1 ? 'group' : '';
      const isActive = active.length === 1 && active[0] === i;
      const [first, ...remainingPath] = active;
      const nextPath = [...path, i];
      // Clamped so a deep tree cannot indent the label out of a narrow panel.
      // The px maths lives in Menu.scss against spacing tokens; JS only supplies depth.
      const depth = Math.min(path.length, maxIndentDepth);

      return (
        <React.Fragment key={ i }>
          <div
            className={ classNames(itemClassName, 'menu-item', CONSTANT.CLASS_PREFIX) }
            data-active={ isActive }
            data-type={ type }
            onClick={ (e) => handleClick(e, nextPath) }
            style={ { '--nurvus-menu-depth': String(depth), ...style } as React.CSSProperties }
          >
            { itemRenderer ? itemRenderer(item) : label }
          </div>
          { renderItems(item.items, first === i ? remainingPath : [], nextPath) }
        </React.Fragment>
      );
    });
  };

  return (
    <div className={ classNames(className, 'menu', CONSTANT.CLASS_PREFIX) } { ...props }>
      { renderItems(items, activePath) }
    </div>
  );
}
