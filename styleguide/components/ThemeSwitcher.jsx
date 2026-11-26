import React from 'react';
import { themes, setTheme, currentTheme, initTheme, THEME_CHANGE_EVENT } from '@nurvus/ui';

/**
 * One picker for every NURVUS theme. Calls setTheme() from @nurvus/ui, which
 * sets data-theme on <html> and remembers the choice. The inline script in
 * styleguide.config.js applies the saved theme before the first paint; this
 * only keeps the menu in step (including when a theme page's "Use this theme"
 * button switches it).
 */
function ThemeSwitcher() {
  const [id, setId] = React.useState(() => currentTheme().id);

  React.useEffect(() => {
    setId(initTheme().id);
    const root = document.documentElement;
    const sync = (e) => { if (e.target === root) setId(e.detail.id); };
    root.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => root.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  return (
    <label className="nv-theme-switcher">
      <span className="nv-theme-switcher-label">Theme</span>
      <select value={ id } onChange={ (e) => setTheme(e.target.value) }>
        { ['light', 'dark'].map((mode) => (
          <optgroup key={ mode } label={ mode === 'light' ? 'Light' : 'Dark' }>
            { themes.filter((t) => t.mode === mode).map((t) => (
              <option key={ t.id } value={ t.id }>{ t.name }</option>
            )) }
          </optgroup>
        )) }
      </select>
    </label>
  );
}

export default ThemeSwitcher;
