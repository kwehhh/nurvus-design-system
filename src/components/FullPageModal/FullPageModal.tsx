import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import Layout from '../Layout/Layout';
import Title from '../Title/Title';
import { dialogKeydown, focusDialog, restoreFocus } from '../../dialog';
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
  /** Called when someone presses Esc. Set visible to false in it to close the modal. */
  onClose?: () => void;
  /** Names the modal and its title: the title gets the id "<id>-title", and the modal is labelled by it. */
  id?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * Shows content over the whole screen, rendered into `<body>`: a modal dialog
 * (the WAI-ARIA dialog pattern). Opening it moves focus into it, and screen
 * readers say its title and "dialog"; Tab stays inside; Esc calls onClose;
 * closing it gives focus back to where it was.
 */
export default function FullPageModal({
  children,
  className,
  headerActions,
  title,
  visible = false,
  onClose,
  id,
  onKeyDown,
  ...restProps
}: FullPageModalProps) {
  const [animationState, setAnimationState] = useState('');
  const [isVisible, setIsVisible] = useState(visible);
  const modalRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  // Focus in on open; back to the opener on close.
  useEffect(() => {
    if (visible) {
      openerRef.current = document.activeElement;
      if (modalRef.current) focusDialog(modalRef.current);
    } else if (openerRef.current) {
      restoreFocus(openerRef.current);
      openerRef.current = null;
    }
  }, [visible]);

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
        ref={ modalRef }
        className={ classNames(className, 'modal', CONSTANT.CLASS_PREFIX) }
        data-visible={ isVisible }
        data-animate={ animationState }
        role="dialog"
        aria-modal="true"
        aria-labelledby={ id && title ? `${id}-title` : undefined }
        aria-label={ !id && typeof title === 'string' ? title : undefined }
        tabIndex={ -1 }
        id={ id }
        onAnimationEnd={ clearAnimation }
        { ...restProps }
        onKeyDown={ (e) => { dialogKeydown(e.nativeEvent, e.currentTarget, onClose); if (onKeyDown) onKeyDown(e); } }
      >
        <div className="header">
          <Layout display="flex" alignItems="center" justifyContent="space-between">
            <Title id={ id && title ? `${id}-title` : undefined }>{ title }</Title>
            <div className="header-actions">{ headerActions }</div>
          </Layout>
        </div>
        { children }
      </div>
    </div>
  );

  return <React.Fragment>{ ReactDOM.createPortal(modalEl, document.body) }</React.Fragment>;
}
