import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import GitHubIcon from '@material-ui/icons/GitHub';
import ThemeSwitcher from './ThemeSwitcher';
import MenuToggle from './MenuToggle';
import Logo, { Wordmark } from './Logo';
import Search from './Search';
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

/**
 * The site header: menu button, brand, search (center), version, theme menu,
 * GitHub. `navShown`: whether the navigation is showing (the sidebar on a
 * desktop, the drawer on a phone); the button toggles it.
 */
export default function Header({ onMenu, navShown, phone }) {
  const version = useLatestVersion();
  return (
    <header className="dx-header">
      <div className="dx-header-start">
        <MenuToggle open={ navShown } phone={ phone } onClick={ onMenu } />
        <a className="dx-brand" href="#/"><Logo id="dx-brand-logo" motion="current" className="dx-brand-mark" /><Wordmark /></a>
      </div>
      <Search id="dx-search" shortcut className="dx-search-header" />
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
