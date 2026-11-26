import React from 'react';
import { themes, getTheme } from '@nurvus/ui';
import './ThemeCollection.scss';

/** The page link styleguidist gives a theme's sub-section. */
export const themeHref = (theme) => `#/Themes/${encodeURIComponent(theme.name)}`;

const edition = (theme) => `${theme.mode === 'dark' ? 'Dark' : 'Light'} edition`;

/**
 * "The theme collection": Tokyo Neon and Apollo White side by side, matched to
 * the 2026-08-23 concept screenshot. Colors come from the theme files via each
 * theme's `showcase` roles.
 */
export function ThemeCollection() {
  const pair = [getTheme('tokyo-neon'), getTheme('apollo-white')];
  return (
    <div className="tc-stage">
      <div className="tc-inner">
        <h3 className="tc-heading">The theme collection</h3>
        <div className="tc-card">
          { pair.map((t) => {
            const c = (role) => t.colors[role];
            return (
              <section key={ t.id } className="tc-half" style={ { background: c('bg') } }>
                <p className="tc-edition" style={ { color: c(t.showcase.label) } }>{ edition(t).toUpperCase() }</p>
                <h4 className="tc-name" style={ { color: c(t.showcase.title) } }>{ t.name }</h4>
                <p className="tc-tagline" style={ { color: c(t.showcase.tagline) } }>{ t.keywords }</p>
                <div className="tc-swatches">
                  { t.showcase.swatches.map((role) => (
                    <span key={ role } className="tc-swatch" style={ { background: c(role) } } role="img" aria-label={ `${role} ${c(role)}` } title={ `${role} ${c(role)}` } />
                  )) }
                </div>
              </section>
            );
          }) }
        </div>
      </div>
    </div>
  );
}

/**
 * Every theme as a card. Each card is rendered INSIDE its own theme
 * (data-theme on the card), so the colors are the real CSS tokens.
 */
export function ThemeGrid() {
  return (
    <div className="tg-grid">
      { themes.map((t) => (
        <a key={ t.id } className="tg-card" data-theme={ t.id } href={ themeHref(t) }>
          <span className="tg-edition">{ t.mode === 'dark' ? 'Dark theme' : 'Light theme' } · { t.status }</span>
          <span className="tg-name" style={ { color: `var(--nv-${t.showcase.title})` } }>{ t.name }</span>
          <span className="tg-keywords">{ t.keywords }</span>
          <span className="tg-summary">{ t.summary }</span>
          <span className="tg-swatches">
            { t.showcase.swatches.map((role) => <span key={ role } style={ { background: `var(--nv-${role})` } } />) }
          </span>
        </a>
      )) }
    </div>
  );
}

/** A plain code block that reads well in every theme. */
export function CodeBlock({ children }) {
  return <pre className="tg-code">{ children }</pre>;
}

/** How an app applies a theme. */
export function ThemeUsage() {
  return (
    <div className="tg-usage">
      <p>1. Import the package once. Its CSS carries every theme as a <code>[data-theme]</code> block.</p>
      <CodeBlock>{ `import { setTheme, initTheme, themes } from '@nurvus/ui';

initTheme('tokyo-neon');   // at startup: the saved theme, or this default
setTheme('apollo-white');  // switch (and remember it)
themes.map((t) => t.name); // every theme, for a picker` }</CodeBlock>
      <p>2. Or set the attribute yourself. With none, the page gets Apollo White.</p>
      <CodeBlock>{ `<html data-theme="tokyo-neon">` }</CodeBlock>
      <p>3. Themes nest: any element can carry its own theme, like a dark sidebar in a light app.</p>
      <CodeBlock>{ `<body data-theme="apollo-white">
  <nav data-theme="tokyo-neon">…</nav>
</body>

setTheme('tokyo-neon', { root: navElement, persist: false });` }</CodeBlock>
      <p>4. Style your own UI with the role tokens, never raw hex. They mean the same thing in every theme.</p>
      <CodeBlock>{ `.card {
  background: var(--nv-surface);
  color: var(--nv-text);
  border: 1px solid var(--nv-border);
}
.card a { color: var(--nv-accent); }` }</CodeBlock>
    </div>
  );
}

export default ThemeCollection;
