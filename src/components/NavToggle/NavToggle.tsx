import React from 'react';
import classNames from 'classnames';
import CONSTANT from '../../constants';
import './NavToggle.scss';

export type NavToggleMorph = 'slide' | 'cross' | 'squeeze' | 'elastic' | 'spin' | 'arrow' | 'chevron' | 'collapse';

export interface NavToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Whether the navigation it controls is showing. */
  open: boolean;
  /** 'hamburger' (three bars, for a menu that covers the page) or 'sidebar' (a window with a side pane, for a sidebar beside the page). */
  variant?: 'hamburger' | 'sidebar';
  /** Hamburger: how the bars change while open. 'slide' (default): a cross, the middle bar sliding out to the left. */
  morph?: NavToggleMorph;
  /** Hamburger: three bars of one length, or 'asymmetric' (long, short, middle) that line up when pointed at or open. */
  lines?: 'even' | 'asymmetric';
  /** What it shows and hides, for its name: "Show navigation" / "Hide navigation". */
  label?: string;
  /** The id of the navigation it controls (aria-controls). */
  controls?: string;
  /** Custom class name. */
  className?: string;
}

/**
 * The button that shows and hides navigation. Two looks: the hamburger, whose
 * bars move into another shape while the navigation is open (eight morphs),
 * and the sidebar icon, a window whose side pane fills while the sidebar shows
 * and empties as its divider slides away. The shapes move, they aren't
 * swapped; instantly for reduced motion. It says what it does ("Hide
 * navigation") and whether it is open (aria-expanded).
 */
export default function NavToggle({
  open,
  variant = 'hamburger',
  morph = 'slide',
  lines = 'even',
  label = 'navigation',
  controls,
  className,
  ...restProps
}: NavToggleProps) {
  const sidebar = variant === 'sidebar';
  return (
    <button
      type="button"
      className={ classNames(className, 'nav-toggle', CONSTANT.CLASS_PREFIX) }
      data-variant={ variant }
      data-morph={ sidebar ? undefined : morph }
      data-lines={ sidebar ? undefined : lines }
      data-open={ open }
      aria-expanded={ open }
      aria-controls={ controls }
      aria-label={ `${open ? 'Hide' : 'Show'} ${label}` }
      { ...restProps }
    >
      { sidebar ? (
        <svg className="nav-toggle-panel" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect className="nav-toggle-outline" x="2.5" y="4" width="19" height="16" rx="2.5" />
          <rect className="nav-toggle-fill" x="4" y="5.5" width="5" height="13" rx="0.5" />
          <path className="nav-toggle-divider" d="M10 4V20" />
        </svg>
      ) : (
        <span className="nav-toggle-bars" aria-hidden="true"><span /><span /><span /></span>
      ) }
    </button>
  );
}
