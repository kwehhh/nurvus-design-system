import React from 'react';
import { getTheme } from '@nurvus/ui';
import { ThemePage as ThemeDetail } from '../themes/ThemePage';

/** One theme's page, shown in that theme whatever the site's theme is. */
export default function ThemePage({ id }) {
  const theme = getTheme(id);
  return (
    <div className="dx-page">
      <h1 className="dx-page-title">{ theme.name }</h1>
      <ThemeDetail id={ id } />
    </div>
  );
}
