import React from 'react';
import { getTheme, setTheme, themeRoles, Button, Progress, Table, Title, Tree } from '@nurvus/ui';
import { checkTheme } from '../../../tools/contrast.mjs';
import { CodeBlock } from './ThemeCollection';
import './ThemePage.scss';

// One shared snippet, so themes compare like for like. [kind, text] pairs;
// kind is a syntax role (or text / punct).
const snippet = (theme) => [
  [['comment', `// ${theme.name}: ${theme.keywords}`]],
  [['keyword', 'import'], ['text', ' React '], ['keyword', 'from'], ['string', " 'react'"], ['punct', ';']],
  [],
  [['keyword', 'export const'], ['function', ' Button'], ['punct', ' = ({ '], ['attr', 'size'], ['punct', ' = '], ['number', '16'], ['punct', ' }) '], ['keyword', '=>'], ['punct', ' (']],
  [['punct', '  '], ['tag', '<button'], ['attr', ' className'], ['punct', '='], ['string', '"primary"'], ['attr', ' style'], ['punct', '={{ '], ['attr', 'padding'], ['punct', ': '], ['text', 'size'], ['punct', ' }}'], ['tag', '>']],
  [['text', `    Hello ${theme.name.split(' ')[0]}`]],
  [['punct', '  '], ['tag', '</button>']],
  [['punct', ');']],
];

const SYNTAX = { comment: 1, keyword: 1, function: 1, tag: 1, attr: 1, string: 1, number: 1 };
const tokenColor = (kind) => (SYNTAX[kind] ? `var(--nv-syntax-${kind})` : kind === 'punct' ? 'var(--nv-text-muted)' : 'var(--nv-text)');

// Where each surface goes in the editor mock: the answer to "how do these
// near-identical greys work together".
const SURFACES = [
  ['bg-deep', 'Activity bar (far left icon strip)'],
  ['bg-alt', 'Title bar and sidebar'],
  ['surface', 'Tab bar and status bar'],
  ['bg', 'Editor, where the content lives'],
  ['accent-soft', 'Selected file in the sidebar'],
  ['border', 'The 1px lines between areas'],
];

function AppMock({ theme }) {
  return (
    <figure className="tp-mock" aria-label={ `${theme.name} editor preview` }>
      <div className="tp-mock-title">
        <span className="tp-dots"><i /><i /><i /></span>
        <span>Button.jsx · { theme.name }</span>
      </div>
      <div className="tp-mock-body">
        <div className="tp-mock-activity">
          { ['▣', '⌕', '⑂', '⚙'].map((icon, i) => <span key={ icon } data-active={ i === 0 }>{ icon }</span>) }
        </div>
        <div className="tp-mock-sidebar">
          <div className="tp-mock-heading">Explorer</div>
          <div>▾ src</div>
          <div className="tp-mock-file" data-active="true">Button.jsx</div>
          <div className="tp-mock-file">styles.css</div>
          <div className="tp-mock-file">index.js</div>
        </div>
        <div className="tp-mock-main">
          <div className="tp-mock-tabs">
            <span data-active="true">Button.jsx</span>
            <span>styles.css</span>
          </div>
          <pre className="tp-mock-code">
            { snippet(theme).map((line, i) => (
              <div key={ i }>
                <span className="tp-ln">{ i + 1 }</span>
                { line.map(([kind, text], j) => <span key={ j } style={ { color: tokenColor(kind) } }>{ text }</span>) }
                { i === 5 && <span className="tp-cursor" /> }
              </div>
            )) }
          </pre>
        </div>
      </div>
      <div className="tp-mock-status">
        <span>⑂ main</span>
        <span>UTF-8 · JavaScript JSX</span>
      </div>
    </figure>
  );
}

function SurfaceLegend({ theme }) {
  return (
    <ul className="tp-legend">
      { SURFACES.map(([role, where]) => (
        <li key={ role }>
          <span className="tp-chip" style={ { background: `var(--nv-${role})` } } />
          <code>--nv-{ role }</code>
          <span className="tp-hex">{ theme.colors[role] }</span>
          <span>{ where }</span>
        </li>
      )) }
    </ul>
  );
}

function ComponentPreview() {
  const [active, setActive] = React.useState([1]);
  return (
    <div className="tp-components">
      <div className="tp-col">
        <Title level={ 3 }>Components in this theme</Title>
        <Title level={ 5 } type="secondary">Real @nurvus/ui components, reading only --nv-* tokens</Title>
        <div className="tp-row">
          <Button type="primary" size="small">Primary</Button>
          <Button type="secondary" size="small">Secondary</Button>
          <Button type="primary" size="small" disabled>Disabled</Button>
        </div>
        <div className="tp-progress">
          <Progress size="medium" percent={ 70 } />
          <Progress size="medium" percent={ 55 } status="success" />
          <Progress size="medium" percent={ 40 } status="warning" />
          <Progress size="medium" percent={ 25 } status="critical" />
        </div>
      </div>
      <div className="tp-col">
        <Tree
          label="Sample tree"
          activePath={ active }
          items={ [{ label: 'Layers' }, { label: 'Timeline' }, { label: 'Presets' }, { label: 'Export' }] }
          onClick={ (e, path) => setActive(path) }
        />
      </div>
      <div className="tp-col tp-wide">
        <Table
          columns={ [{ title: 'Token', dataKey: 'token' }, { title: 'Used for', dataKey: 'use' }] }
          data={ [
            { id: 1, token: '--nv-surface', use: 'This header row' },
            { id: 2, token: '--nv-bg', use: 'These rows' },
          ] }
        />
      </div>
    </div>
  );
}

function TokenTable({ theme }) {
  const checks = checkTheme(theme, themeRoles);
  const groups = [];
  Object.keys(themeRoles).forEach((role) => {
    const { group } = themeRoles[role];
    let g = groups.find((x) => x.name === group);
    if (!g) { g = { name: group, roles: [] }; groups.push(g); }
    g.roles.push(role);
  });
  return (
    <table className="tp-tokens">
      <thead>
        <tr><th>Token</th><th>Value</th><th>What it is for</th><th>Contrast (WCAG)</th></tr>
      </thead>
      { groups.map((g) => (
        <tbody key={ g.name }>
          <tr className="tp-group"><th colSpan={ 4 }>{ g.name }</th></tr>
          { g.roles.map((role) => {
            const rows = checks.filter((c) => c.token === role);
            return (
              <tr key={ role }>
                <td><code>--nv-{ role }</code></td>
                <td><span className="tp-chip" style={ { background: theme.colors[role] } } /> <span className="tp-hex">{ theme.colors[role] }</span></td>
                <td>{ themeRoles[role].use }</td>
                <td className="tp-contrast">
                  { rows.length ? rows.map((c) => (
                    <div key={ c.against } data-pass={ c.pass }>
                      { c.pass ? '✓' : '✗' } { c.ratio.toFixed(2) }:1 on { c.against } <span>(min { c.min })</span>
                    </div>
                  )) : <span className="tp-na">—</span> }
                </td>
              </tr>
            );
          }) }
        </tbody>
      )) }
    </table>
  );
}

/** A theme's page: what it is, how it looks in use, and every token. */
export function ThemePage({ id }) {
  const theme = getTheme(id);
  const fails = checkTheme(theme, themeRoles).filter((c) => !c.pass).length;
  return (
    <div className="tp" data-theme={ theme.id }>
      <header className="tp-hero">
        <p className="tp-edition">
          { theme.mode === 'dark' ? 'Dark theme' : 'Light theme' }
          <span className="tp-badge">{ theme.status }</span>
          <span className="tp-badge" data-pass={ !fails }>{ fails ? `${fails} contrast issue${fails > 1 ? 's' : ''}` : 'WCAG AA ✓' }</span>
        </p>
        <h2 className="tp-name" style={ { color: `var(--nv-${theme.showcase.title})` } }>{ theme.name }</h2>
        <p className="tp-keywords">{ theme.keywords }</p>
        <p className="tp-summary">{ theme.summary }</p>
        <div className="tp-swatches">
          { theme.showcase.swatches.map((role) => <span key={ role } style={ { background: `var(--nv-${role})` } } title={ `${role} ${theme.colors[role]}` } />) }
        </div>
        <button type="button" className="tp-use" onClick={ () => setTheme(theme.id) }>Use { theme.name } for the whole site</button>
      </header>

      <section className="tp-section">
        <h3>The idea</h3>
        <p className="tp-description">{ theme.description }</p>
        <p><strong>Best for:</strong> { theme.bestFor }</p>
      </section>

      <section className="tp-section">
        <h3>In use</h3>
        <AppMock theme={ theme } />
        <h4>How the surfaces stack</h4>
        <SurfaceLegend theme={ theme } />
      </section>

      <section className="tp-section">
        <ComponentPreview />
      </section>

      <section className="tp-section">
        <h3>Every token ({ Object.keys(themeRoles).length })</h3>
        <TokenTable theme={ theme } />
      </section>

      <section className="tp-section">
        <h3>Use it</h3>
        <CodeBlock>{ theme.id === 'apollo-white'
          ? `// Apollo White is the default: it's in the core CSS, nothing to load.
import { setTheme } from '@nurvus/ui';

setTheme('apollo-white');   // back to it from another theme`
          : `import '@nurvus/ui/themes/${theme.id}.css';   // load this theme (about 1 KB)
import { setTheme } from '@nurvus/ui';

setTheme('${theme.id}');

// or make it the page's default, in HTML:
<html data-theme="${theme.id}">` }</CodeBlock>
      </section>
    </div>
  );
}

export default ThemePage;
