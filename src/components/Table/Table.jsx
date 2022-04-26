import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Table.scss';

class Table extends React.Component {
  renderCells(rowProps) {
    const { columns } = this.props;

    return columns.map((columnProps, i) => {
      const { dataKey } = columnProps;

      return (
        <td key={ dataKey || i }>
          { rowProps[columnProps.dataKey] }
        </td>
      );
    });
  }

  renderHeader() {
    const { columns } = this.props;

    return columns.map((columnProps, i) => {
      const { dataKey, title } = columnProps;

      return (
        <th key={ dataKey || i }>
          { title || dataKey }
        </th>
      );
    });
  }

  renderRows() {
    const{ data } = this.props;

    return data.map((rowProps, i) => {
      const { key } = rowProps;

      const isEven = i % 2 == 0;

      return (
        <tr key={ key || i } data-even={ isEven }>
          { this.renderCells(rowProps) }
        </tr>
      );
    });
  }

  render() {
    const { className } = this.props;
    return (
      <table
        className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'table', className) }
      >
        <thead>
          <tr>
            { this.renderHeader() }
          </tr>
        </thead>
        <tbody>
          { this.renderRows() }
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * Columns to render in table.
   */
  columns: PropTypes.array,
  /**
   * Data to render in table.
   */
  data: PropTypes.array
 };

export default Table;
