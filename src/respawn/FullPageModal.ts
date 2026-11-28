import classNames from 'classnames';
import CONSTANT from '../constants';
import { spawn, Child, ElementProps } from './spawn';
import { NurvusElement } from './update';
import Layout from './Layout';
import Title from './Title';
import { dialogKeydown, focusDialog, restoreFocus } from '../dialog';
import '../components/FullPageModal/FullPageModal.scss';

export interface FullPageModalProps extends ElementProps {
  /** Shows the modal (animates in), or hides it (animates out). */
  visible?: boolean;
  /** Title in the modal's header. */
  title?: Child;
  /** Buttons at the right of the header, e.g. Close. */
  headerActions?: Child;
  /** The modal's content. */
  children?: Child;
  /** Appends the modal to this element when it is made, e.g. document.body. */
  mountEl?: Element;
  /** Called when someone presses Esc. Close the modal in it: modal.update({ visible: false }). */
  onClose?: () => void;
  /** Names the modal and its title: the title gets the id "<id>-title", and the modal is labelled by it. */
  id?: string;
}

/**
 * Shows content over the whole screen: a modal dialog, like the React one
 * (focus moves in when it opens and back when it closes, Tab stays inside,
 * Esc calls onClose). Returns the modal's outer element
 * (`<div class="portal nurvus">`, the one React puts into `<body>` itself):
 * mount it on document.body, or pass `mountEl: document.body`.
 *
 *   const modal = FullPageModal({ title: 'Settings', mountEl: document.body, children: … });
 *   modal.update({ visible: true });    // animates in
 *   modal.update({ visible: false });   // animates out, then hides
 *
 * Unlike the other components, update() changes this element in place and
 * returns the same one, so the in and out animations can run on it. The
 * attributes go through the same steps as the React FullPageModal:
 *   closed   portal data-visible="false", modal data-visible="false" (display: none), no mask
 *   opening  portal "true", a mask, modal data-visible="true" data-animate="reveal-in"
 *   closing  portal "false", mask and modal data-animate="reveal-out"
 *   closed   after the out animation ends.
 */
export default function FullPageModal(props: FullPageModalProps = {}): NurvusElement<HTMLDivElement, FullPageModalProps> {
  const { mountEl, ...initial } = props;
  let current: FullPageModalProps = initial;
  // The React component's two states.
  let isVisible = Boolean(current.visible);
  let animationState = '';
  let opener: Element | null = null;

  const portal = spawn<HTMLDivElement>({ className: `portal ${CONSTANT.CLASS_PREFIX}` }) as NurvusElement<HTMLDivElement, FullPageModalProps>;
  let mask: HTMLElement | null = null;
  let modal: HTMLElement;

  // Draws the attributes for the current state.
  const sync = () => {
    portal.setAttribute('data-visible', String(Boolean(current.visible)));
    if (isVisible) {
      if (!mask) mask = spawn({ className: 'mask' });
      mask.setAttribute('data-animate', animationState);
      if (mask.parentNode !== portal) portal.insertBefore(mask, modal);
    } else if (mask) {
      mask.remove();
      mask = null;
    }
    modal.setAttribute('data-visible', String(isVisible));
    modal.setAttribute('data-animate', animationState);
  };

  // When an animation ends: settle the visibility (React's clearAnimation).
  const clearAnimation = () => {
    const visible = Boolean(current.visible);
    if (animationState && visible !== isVisible) {
      isVisible = visible;
      animationState = '';
      sync();
    }
  };

  // When `visible` changes: start the animation (React's effect on [visible]).
  const start = (visible: boolean) => {
    const before = animationState;
    if (visible !== isVisible) animationState = visible ? 'reveal-in' : 'reveal-out';
    if (visible && !before) isVisible = true;
  };

  const buildModal = () => {
    const { children, className, headerActions, title, visible: _visible, mountEl: _mountEl, onClose, id, events, ...rest } = current;
    const titleId = id && title ? `${id}-title` : undefined;
    const el = spawn({
      className: classNames(className, 'modal', CONSTANT.CLASS_PREFIX),
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': titleId,
      'aria-label': !id && typeof title === 'string' ? title : undefined,
      tabindex: -1,
      id,
      ...rest,
      events: {
        ...(events as object),
        keydown: (event: KeyboardEvent, node: HTMLElement) => {
          dialogKeydown(event, node, current.onClose);
          if (events && (events as any).keydown) (events as any).keydown(event, node);
        },
      },
      tag: 'div',
      children: [
        spawn({
          className: 'header',
          children: Layout({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            children: [Title({ id: titleId, children: title }), spawn({ className: 'header-actions', children: headerActions })],
          }),
        }),
        children,
      ],
    });
    el.addEventListener('animationend', clearAnimation);
    return el;
  };

  modal = buildModal();
  portal.appendChild(modal);
  sync();

  portal.update = (changes) => {
    const was = Boolean(current.visible);
    current = { ...current, ...changes };
    if (Object.keys(changes).some((key) => key !== 'visible')) {
      const next = buildModal();
      modal.replaceWith(next);
      modal = next;
    }
    const visible = Boolean(current.visible);
    if (visible !== was) start(visible);
    sync();
    // Focus in on open; back to the opener on close.
    if (visible && !was) { opener = document.activeElement; focusDialog(modal); }
    if (!visible && was) { restoreFocus(opener); opener = null; }
    return portal;
  };

  if (mountEl) mountEl.appendChild(portal);
  // Open from the start: focus goes in once it is on the page.
  if (current.visible) { opener = document.activeElement; focusDialog(modal); }
  return portal;
}
