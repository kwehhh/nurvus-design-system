import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Title } from '@nurvus/ui';
import Tooltip from '@material-ui/core/Tooltip';
import GitHubIcon from '@material-ui/icons/GitHub';
import ThemeSwitcher from './ThemeSwitcher';

const REPO_URL = 'https://github.com/kwehhh/nurvus-design-system';
const NPM_URL = 'https://www.npmjs.com/package/@nurvus/ui';

/**
 * The newest @nurvus/ui on npm. package.json only holds the BASE version
 * (CI sets the alpha number inside the publish job), so reading it here would
 * show a stale label. Shows nothing until npm answers; falls back to the
 * package.json version if npm can't be reached.
 */
function useLatestVersion(fallback) {
  const [version, setVersion] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    fetch('https://registry.npmjs.org/@nurvus/ui/latest')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((pkg) => { if (live) setVersion(pkg.version); })
      .catch(() => { if (live) setVersion(fallback); });
    return () => { live = false; };
  }, [fallback]);
  return version;
}

// ReactDOM.render(
//   <div>
//     asdsadas cvcxvcxv
//     <Button />
//   </div>,
//   document.body
// );



function NavBar(props) {
  const { style } = props;
  const version = useLatestVersion(props.version);

  return (
    <div className="navbar" style={ style }>
      <Layout
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{
          // maxWidth: 500,
          margin: '0 auto',
          height: '100%',
          padding: 20
        }}


      >
      <Title level={ 2 }>
        { props.title }
      </Title>
      <Layout display="flex" alignItems="center" itemSpacing={ 10 }>
        { version && (
          <a className="nv-version-link" href={ NPM_URL } target="_blank" rel="noopener noreferrer" title="Latest @nurvus/ui on npm">
            v{ version }
          </a>
        ) }
        <ThemeSwitcher />
        <Tooltip title="View the source on GitHub" arrow>
          <a
            className="nv-icon-link"
            href={ REPO_URL }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NURVUS UI on GitHub (opens in a new tab)"
          >
            <GitHubIcon fontSize="small" />
          </a>
        </Tooltip>
      </Layout>
    </Layout>
    </div>
  )
}
export default NavBar;