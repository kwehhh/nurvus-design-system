import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { updatable, NurvusElement } from './update';
import '../components/Table/Table.scss';

/** A row of data: any object. */
export type TableRow = Record<string, any>;

export interface TableColumn<Row extends TableRow = TableRow> extends ElementProps {
  /** Which field of each row this column shows. */
  dataKey: string;
  /** Header text. Defaults to the dataKey. */
  title?: Child;
  /** Formats a cell: gets the value, the dataKey and the whole row. Returns text, an element or spawn props. */
  render?: (value: any, dataKey: string, row: Row) => Child;
}

export interface TableProps<Row extends TableRow = TableRow> {
  /** The columns, in order. Any other column prop (e.g. style) goes on its `<th>` and `<td>`s. */
  columns: TableColumn<Row>[];
  /** The rows, in order. */
  data: Row[];
  /** Custom class name. */
  className?: string;
}

/** A data table. Columns describe the fields; each can format its cells with `render`. */
export default function Table<Row extends TableRow = TableRow>(props: TableProps<Row>): NurvusElement<HTMLTableElement, TableProps<Row>> {
  return updatable(({ className, columns = [], data = [] }: TableProps<Row>) => spawn<HTMLTableElement>({
    tag: 'table',
    className: classNames(className, 'table', CONSTANT.CLASS_PREFIX),
    children: [
      spawn({
        tag: 'thead',
        children: spawn({
          tag: 'tr',
          children: columns.map(({ dataKey, title, render, ...cell }) => spawn({ ...cell, tag: 'th', children: title || dataKey })),
        }),
      }),
      spawn({
        tag: 'tbody',
        children: data.map((row, i) => spawn({
          tag: 'tr',
          'data-even': i % 2 === 0,
          children: columns.map(({ dataKey, render, title, ...cell }) => {
            const value = row[dataKey];
            return spawn({ ...cell, tag: 'td', children: render ? render(value, dataKey, row) : value });
          }),
        })),
      }),
    ],
  }), props);
}
