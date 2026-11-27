import React from 'react';
import { Panel, Table, Tag, Text, Button, themes, themeRoles } from '@nurvus/ui';
import { checkTheme } from '../../../tools/contrast.mjs';
import Example from '../examples/Example';
import {
  generateColors, buildTheme, themeCss, fixContrast, rolesInChecks,
  normalizeHex, parseRgba, formatRgba, solidHex,
} from '../lib/themeGen';
import { formatRatio } from '../lib/contrastLevels';
import { downloadText, useCopy } from '../lib/fileActions';
import './ThemeStudio.scss';

const START = { name: 'Your brand', mode: 'light', brand: '#0D9488' };
const NEXT_ORDER = Math.max(...themes.map((t) => t.order)) + 1;
const MUST_BE_HEX = rolesInChecks(themeRoles);

// The roles in their roles.json groups: Surfaces, Text, Accent, Status, Code.
const GROUPS = [];
Object.keys(themeRoles).forEach((role) => {
  const { group } = themeRoles[role];
  let g = GROUPS.find((x) => x.name === group);
  if (!g) { g = { name: group, roles: [] }; GROUPS.push(g); }
  g.roles.push(role);
});

/**
 * A color picker and a text field for one color. The text field takes #RGB or
 * #RRGGBB (and rgba() when `allowAlpha`); a value it can't read is marked and
 * not applied, then put back when the field loses focus.
 */
function ColorField({ value, onChange, label, allowAlpha = false }) {
  const [draft, setDraft] = React.useState(value);
  const editing = React.useRef(false);
  React.useEffect(() => { if (!editing.current) setDraft(value); }, [value]);

  const read = (text) => {
    const hex = normalizeHex(text);
    if (hex) return hex;
    const rgba = allowAlpha && parseRgba(text);
    return rgba ? formatRgba(rgba) : null;
  };
  // The picker has no alpha: an rgba() value keeps its own.
  const pick = (event) => {
    const hex = event.target.value.toUpperCase();
    const current = parseRgba(value);
    if (!current) { onChange(hex); return; }
    const n = parseInt(hex.slice(1), 16);
    onChange(formatRgba({ r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: current.a }));
  };
  const valid = read(draft) !== null;

  // A fragment: the parent places the picker and the text field.
  return (
    <>
      <input type="color" className="ts-swatch" value={ solidHex(value).toLowerCase() } onChange={ pick } aria-label={ `${label}: pick a color` } />
      <input
        type="text"
        className="ts-hex"
        value={ draft }
        size={ Math.max(8, draft.length) }
        spellCheck={ false }
        autoComplete="off"
        aria-label={ `${label}: value` }
        aria-invalid={ !valid }
        onFocus={ () => { editing.current = true; } }
        onBlur={ () => { editing.current = false; setDraft(value); } }
        onChange={ (event) => {
          setDraft(event.target.value);
          const next = read(event.target.value);
          if (next) onChange(next);
        } }
      />
    </>
  );
}

// The sample code in the preview: [syntax role or 'text' / 'punct', text] pairs.
const CODE = (name) => [
  [['comment', `// ${name}: checkout button`]],
  [['keyword', 'import'], ['punct', ' { '], ['text', 'Button'], ['punct', ' } '], ['keyword', 'from'], ['string', " '@nurvus/ui'"], ['punct', ';']],
  [],
  [['keyword', 'export function'], ['function', ' Checkout'], ['punct', '({ '], ['attr', 'total'], ['punct', ' = '], ['number', '42'], ['punct', ' }) {']],
  [['keyword', '  return'], ['tag', ' <Button'], ['attr', ' type'], ['punct', '='], ['string', '"primary"'], ['tag', '>'], ['text', 'Pay '], ['punct', '{'], ['select', 'total'], ['punct', '}'], ['tag', '</Button>'], ['punct', ';']],
  [['punct', '}']],
];
const SYNTAX = { comment: 1, keyword: 1, function: 1, tag: 1, attr: 1, string: 1, number: 1 };
const codeColor = (kind) => (SYNTAX[kind] ? `var(--nv-syntax-${kind})` : kind === 'punct' ? 'var(--nv-text-muted)' : 'var(--nv-text)');

/** Real @nurvus/ui components, drawn with the theme's colors set on the wrapper. */
function Preview({ theme }) {
  const vars = { colorScheme: theme.mode };
  Object.entries(theme.colors).forEach(([role, value]) => { vars[`--nv-${role}`] = value; });
  const stop = (event) => event.preventDefault();
  return (
    <div className="ts-preview" style={ vars } data-mode={ theme.mode }>
      <div className="ts-pv-top">
        <strong>{ theme.name }</strong>
        <input className="ts-pv-search" placeholder="Search orders" aria-label="Search (preview only)" />
      </div>
      <div className="ts-pv-main">
        <nav className="ts-pv-nav" aria-label="Preview menu">
          <span data-active="true">Orders</span>
          <span>Customers</span>
          <span>Reports</span>
        </nav>
        <div className="ts-pv-body">
          <Text as="h3" variant="title">Orders</Text>
          <Text as="p" variant="body">Body text, in the text color. <a href="#/" onClick={ stop }>A link</a> uses the accent.</Text>
          <Text as="p" variant="caption" tone="muted">Muted text: labels, captions and other details.</Text>
          <Text as="p" variant="caption" tone="subtle">Subtle text: hints and placeholders.</Text>
          <div className="ts-pv-row">
            <Button type="primary" size="small">Pay now</Button>
            <Button type="secondary" size="small">Cancel</Button>
          </div>
          <div className="ts-pv-row">
            { ['neutral', 'accent', 'success', 'warning', 'danger', 'info'].map((tone) => (
              <Tag key={ tone } tone={ tone }>{ tone[0].toUpperCase() + tone.slice(1) }</Tag>
            )) }
          </div>
          <Panel title="This month" caption="Updated 5 minutes ago" padding="small">
            <Text as="p" variant="body">128 orders, 4 waiting for payment.</Text>
          </Panel>
          <Table
            className="ts-pv-table"
            columns={ [
              { title: 'Order', dataKey: 'order' },
              { title: 'Status', dataKey: 'status', render: (value, key, row) => <Tag tone={ row.tone }>{ value }</Tag> },
              { title: 'Total', dataKey: 'total' },
            ] }
            data={ [
              { key: 1, order: '#1042', status: 'Paid', tone: 'success', total: '$42.00' },
              { key: 2, order: '#1041', status: 'Due', tone: 'warning', total: '$18.50' },
              { key: 3, order: '#1040', status: 'Failed', tone: 'danger', total: '$7.25' },
            ] }
          />
          <pre className="ts-pv-code" aria-label="Code sample">
            { CODE(theme.name).map((line, i) => (
              <div key={ i }>
                { line.map(([kind, text], j) => (
                  kind === 'select'
                    ? <span key={ j } className="ts-pv-selected">{ text }</span>
                    : <span key={ j } style={ { color: codeColor(kind) } }>{ text }</span>
                )) }
                { i === 3 && <span className="ts-pv-cursor" /> }
              </div>
            )) }
          </pre>
        </div>
      </div>
    </div>
  );
}

function headline(rows) {
  const fails = rows.filter((r) => !r.pass).length;
  if (!fails) return `All ${rows.length} checks pass`;
  return `${fails} ${fails === 1 ? 'check fails' : 'checks fail'}`;
}

/** The sales demo: a brand color in, a complete contrast-checked theme out. */
export default function ThemeStudio() {
  const [name, setName] = React.useState(START.name);
  const [mode, setMode] = React.useState(START.mode);
  const [brand, setBrand] = React.useState(START.brand);
  const [colors, setColors] = React.useState(() => generateColors(START, themeRoles));
  const [source, setSource] = React.useState('');
  const [edited, setEdited] = React.useState({});
  const [jsonLabel, copyJson] = useCopy('Copy JSON');
  const [cssLabel, copyCss] = useCopy('Copy CSS');

  // A new brand color or mode makes every color again.
  const regenerate = (next) => {
    setColors(generateColors(next, themeRoles));
    setEdited({});
    setSource('');
  };
  const changeBrand = (hex) => { setBrand(hex); regenerate({ brand: hex, mode }); };
  const changeMode = (next) => { setMode(next); regenerate({ brand, mode: next }); };
  const loadTheme = (id) => {
    const t = themes.find((x) => x.id === id);
    if (!t) return;
    setSource(id);
    setName(`${t.name} copy`);
    setMode(t.mode);
    setBrand(solidHex(t.colors.accent));
    setColors({ ...t.colors });
    setEdited({});
  };
  const editRole = (role, value) => {
    setColors((c) => ({ ...c, [role]: value }));
    setEdited((e) => ({ ...e, [role]: true }));
  };
  const fix = () => {
    const { colors: next, changed } = fixContrast(colors, themeRoles);
    setColors(next);
    setEdited((e) => changed.reduce((acc, role) => ({ ...acc, [role]: true }), { ...e }));
  };

  const theme = buildTheme({ name, mode, brand, colors, order: NEXT_ORDER }, themeRoles);
  const rows = checkTheme(theme, themeRoles);
  const failing = new Set(rows.filter((r) => !r.pass).map((r) => r.token));
  const allPass = failing.size === 0;
  const json = `${JSON.stringify(theme, null, 2)}\n`;
  const css = themeCss(theme);
  const editedCount = Object.keys(edited).length;

  const checkColumns = [
    { title: 'Color', dataKey: 'token', render: (token, k, row) => <span><code>{ token }</code> on <code>{ row.against }</code></span> },
    {
      title: 'Sample',
      'data-label': 'Sample',
      dataKey: 'sample',
      render: (v, k, row) => <span className="ts-sample" style={ { color: solidHex(theme.colors[row.token]), background: solidHex(theme.colors[row.against]) } }>Aa</span>,
    },
    { title: 'Ratio', 'data-label': 'Ratio', dataKey: 'ratio', render: (ratio, k, row) => <span className="ts-num">{ formatRatio(ratio, row.min) }:1</span> },
    { title: 'Needs', 'data-label': 'Needs', dataKey: 'min', render: (min) => <span className="ts-num">{ min }:1</span> },
    { title: 'Result', 'data-label': 'Result', dataKey: 'pass', render: (pass) => <Tag tone={ pass ? 'success' : 'danger' }>{ pass ? 'Pass' : 'Fail' }</Tag> },
  ];

  return (
    <div className="dx-page ts">
      <h1 className="dx-page-title">Theme Studio</h1>
      <p className="dx-lede">
        Type your brand color and get a complete NURVUS theme: all { Object.keys(themeRoles).length } colors, with every
        text and control color checked for contrast. Change any color, then copy the theme file.
      </p>

      <section className="ts-inputs" aria-label="Your brand">
        <label className="ts-field">
          <span>Theme name</span>
          <input type="text" className="ts-input" value={ name } onChange={ (e) => setName(e.target.value) } />
        </label>
        <fieldset className="ts-field ts-mode">
          <legend>Mode</legend>
          <div className="ts-seg">
            { ['light', 'dark'].map((m) => (
              <label key={ m } data-checked={ mode === m }>
                <input type="radio" name="ts-mode" value={ m } checked={ mode === m } onChange={ () => changeMode(m) } />
                { m === 'light' ? 'Light' : 'Dark' }
              </label>
            )) }
          </div>
        </fieldset>
        <div className="ts-field ts-brand">
          <span>Brand color</span>
          <span className="ts-color">
            <ColorField value={ brand } onChange={ changeBrand } label="Brand color" />
          </span>
        </div>
        <label className="ts-field">
          <span>Or start from a theme</span>
          <select className="ts-input" value={ source } onChange={ (e) => loadTheme(e.target.value) }>
            <option value="">Choose a theme</option>
            { themes.map((t) => <option key={ t.id } value={ t.id }>{ t.name } ({ t.mode })</option>) }
          </select>
        </label>
      </section>
      <p className="ts-note">
        Changing the brand color or the mode makes all { Object.keys(themeRoles).length } colors again, and replaces any you changed by hand.
      </p>

      <div className="ts-grid">
        <section className="ts-roles" aria-label="Colors">
          <h2 className="ts-h2">
            Colors
            { editedCount > 0 && <Tag tone="accent">{ editedCount } changed by hand</Tag> }
          </h2>
          { GROUPS.map((g) => (
            <div key={ g.name } className="ts-group">
              <h3>{ g.name }</h3>
              <ul>
                { g.roles.map((role) => (
                  <li key={ role } className="ts-role" data-role={ role } data-fail={ failing.has(role) } data-long={ String(colors[role]).length > 7 }>
                    <ColorField
                      value={ colors[role] }
                      onChange={ (v) => editRole(role, v) }
                      label={ role }
                      allowAlpha={ !MUST_BE_HEX.has(role) }
                    />
                    <span className="ts-role-head">
                      <code>{ role }</code>
                      { failing.has(role) && <Tag tone="danger">Fails</Tag> }
                    </span>
                    <span className="ts-role-use">{ themeRoles[role].use }</span>
                  </li>
                )) }
              </ul>
            </div>
          )) }
        </section>

        <section className="ts-side" aria-label="Preview">
          <div className="ts-sticky">
            <h2 className="ts-h2">
              Preview
              <Tag tone={ allPass ? 'success' : 'danger' } className="ts-headline-tag">{ headline(rows) }</Tag>
            </h2>
            <Preview theme={ theme } />
          </div>
        </section>
      </div>

      <section className="ts-section">
        <h2 className="ts-h2">Contrast</h2>
        <p className="ts-headline" data-pass={ allPass }>{ headline(rows) }</p>
        <p className="ts-p">
          Each pair below is a check from the theme rules: text needs 4.5:1, control edges and button fills 3:1.
          The numbers come from the same code the package build uses.
        </p>
        { !allPass && (
          <p className="ts-fix">
            <Button type="primary" size="small" onClick={ fix }>Fix failing colors</Button>
            <span>Makes each failing color lighter or darker until it passes. Its hue stays the same.</span>
          </p>
        ) }
        <div className="ts-scroll">
          <Table className="ts-checks" columns={ checkColumns } data={ rows.map((r) => ({ ...r, key: `${r.token}/${r.against}` })) } />
        </div>
      </section>

      <section className="ts-section">
        <h2 className="ts-h2">Export</h2>
        <p className="ts-p">
          The theme file, in the same shape as the ones the package ships. File name <code>{ theme.id }.json</code>.
          Edit the keywords, summary, description and best-for lines before you add it.
        </p>
        <div className="ts-actions">
          <Button type="primary" size="small" className="ts-copy-json" onClick={ () => copyJson(json) }>{ jsonLabel }</Button>
          <Button type="secondary" size="small" className="ts-download-json" onClick={ () => downloadText(`${theme.id}.json`, json, 'application/json') }>Download JSON</Button>
        </div>
        <Example owner="Guide" code={ json } mode="static" lang="text" />
        <p className="ts-p">The same colors as CSS, for an app that doesn't use the package's build.</p>
        <div className="ts-actions">
          <Button type="primary" size="small" className="ts-copy-css" onClick={ () => copyCss(css) }>{ cssLabel }</Button>
          <Button type="secondary" size="small" className="ts-download-css" onClick={ () => downloadText(`${theme.id}.css`, css, 'text/css') }>Download CSS</Button>
        </div>
        <Example owner="Guide" code={ css } mode="static" lang="text" />
        <Panel className="ts-add" padding="small">
          <Text as="p" variant="caption">
            <strong>Add it to the package:</strong> put <code>{ theme.id }.json</code> in <code>src/themes/</code>, list it
            in <code>src/themes/index.ts</code>, then run <code>npm run build:tokens</code>.
          </Text>
        </Panel>
      </section>
    </div>
  );
}
