import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps, Style } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Menu/Menu.scss';

export interface MenuItem {
  /** What the row shows (unless itemRenderer draws it). */
  label?: Child;
  /** Child rows, shown indented under this one. */
  items?: MenuItem[];
  /** Custom class name for this row. */
  className?: string;
  /** Inline style for this row. */
  style?: Style;
  /** Anything else your itemRenderer needs. */
  [key: string]: any;
}

export interface MenuProps extends ElementProps {
  /** The rows to render; each can have child `items`. */
  items?: MenuItem[];
  /** The active row as a path of indexes, e.g. [2, 0] = the first child of the third row. */
  activePath?: number[];
  /** Draws a row's content instead of its label. */
  itemRenderer?: (item: MenuItem) => Child;
  /** Called on a row click with the event and that row's path, after the row is marked active. */
  onClick?: (event: MouseEvent, path: number[]) => void;
  /** Deepest level that still indents. Deeper rows stay at that indent. */
  maxIndentDepth?: number;
}

/**
 * A nested list of rows, like a layers panel. Rows indent by depth and the
 * active one is highlighted. A click marks that row active (in place: the
 * element stays the same) and calls onClick(event, path). To set the active
 * row from code: menu.update({ activePath: [1] }).
 */
export default function Menu(props: MenuProps = {}): NurvusElement<HTMLDivElement, MenuProps> {
  return updatable(({
    activePath = [], className, itemRenderer, items, maxIndentDepth = 6, onClick, children: _children, ...rest
  }: MenuProps, keep) => {
    const rows: { el: HTMLElement; path: string }[] = [];
    const markActive = (path: number[]) => {
      const key = path.join();
      rows.forEach((row) => row.el.setAttribute('data-active', String(row.path === key)));
    };

    const renderItems = (list: MenuItem[] | undefined, active: number[], path: number[] = []): HTMLElement[] => {
      if (!list) return [];
      return list.flatMap((item, i) => {
        const { className: itemClassName, label, style } = item;
        const type = path.length > 1 ? 'group' : '';
        const isActive = active.length === 1 && active[0] === i;
        const [first, ...remainingPath] = active;
        const nextPath = [...path, i];
        // Clamped so a deep tree cannot indent the label out of a narrow panel (see Menu.scss).
        const depth = Math.min(path.length, maxIndentDepth);
        const el = spawn({
          className: classNames(itemClassName, 'menu-item', CONSTANT.CLASS_PREFIX),
          'data-active': isActive,
          'data-type': type,
          style: { '--nurvus-menu-depth': String(depth), ...style },
          events: {
            click: (event) => {
              event.stopPropagation();
              keep({ activePath: nextPath });
              markActive(nextPath);
              if (onClick) onClick(event, nextPath);
            },
          },
          children: itemRenderer ? itemRenderer(item) : label,
        });
        rows.push({ el, path: nextPath.join() });
        return [el, ...renderItems(item.items, first === i ? remainingPath : [], nextPath)];
      });
    };

    return spawn<HTMLDivElement>({
      className: classNames(className, 'menu', CONSTANT.CLASS_PREFIX),
      ...rest,
      tag: 'div',
      children: renderItems(items, activePath),
    });
  }, props);
}
