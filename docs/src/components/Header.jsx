import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import GitHubIcon from '@material-ui/icons/GitHub';
import MenuIcon from '@material-ui/icons/Menu';
import ThemeSwitcher from './ThemeSwitcher';
import pkg from '../../../package.json';

const REPO_URL = 'https://github.com/kwehhh/nurvus-design-system';
const NPM_URL = 'https://www.npmjs.com/package/@nurvus/ui';

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

export default function Header({ onMenu, menuOpen }) {
  const version = useLatestVersion();
  return (
    <header className="dx-header">
      <button
        type="button"
        className="dx-menu-button nv-icon-link"
        onClick={ onMenu }
        aria-label={ menuOpen ? 'Close navigation' : 'Open navigation' }
        aria-expanded={ menuOpen }
        aria-controls="dx-sidebar"
      >
        <MenuIcon fontSize="small" />
      </button>
      <a className="dx-brand" href="#/Themes">NURVUS UI</a>
      <div className="dx-header-tools">
        { version && (
          <a className="nv-version-link" href={ NPM_URL } target="_blank" rel="noopener noreferrer" title="Latest @nurvus/ui on npm">
            v{ version }
          </a>
        ) }
        <ThemeSwitcher />
        <Tooltip title="View the source on GitHub" arrow>
          <a className="nv-icon-link" href={ REPO_URL } target="_blank" rel="noopener noreferrer" aria-label="NURVUS UI on GitHub (opens in a new tab)">
            <GitHubIcon fontSize="small" />
          </a>
        </Tooltip>
      </div>
    </header>
  );
}
