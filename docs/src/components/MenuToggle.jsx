import React from 'react';

/** The shapes the three bars can turn into while the navigation is open. */
export const MENU_MORPHS = [
  { id: 'cross', name: 'Cross', about: 'The outer bars cross, the middle one fades: close. The most common.' },
  { id: 'slide', name: 'Slide', about: 'The cross, while the middle bar slides out to the left and fades (Jonathan Suh\'s Slider). The phone menu.' },
  { id: 'squeeze', name: 'Squeeze', about: 'The outer bars close in on the middle, then turn into the cross: two beats.' },
  { id: 'elastic', name: 'Elastic', about: 'The cross, on a spring: the bars swing past and settle.' },
  { id: 'arrow', name: 'Back arrow', about: 'The outer bars swing in to make an arrow pointing at the sidebar.' },
  { id: 'chevron', name: 'Chevron', about: 'The bars fold into a ‹: slide it away, without the arrow\'s shaft.' },
  { id: 'merge', name: 'Collapse', about: 'The outer bars slide into the middle one: three become one, folded.' },
  { id: 'spin', name: 'Spin to cross', about: 'The cross, turning half a circle on the way: livelier.' },
];

/**
 * The navigation button on a phone (and the shapes on #/Review): three bars
 * (the hamburger) that move into another shape while the navigation is open
 * (`morph`, default a cross), and back. On a desktop the header uses
 * SidebarToggle. The bars move, they aren't swapped, so it is one smooth motion
 * (instant for reduced motion).
 */
export default function MenuToggle({ open, onClick, morph = 'cross', controls = 'dx-sidebar' }) {
  return (
    <button
      type="button"
      className="dx-menu-button"
      data-shape={ open ? morph : 'bars' }
      onClick={ onClick }
      aria-label={ open ? 'Hide navigation' : 'Show navigation' }
      aria-expanded={ open }
      aria-controls={ controls }
    >
      <span className="dx-menu-bars" data-morph={ morph } aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
