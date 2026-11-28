import React from 'react';
import { Select, themes, setTheme, currentTheme, initTheme } from '@nurvus/ui';

/**
 * The theme button's icon (round 10: a touch of NURVUS on shadcn/ui's
 * half-filled circle): the filled half is the theme's own accent-to-info
 * gradient, and it turns half a circle whenever the theme changes, like a
 * moon phase (keyed on the theme, so it replays). 20px, like every header icon.
 */
function ThemeMark({ theme }) {
  return (
    <svg key={ theme } className="dx-theme-mark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dx-theme-half" gradientUnits="userSpaceOnUse" x1="12" y1="3" x2="12" y2="21">
          <stop style={ { stopColor: 'var(--nv-accent)' } } />
          <stop offset="1" style={ { stopColor: 'var(--nv-info)' } } />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path className="dx-theme-half" d="M12 3a9 9 0 0 1 0 18z" fill="url(#dx-theme-half)" />
    </svg>
  );
}

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
    const root = document.documentElement;
    // data-mode="light|dark" on <html>, so the site can style the two kinds
    // apart (the wordmark). It follows data-theme however that changes: this
    // menu, a theme page's "Use this theme", or code setting the attribute.
    const sync = () => { const theme = currentTheme(root); root.setAttribute('data-mode', theme.mode === 'light' ? 'light' : 'dark'); setId(theme.id); };
    initTheme();
    sync();
    const watch = new MutationObserver(sync);
    watch.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => watch.disconnect();
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
      title={ `Theme: ${byId(id).name}` }
      // One small icon (round 9, as on shadcn/ui): the theme's name is in the
      // button for screen readers ("Theme, combobox, Apollo White") and the tooltip.
      renderValue={ (option) => (
        <>
          <ThemeMark theme={ option ? option.value : '' } />
          <span className="dx-sr-only">{ option ? option.label : '' }</span>
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
