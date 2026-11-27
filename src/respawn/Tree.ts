import classNames from 'classnames';
import CONSTANT from '../constants';
import { treeKeydown } from '../tree';
import { spawn, Child, ElementProps, Style } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Tree/Tree.scss';

export interface TreeItem {
  /** What the row shows (unless itemRenderer draws it). */
  label?: Child;
  /** Child rows, shown indented under this one. */
  items?: TreeItem[];
  /** Custom class name for this row. */
  className?: string;
  /** Inline style for this row. */
  style?: Style;
  /** Anything else your itemRenderer needs. */
  [key: string]: any;
}

export interface TreeProps extends ElementProps {
  /** The rows to render; each can have child `items`. */
  items?: TreeItem[];
  /** The active row as a path of indexes, e.g. [2, 0] = the first child of the third row. */
  activePath?: number[];
  /** Draws a row's content instead of its label. */
  itemRenderer?: (item: TreeItem) => Child;
  /** Called when a row is clicked (or picked with Enter or Space), after it is marked active, with the event and its path. */
  onClick?: (event: MouseEvent, path: number[]) => void;
  /** Deepest level that still indents. Deeper rows stay at that indent. */
  maxIndentDepth?: number;
  /** Accessible name of the tree (screen readers say it), e.g. "Layers". */
  label?: string;
}

/**
 * A nested list of rows to pick from, like a layers panel. Rows indent by
 * depth and the active one is highlighted. A click (or Enter / Space) marks
 * that row active (in place: the element stays the same) and calls
 * onClick(event, path); the arrow keys move between rows. To set the active
 * row from code: tree.update({ activePath: [1] }).
 */
export default function Tree(props: TreeProps = {}): NurvusElement<HTMLDivElement, TreeProps> {
  return updatable(({
    activePath = [], className, itemRenderer, items, maxIndentDepth = 6, onClick, label = 'Tree', children: _children, ...rest
  }: TreeProps, keep) => {
    const rows: { el: HTMLElement; path: string }[] = [];
    const markActive = (path: number[]) => {
      const key = path.join();
      rows.forEach((row) => {
        row.el.setAttribute('data-active', String(row.path === key));
        row.el.setAttribute('aria-selected', String(row.path === key));
        row.el.setAttribute('tabindex', row.path === key ? '0' : '-1');
      });
    };

    const renderItems = (list: TreeItem[] | undefined, active: number[], path: number[] = []): HTMLElement[] => {
      if (!list) return [];
      return list.flatMap((item, i) => {
        const { className: itemClassName, label: itemLabel, style } = item;
        const type = path.length > 1 ? 'group' : '';
        const isActive = active.length === 1 && active[0] === i;
        const [first, ...remainingPath] = active;
        const nextPath = [...path, i];
        // Clamped so a deep tree cannot indent the label out of a narrow panel (see Tree.scss).
        const depth = Math.min(path.length, maxIndentDepth);
        const el = spawn({
          className: classNames(itemClassName, 'tree-item', CONSTANT.CLASS_PREFIX),
          role: 'treeitem',
          'aria-level': path.length + 1,
          'aria-setsize': list.length,
          'aria-posinset': i + 1,
          'aria-selected': isActive,
          'aria-expanded': item.items && item.items.length ? true : undefined,
          tabIndex: -1,
          'data-active': isActive,
          'data-type': type,
          style: { '--nurvus-tree-depth': String(depth), ...style },
          events: {
            click: (event) => {
              event.stopPropagation();
              keep({ activePath: nextPath });
              markActive(nextPath);
              if (onClick) onClick(event, nextPath);
            },
          },
          children: itemRenderer ? itemRenderer(item) : itemLabel,
        });
        rows.push({ el, path: nextPath.join() });
        return [el, ...renderItems(item.items, first === i ? remainingPath : [], nextPath)];
      });
    };

    const children = renderItems(items, activePath);
    // One row is in the tab order: the active one, or else the first (as in React).
    const stop = rows.find((row) => row.path === activePath.join() && activePath.length) || rows[0];
    if (stop) stop.el.setAttribute('tabindex', '0');

    const { events, ...others } = rest;
    return spawn<HTMLDivElement>({
      className: classNames(className, 'tree', CONSTANT.CLASS_PREFIX),
      role: 'tree',
      'aria-label': label,
      ...others,
      events: {
        ...events,
        keydown: (event: KeyboardEvent, el: HTMLElement) => {
          treeKeydown(event, el);
          if (events && events.keydown) events.keydown(event, el);
        },
      },
      tag: 'div',
      children,
    });
  }, props);
}
