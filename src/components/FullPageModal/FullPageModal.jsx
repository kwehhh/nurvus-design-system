import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import CONSTANT from '../../constants.js';
import Layout from '../Layout/Layout.jsx';
import Title from '../Title/Title.jsx';
import './FullPageModal.scss';

/**
 * The FullPageModal shows additonal content overlayed on the screen.
 */
function FullPageModal({
  children,
  headerActions,
  title,
  visible = false,
  ...restProps
}) {
  function getAnimationState() {
    if (visible) {
      return 'reveal-in';
    }

    return 'reveal-out';
  }

  const [animationState, setAnimationState] = useState('');
  const [isVisible, setIsVisible] = useState(visible);

  // Clear animation and sync visibility states
  function clearAnimation() {
    if (animationState) {
      if (visible !== isVisible) {
        setIsVisible(visible);
        setAnimationState('');
      }
    }
  }

  // Trigger animation when visibility changes
  useEffect(() => {
    if (visible !== isVisible) {
      const animState = getAnimationState();
      setAnimationState(animState);
    }

    if (visible && !animationState) {
      setIsVisible(visible);
    }
  }, [visible]);

  const modalMask = isVisible ? <div className="mask" data-animate={ animationState } /> : null;

  const modalEl = (
    <div className={ `portal ${CONSTANT.CLASS_PREFIX}` } data-visible={ visible }>
      { modalMask }
      <div
        className={ `modal ${CONSTANT.CLASS_PREFIX}` }
        data-visible={ isVisible }
        data-animate={ animationState }
        onAnimationEnd={ clearAnimation }
        { ...restProps }
      >
        <div className="header">
          <Layout display="flex" alignItems="center" justifyContent="space-between">
            <Title>
              { title }
            </Title>
            <div className="header-actions">
              { headerActions }
            </div>
          </Layout>
        </div>
        { children }
      </div>
    </div>
  );

  // Note: Using Fragment for JS-DOCS to read prop-types
  return (
    <React.Fragment>
       { ReactDOM.createPortal(modalEl, document.body) }
    </React.Fragment>
  );
}

FullPageModal.propTypes = {
  /**
   * Custom class name.
   */
  className: PropTypes.string,
  /**
   * Title of Modal
   */
  title: PropTypes.node,
  /**
   * Header actions of Modal
   */
  headerActions: PropTypes.node,
  /**
   * Visibility of Modal
   */
  visible: PropTypes.bool
};

export default FullPageModal;
