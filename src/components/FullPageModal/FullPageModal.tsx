import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import Layout from '../Layout/Layout';
import Title from '../Title/Title';
import './FullPageModal.scss';

export interface FullPageModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Shows the modal (animates in), or hides it (animates out). */
  visible?: boolean;
  /** Title in the modal's header. */
  title?: React.ReactNode;
  /** Buttons at the right of the header, e.g. Close. */
  headerActions?: React.ReactNode;
  /** The modal's content. */
  children?: React.ReactNode;
  /** Custom class name. */
  className?: string;
}

/** Shows additional content over the whole screen, rendered into `<body>`. */
export default function FullPageModal({
  children,
  className,
  headerActions,
  title,
  visible = false,
  ...restProps
}: FullPageModalProps) {
  const [animationState, setAnimationState] = useState('');
  const [isVisible, setIsVisible] = useState(visible);

  // Clear animation and sync visibility states
  function clearAnimation() {
    if (animationState && visible !== isVisible) {
      setIsVisible(visible);
      setAnimationState('');
    }
  }

  // Trigger animation when visibility changes
  useEffect(() => {
    if (visible !== isVisible) {
      setAnimationState(visible ? 'reveal-in' : 'reveal-out');
    }
    if (visible && !animationState) {
      setIsVisible(visible);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const modalEl = (
    <div className={ `portal ${CONSTANT.CLASS_PREFIX}` } data-visible={ visible }>
      { isVisible ? <div className="mask" data-animate={ animationState } /> : null }
      <div
        className={ classNames(className, 'modal', CONSTANT.CLASS_PREFIX) }
        data-visible={ isVisible }
        data-animate={ animationState }
        onAnimationEnd={ clearAnimation }
        { ...restProps }
      >
        <div className="header">
          <Layout display="flex" alignItems="center" justifyContent="space-between">
            <Title>{ title }</Title>
            <div className="header-actions">{ headerActions }</div>
          </Layout>
        </div>
        { children }
      </div>
    </div>
  );

  return <React.Fragment>{ ReactDOM.createPortal(modalEl, document.body) }</React.Fragment>;
}
