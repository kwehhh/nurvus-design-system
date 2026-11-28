import React from 'react';

/**
 * The header's navigation button, in the shapes people know:
 *  - Desktop, where the sidebar is docked beside the page: a sidebar icon (a
 *    window with a side pane, as in VS Code, ChatGPT or Linear). Its pane is
 *    filled while the sidebar shows and slides empty when it's hidden.
 *  - Phone, where the navigation is a drawer over the page: three bars that
 *    turn into a cross while it is open (the bars move; they aren't swapped).
 * Changes are one smooth motion (instant for reduced motion).
 */
export default function MenuToggle({ open, phone, onClick }) {
  const shape = phone ? (open ? 'close' : 'bars') : 'panel';
  return (
    <button
      type="button"
      className="dx-menu-button"
      data-shape={ shape }
      data-open={ open }
      onClick={ onClick }
      aria-label={ open ? 'Hide navigation' : 'Show navigation' }
      aria-expanded={ open }
      aria-controls="dx-sidebar"
    >
      { phone ? (
        <span className="dx-menu-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : (
        <svg className="dx-menu-panel" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path className="dx-menu-pane" d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4z" />
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
        </svg>
      ) }
    </button>
  );
}
