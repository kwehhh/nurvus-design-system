import React from 'react';

/**
 * The header's navigation button: three bars that change shape with what a
 * click will do. Closed, a hamburger (show the navigation). Open on a
 * desktop, an arrow pointing at the sidebar (slide it away); open on a
 * phone, a cross (close the drawer). The bars move, they aren't swapped, so
 * the change is one smooth motion (instant for reduced motion).
 */
export default function MenuToggle({ open, phone, onClick }) {
  const shape = !open ? 'bars' : phone ? 'close' : 'arrow';
  return (
    <button
      type="button"
      className="dx-menu-button"
      data-shape={ shape }
      onClick={ onClick }
      aria-label={ open ? 'Hide navigation' : 'Show navigation' }
      aria-expanded={ open }
      aria-controls="dx-sidebar"
    >
      <span className="dx-menu-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
