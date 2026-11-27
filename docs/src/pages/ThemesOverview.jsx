import React from 'react';
import { ThemeCollection, ThemeGrid } from '../themes/ThemeCollection';
import { href } from '../router';

/** Themes: the collection card and every theme as a card. How to apply one has its own page. */
export default function ThemesOverview() {
  return (
    <div className="dx-page dx-themes">
      <h1 className="dx-page-title">Themes</h1>
      <ThemeCollection />
      <h2 className="dx-section-title">All themes</h2>
      <p className="dx-lede">
        Each theme is a complete palette of its own: the same 27 role tokens, every one with a value.
        Pick a card to see the theme in use, or switch the whole site with <strong>Theme</strong> at the top right.
        To use them in your app, see <a href={ href('Guides', 'Applying a theme') }>Applying a theme</a>.
      </p>
      <ThemeGrid />
    </div>
  );
}
