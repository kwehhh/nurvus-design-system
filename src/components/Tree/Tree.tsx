import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import { treeKeydown } from '../../tree';
import './Tree.scss';

export interface TreeItem {
  /** What the row shows (unless itemRenderer draws it). */
  label?: React.ReactNode;
  /** Child rows, shown indented under this one. */
  items?: TreeItem[];
  /** Custom class name for this row. */
  className?: string;
  /** Inline style for this row. */
  style?: React.CSSProperties;
  /** Anything else your itemRenderer needs. */
  [key: string]: any;
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** The rows to render; each can have child `items`. */
  items?: TreeItem[];
  /** The active row as a path of indexes, e.g. [2, 0] = the first child of the third row. */
  activePath?: number[];
  /** Draws a row's content instead of its label. */
  itemRenderer?: (item: TreeItem) => React.ReactNode;
  /** Called when a row is clicked (or picked with Enter or Space), with the event and that row's path. */
  onClick?: (event: React.MouseEvent<HTMLDivElement>, path: number[]) => void;
  /**
   * Deepest level that still indents. Deeper rows stay at that indent, so the
   * label keeps its room in a narrow panel.
   */
  maxIndentDepth?: number;
  /** Accessible name of the tree (screen readers say it), e.g. "Layers". */
  label?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * A nested list of rows to pick from, like a layers panel. Rows indent by
 * depth, the active one is highlighted, and a click reports the row's path.
 * By keyboard (the WAI-ARIA tree pattern): Tab reaches the active row, the
 * arrow keys move between rows, Enter or Space picks one.
 */
export default function Tree({
  activePath = [],
  className,
  itemRenderer,
  items,
  maxIndentDepth = 6,
  onClick,
  label = 'Tree',
  onKeyDown,
  children: _children,
  ...props
}: TreeProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>, path: number[]) => {
    event.stopPropagation();
    if (onClick) onClick(event, path);
  };
  // One row is in the tab order: the active one, or else the first.
  const activeKey = activePath.join();
  const tabKey = activeKey && findPath(items, activePath) ? activeKey : '0';

  const renderItems = (list: TreeItem[] | undefined, active: number[], path: number[] = []): React.ReactNode => {
    if (!list) return null;
    return list.map((item, i) => {
      const { className: itemClassName, label: itemLabel, style } = item;
      const type = path.length > 1 ? 'group' : '';
      const isActive = active.length === 1 && active[0] === i;
      const [first, ...remainingPath] = active;
      const nextPath = [...path, i];
      // Clamped so a deep tree cannot indent the label out of a narrow panel.
      // The px maths lives in Tree.scss against spacing tokens; JS only supplies depth.
      const depth = Math.min(path.length, maxIndentDepth);
      const hasChildren = !!(item.items && item.items.length);

      return (
        <React.Fragment key={ i }>
          <div
            className={ classNames(itemClassName, 'tree-item', CONSTANT.CLASS_PREFIX) }
            role="treeitem"
            aria-level={ path.length + 1 }
            aria-setsize={ list.length }
            aria-posinset={ i + 1 }
            aria-selected={ isActive }
            aria-expanded={ hasChildren ? true : undefined }
            tabIndex={ nextPath.join() === tabKey ? 0 : -1 }
            data-active={ isActive }
            data-type={ type }
            onClick={ (e) => handleClick(e, nextPath) }
            style={ { '--nurvus-tree-depth': String(depth), ...style } as React.CSSProperties }
          >
            { itemRenderer ? itemRenderer(item) : itemLabel }
          </div>
          { renderItems(item.items, first === i ? remainingPath : [], nextPath) }
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className={ classNames(className, 'tree', CONSTANT.CLASS_PREFIX) }
      role="tree"
      aria-label={ label }
      { ...props }
      onKeyDown={ (e) => { treeKeydown(e.nativeEvent, e.currentTarget); if (onKeyDown) onKeyDown(e); } }
    >
      { renderItems(items, activePath) }
    </div>
  );
}

/** Whether `path` names a row in `items`. */
function findPath(items: TreeItem[] | undefined, path: number[]): boolean {
  let list = items;
  for (let i = 0; i < path.length; i += 1) {
    const item = list && list[path[i]];
    if (!item) return false;
    list = item.items;
  }
  return path.length > 0;
}
