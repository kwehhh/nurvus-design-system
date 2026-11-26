import React from 'react';
import { ThemeCollection, ThemeGrid, ThemeUsage } from '../themes/ThemeCollection';

/** Themes: the collection card, every theme as a card, how an app applies one. */
export default function ThemesOverview() {
  return (
    <div className="dx-page dx-themes">
      <h1 className="dx-page-title">Themes</h1>
      <ThemeCollection />
      <h2 className="dx-section-title">All themes</h2>
      <p className="dx-lede">
        Each theme is a complete palette of its own: the same 27 role tokens, every one with a value.
        Pick a card to see the theme in use, or switch the whole site with <strong>Theme</strong> at the top right.
      </p>
      <ThemeGrid />
      <h2 className="dx-section-title">Applying a theme</h2>
      <ThemeUsage />
    </div>
  );
}
