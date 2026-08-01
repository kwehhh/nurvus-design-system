import React from 'react';
import PropTypes from 'prop-types';
import classNames  from 'classnames';
import CONSTANT from '../../constants.js';
import './Menu.scss';

/**
 * Menu component.
 * @returns {ReactElement} of Menu component.
 */
class Menu extends React.Component {

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
    const { itemRenderer } = this.props;

    if (items) {
      return items.map((item, i) => {
        const { className, label, style } = item;
        const type = path.length > 1 ? 'group' : '';
        const isActive = this.isActiveItem(activePath, i);
        const [ first, ...remainingPath ] = activePath;
        const nextPath = [...path, i];
        const indent = (20 * path.length) + 10;

        let itemChildren;
        if (itemRenderer) {
          itemChildren = itemRenderer(item);
        } else {
          itemChildren = label;
        }

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
              { itemChildren }
            </div>
            { this.renderItems(item.items, first === i ? remainingPath : [], nextPath) }

          </React.Fragment>
        );
      });
    }

    return null;
  }


  render() {
    const { activePath, className, children, itemRenderer, items, ...props } = this.props;

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

Menu.propTypes = {
  /**
   * Active menu item path.
   */
  activePath: PropTypes.array,
  /**
   * Menu item list to render.
   */
  items: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Menu item label.
     */
    label: PropTypes.node
  })),
  /**
   * Custom renderer for menu items.
   * @param {object} item - of current menu item
   */
  itemRenderer: PropTypes.func,
  /**
   * Event handler for menu item onClick.
   * @param {object} event - object
   * @param {array} activePath - of clicked menu item.
   */
  onClick: PropTypes.func
};

export default Menu;
