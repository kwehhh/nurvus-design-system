import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './Table.scss';

/** A row of data: any object. Its `key` (if any) keys the row. */
export type TableRow = Record<string, any>;

export interface TableColumn<Row extends TableRow = TableRow>
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'title'> {
  /** Which field of each row this column shows. */
  dataKey: string;
  /** Header text. Defaults to the dataKey. */
  title?: React.ReactNode;
  /** Formats a cell: gets the value, the dataKey and the whole row. */
  render?: (value: any, dataKey: string, row: Row) => React.ReactNode;
}

export interface TableProps<Row extends TableRow = TableRow> {
  /** The columns, in order. Any other column prop (e.g. style) goes on its `<th>` and `<td>`s. */
  columns: TableColumn<Row>[];
  /** The rows, in order. */
  data: Row[];
  /** Custom class name. */
  className?: string;
}

/**
 * A data table: one rounded frame, a tinted header row with sentence-case
 * labels, hairlines between rows. Columns describe the fields; each can
 * format its cells with `render`.
 */
export default function Table<Row extends TableRow = TableRow>({ className, columns = [], data = [] }: TableProps<Row>) {
  return (
    <table className={ classNames(className, 'table', CONSTANT.CLASS_PREFIX) }>
      <thead>
        <tr>
          { columns.map((column, i) => {
            // render formats cells; passing it on to <th> made React warn.
            const { dataKey, title, render, ...props } = column;
            return <th key={ dataKey || i } { ...props }>{ title || dataKey }</th>;
          }) }
        </tr>
      </thead>
      <tbody>
        { data.map((row, i) => (
          <tr key={ row.key || i } data-even={ i % 2 === 0 }>
            { columns.map((column, j) => {
              // title and render describe the column; they are not <td> attributes.
              const { dataKey, render, title, ...props } = column;
              const value = row[dataKey];
              return <td key={ dataKey || j } { ...props }>{ render ? render(value, dataKey, row) : value }</td>;
            }) }
          </tr>
        )) }
      </tbody>
    </table>
  );
}
