import React from 'react';
import { Select, themes, setTheme, currentTheme, initTheme, THEME_CHANGE_EVENT } from '@nurvus/ui';

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

// Light themes first, then dark: Select lists each group under its heading.
const OPTIONS = themes.map((t) => ({ value: t.id, label: t.name, description: t.keywords, group: t.mode === 'light' ? 'Light' : 'Dark' }));
const byId = (id) => themes.find((t) => t.id === id) || themes[0];

/**
 * The header's theme menu: @nurvus/ui's own Select, each theme with its
 * swatch, name and keywords. Calls setTheme() (data-theme on <html>, saved).
 * The inline script in docs/index.html applies the saved theme before the
 * first paint; this keeps the menu in step, including when a theme page's
 * "Use this theme" button switches it.
 */
export default function ThemeSwitcher() {
  const [id, setId] = React.useState(() => currentTheme().id);

  React.useEffect(() => {
    setId(initTheme().id);
    const root = document.documentElement;
    const sync = (e) => { if (e.target === root) setId(e.detail.id); };
    root.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => root.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  return (
    <Select
      id="nv-theme-select"
      className="nv-theme-select"
      label="Theme"
      align="end"
      value={ id }
      options={ OPTIONS }
      onChange={ (next) => setTheme(next) }
      renderValue={ (option) => (
        <>
          <ThemeSwatch theme={ byId(option && option.value) } />
          <span>{ option ? option.label : '' }</span>
        </>
      ) }
      renderOption={ (option) => (
        <>
          <ThemeSwatch theme={ byId(option.value) } />
          <span className="select-option-text">
            <span className="select-option-label">{ option.label }</span>
            <span className="select-option-description">{ option.description }</span>
          </span>
        </>
      ) }
    />
  );
}
