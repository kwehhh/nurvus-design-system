import React from 'react';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Menu.scss';

/**
 * Menu component.
 * @returns {ReactElement} of Menu component.
 */
export default class Menu extends React.Component {

  handleClick = (e, path) => {
    e.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick(e, path);
    }
  }

  isActiveItem(path, currentIndex) {
    return path.length && path.length === 1 && path[0] === currentIndex;
  }

  renderItems(items, activePath=[], path = []) {

    if (items) {
      return items.map((item, i) => {
        const { className, label, style } = item;
        const type = path.length > 1 ? 'group' : '';
        const isActive = this.isActiveItem(activePath, i);
        const [ first, ...remainingPath ] = activePath;
        const nextPath = [...path, i];
        const indent = (20 * path.length) + 10;

        return (
          <React.Fragment key={ i }>
            <div
              className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'menu-item', className) }
              data-active={ isActive }
              data-type={ type }
              onClick={ e => this.handleClick(e, nextPath) }
              style={ {
                paddingLeft: indent,
                ...style
              } }
            >
              { label }
            </div>
            { this.renderItems(item.items, remainingPath, nextPath) }

          </React.Fragment>
        );
      });
    }

    return null;
  }


  render() {
    const { activePath, className, children, items, ...props } = this.props;

    return (
      <div
        className={ classNames(`${CONSTANT.CLASS_PREFIX}`, 'menu', className) }
        { ...props }
      >
        { this.renderItems(items, activePath) }
      </div>
    );
  }
}