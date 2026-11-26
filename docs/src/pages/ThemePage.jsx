import React from 'react';
import { getTheme } from '@nurvus/ui';

// Phase 2 placeholder: the real theme page moves over in phase 4.
export default function ThemePage({ id }) {
  const theme = getTheme(id);
  return (
    <div className="dx-page">
      <h1 className="dx-page-title">{ theme.name }</h1>
      <p>{ theme.keywords }</p>
    </div>
  );
}
