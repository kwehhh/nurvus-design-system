import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { themes, setTheme, currentTheme, initTheme, THEME_CHANGE_EVENT } from '@nurvus/ui';

/** A theme's mark: its background, edged and dotted with its accent fill. */
function ThemeSwatch({ theme }) {
  return (
    <span
      className="nv-theme-swatch"
      style={ { background: theme.colors.bg, borderColor: theme.colors['accent-fill'] } }
      aria-hidden="true"
    >
      <span style={ { background: theme.colors['accent-fill'] } } />
    </span>
  );
}

/**
 * One menu for every NURVUS theme, in the same style as the CSS Animation
 * Factory's: light themes first, then dark, each with its swatch, name and
 * keywords. Calls setTheme() from @nurvus/ui (data-theme on <html>, saved).
 * The inline script in styleguide.config.js applies the saved theme before
 * the first paint; this keeps the menu in step, including when a theme page's
 * "Use this theme" button switches it.
 */
function ThemeSwitcher() {
  const [id, setId] = React.useState(() => currentTheme().id);
  const [anchor, setAnchor] = React.useState(null);

  React.useEffect(() => {
    setId(initTheme().id);
    const root = document.documentElement;
    const sync = (e) => { if (e.target === root) setId(e.detail.id); };
    root.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => root.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  const current = themes.find((t) => t.id === id) || themes[0];
  const pick = (next) => {
    setAnchor(null);
    if (next !== id) setTheme(next);
  };

  const items = [];
  [['light', 'Light'], ['dark', 'Dark']].forEach(([mode, title]) => {
    items.push(<ListSubheader key={ mode } className="nv-theme-group">{ title }</ListSubheader>);
    themes.filter((t) => t.mode === mode).forEach((t) => {
      items.push(
        <MenuItem key={ t.id } selected={ t.id === id } onClick={ () => pick(t.id) } className="nv-theme-item">
          <ThemeSwatch theme={ t } />
          <span className="nv-theme-text">
            <span className="nv-theme-name">{ t.name }</span>
            <span className="nv-theme-keywords">{ t.keywords }</span>
          </span>
        </MenuItem>
      );
    });
  });

  return (
    <>
      <button
        type="button"
        className="nv-theme-trigger"
        onClick={ (e) => setAnchor(e.currentTarget) }
        aria-label={ `Theme: ${current.name}` }
        aria-haspopup="menu"
        aria-controls={ anchor ? 'nv-theme-menu' : undefined }
        aria-expanded={ anchor ? 'true' : undefined }
      >
        <ThemeSwatch theme={ current } />
        <span>{ current.name }</span>
        <span className="nv-theme-chevron" aria-hidden="true">▾</span>
      </button>
      <Menu
        id="nv-theme-menu"
        anchorEl={ anchor }
        open={ !!anchor }
        onClose={ () => setAnchor(null) }
        getContentAnchorEl={ null }
        anchorOrigin={ { vertical: 'bottom', horizontal: 'right' } }
        transformOrigin={ { vertical: 'top', horizontal: 'right' } }
        PaperProps={ { className: 'nv-theme-menu-paper' } }
        MenuListProps={ { dense: true, 'aria-label': 'Theme' } }
      >
        { items }
      </Menu>
    </>
  );
}

export default ThemeSwitcher;
