import React from 'react';
import { Table, Tag } from '@nurvus/ui';
import { href } from '../router';
import './Guides.scss';

const ROWS = [
  { key: 'react', what: 'React 16.8, 17, 18, 19', level: 'full', how: "import { Button } from '@nurvus/ui'", note: 'Every component, with TypeScript types. Tested on React 16.14, 18.3 and 19.3.' },
  { key: 'respawn', what: 'Respawn', level: 'full', how: "import { Button } from '@nurvus/ui/respawn'", note: 'Every component as plain DOM, same props and markup as React. No React needed.' },
  { key: 'html', what: 'No framework (plain HTML and JavaScript)', level: 'full', how: '<script src=".../dist/respawn.js">', note: 'The Respawn build works on any page: window.nurvusRespawn has every component.' },
  { key: 'ts', what: 'TypeScript', level: 'full', how: "import type { ButtonProps } from '@nurvus/ui'", note: 'Types ship with the package, for both React and Respawn.' },
  { key: 'other', what: 'Vue, Svelte, Angular, Solid and others', level: 'styles', how: "@nurvus/ui/nurvus.css + themes/<id>.css", note: 'The themes, the CSS and the theme API (@nurvus/ui/theme). No components wrapped for these frameworks yet; the Respawn elements can be mounted by hand.' },
  { key: 'native', what: 'React Native, iOS, Android, design tools', level: 'colors', how: "@nurvus/ui/themes/<id>.json", note: 'The theme colors as data: the same files the CSS is built from.' },
  { key: 'ssr', what: 'Server rendering (Next.js, Remix…)', level: 'untested', how: '—', note: 'Not tested yet. The package skips its browser-only theme restore on the server.' },
];

const LEVEL = {
  full: <Tag tone="success">Full</Tag>,
  styles: <Tag tone="info">Themes and styles</Tag>,
  colors: <Tag tone="info">Colors</Tag>,
  untested: <Tag tone="warning">Not tested</Tag>,
};

/** What NURVUS UI works with, stated up front. */
export default function SupportedLibraries() {
  return (
    <div className="dx-page gd">
      <h1 className="dx-page-title">Supported libraries</h1>
      <p className="dx-lede">
        What NURVUS UI works with, before you install it. The components come in two versions with the same props:
        {' '}<a href={ href('Components') }>React</a> and <a href={ href('Respawn') }>Respawn</a> (plain DOM, no React).
        The themes work everywhere.
      </p>
      <Table
        className="gd-api"
        columns={ [
          { dataKey: 'what', title: 'Library' },
          { dataKey: 'level', title: 'Support', render: (v) => LEVEL[v] },
          { dataKey: 'how', title: 'How', render: (v) => <code>{ v }</code> },
          { dataKey: 'note', title: 'Notes' },
        ] }
        data={ ROWS }
      />

      <h2 className="gd-h2">Browsers</h2>
      <p className="gd-p">
        Current Chrome and Edge (111 and newer), Safari (16.2 and newer) and Firefox (113 and newer). The CSS uses
        {' '}<code>color-mix()</code> and <code>:where()</code>, which older browsers don't have.
      </p>

      <h2 className="gd-h2">What you install</h2>
      <ul className="gd-list">
        <li><strong>React apps:</strong> React and React DOM are peer dependencies (you bring your own, 16.8 to 19). The package's only other dependency is <code>classnames</code>.</li>
        <li><strong>Everyone else:</strong> nothing else. The Respawn build and the CSS have no dependencies.</li>
        <li><strong>Fonts:</strong> the CSS names Inter and JetBrains Mono but doesn't ship them. Load them (e.g. <code>@fontsource/inter</code>), or the system font is used.</li>
      </ul>
    </div>
  );
}
