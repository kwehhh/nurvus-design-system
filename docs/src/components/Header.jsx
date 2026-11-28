import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { NavToggle, Tooltip, modKey } from '@nurvus/ui';
import { useNavButton } from './navButton';
import Logo, { Wordmark } from './Logo';
import Search from './Search';
import { useBrandFx, Burst } from './brandFx';
import pkg from '../../../package.json';

const REPO_URL = 'https://github.com/kwehhh/nurvus-design-system';
const NPM_URL = 'https://www.npmjs.com/package/@nurvus/ui';

/**
 * GitHub's mark (their logo, used as they allow: a link to GitHub). Not one of
 * our icons, but drawn to their size: the viewBox has the 24-unit grid's
 * 2-unit margin, so the mark fills the same 20-unit live area as our icons.
 */
function GitHubMark() {
  return (
    <svg className="dx-github-mark" viewBox="-2 -2 28 28" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

/**
 * The newest @nurvus/ui on npm. package.json holds only the BASE version (CI
 * sets the alpha number while publishing), so it would show a stale label.
 * Shows nothing until npm answers; falls back to package.json if it can't.
 */
function useLatestVersion() {
  const [version, setVersion] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    fetch('https://registry.npmjs.org/@nurvus/ui/latest')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((latest) => { if (live) setVersion(latest.version); })
      .catch(() => { if (live) setVersion(pkg.version); });
    return () => { live = false; };
  }, []);
  return version;
}

/**
 * The site header: menu button, brand (the logo assembles when the site
 * opens; hover and click effects in brandFx.jsx), search (center), version,
 * theme menu, GitHub. `navShown`: whether the navigation is showing (the sidebar on a
 * desktop, the drawer on a phone); the button toggles it.
 */
export default function Header({ onMenu, navShown, phone }) {
  const version = useLatestVersion();
  const fx = useBrandFx();
  const desktopButton = useNavButton();
  const mod = modKey();
  return (
    <header className="dx-header">
      <div className="dx-header-start">
        { /* Round 10: the hamburger (Slide, asymmetric lines), or on a desktop the sidebar
            icon when chosen on Review. ⌘B / Ctrl+B toggles it (App.jsx); the tooltip shows
            the keys, and aria-keyshortcuts tells assistive technology. */ }
        <Tooltip id="dx-nav-tip" content={ navShown ? 'Hide sidebar' : 'Show sidebar' } shortcut={ phone ? undefined : [mod, 'B'] } align="start">
          <NavToggle
            open={ navShown }
            variant={ phone ? 'hamburger' : desktopButton }
            morph="slide"
            lines="asymmetric"
            label="sidebar"
            controls="dx-sidebar"
            aria-keyshortcuts={ mod === '⌘' ? 'Meta+B' : 'Control+B' }
            onClick={ onMenu }
          />
        </Tooltip>
        <a className="dx-brand nv-brand-fx" href="#/" { ...fx }>
          <span className="nv-brand-mark-wrap"><Logo id="dx-brand-logo" motion="assemble" tone="mono" className="dx-brand-mark" /><Burst /></span>
          <Wordmark />
        </a>
      </div>
      <Search id="dx-search" shortcut className="dx-search-header" />
      <div className="dx-header-tools">
        { version && (
          <a className="nv-version-link" href={ NPM_URL } target="_blank" rel="noopener noreferrer" title="Latest @nurvus/ui on npm">
            v{ version }
          </a>
        ) }
        <ThemeSwitcher />
        <a className="nv-icon-link" href={ REPO_URL } target="_blank" rel="noopener noreferrer" aria-label="NURVUS UI on GitHub (opens in a new tab)" title="View the source on GitHub">
          <GitHubMark />
        </a>
      </div>
    </header>
  );
}
