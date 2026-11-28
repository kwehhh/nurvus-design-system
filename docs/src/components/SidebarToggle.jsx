import React from 'react';

/**
 * A sidebar toggle in the VS Code / ChatGPT / Linear style: a window with a
 * side pane that fills while the panel shows and slides empty when it's
 * hidden. Kept for later (round 8: the header went back to the hamburger);
 * Foundations > Brand > Review shows it. The static version is the
 * `panel-left` icon in @nurvus/ui.
 */
export default function SidebarToggle({ open, onClick, controls, label = 'navigation' }) {
  return (
    <button
      type="button"
      className="dx-menu-button"
      data-shape="panel"
      data-open={ open }
      onClick={ onClick }
      aria-label={ `${open ? 'Hide' : 'Show'} ${label}` }
      aria-expanded={ open }
      aria-controls={ controls }
    >
      <svg className="dx-menu-panel" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path className="dx-menu-pane" d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4z" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
      </svg>
    </button>
  );
}
