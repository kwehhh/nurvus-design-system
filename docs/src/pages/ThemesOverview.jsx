import React from 'react';
import { themes } from '@nurvus/ui';
import { href } from '../router';

// Phase 2 placeholder: the real overview moves over in phase 4.
export default function ThemesOverview() {
  return (
    <div className="dx-page">
      <h1 className="dx-page-title">Themes</h1>
      <ul>{ themes.map((t) => <li key={ t.id }><a href={ href('Themes', t.name) }>{ t.name }</a></li>) }</ul>
    </div>
  );
}
