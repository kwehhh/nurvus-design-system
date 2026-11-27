import React from 'react';
import { Panel, Table, Tag, Button, themes, themeRoles } from '@nurvus/ui';
import { checkTheme } from '../../../tools/contrast.mjs';
import { formatRatio, kindOf, criterionOf, levelOf } from '../lib/contrastLevels';
import { downloadText } from '../lib/fileActions';
import './AccessibilityReport.scss';

// When these numbers were worked out: when this module loaded in the browser.
const CHECKED_AT = new Date();
// The build time, if the docs build defines __NURVUS_BUILD_TIME__ (Vite `define`).
// eslint-disable-next-line no-undef
const BUILT_AT = typeof __NURVUS_BUILD_TIME__ !== 'undefined' ? new Date(__NURVUS_BUILD_TIME__) : null;

const when = (date) => date.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Every check of every theme, from the shipped theme files and the build's own check code. */
const REPORT = themes.map((theme) => {
  const rows = checkTheme(theme, themeRoles).map((r) => {
    const kind = kindOf(r.token, themeRoles);
    return {
      ...r,
      key: `${r.token}/${r.against}`,
      fg: theme.colors[r.token],
      bg: theme.colors[r.against],
      kind,
      criterion: criterionOf(kind),
      level: levelOf(r.ratio, kind),
    };
  });
  const lowest = rows.reduce((a, b) => (b.ratio < a.ratio ? b : a));
  return { theme, rows, passed: rows.filter((r) => r.pass).length, lowest };
});
const PAIRS = REPORT[0].rows.length;
const TOTAL = REPORT.reduce((n, t) => n + t.rows.length, 0);
const PASSED = REPORT.reduce((n, t) => n + t.passed, 0);

const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

/** Every row of every theme as CSV, with a header row. */
function toCsv() {
  const header = ['theme_id', 'theme_name', 'mode', 'foreground_role', 'foreground_hex', 'background_role', 'background_hex', 'ratio', 'required', 'criterion', 'highest_level', 'result'];
  const lines = [header];
  REPORT.forEach(({ theme, rows }) => rows.forEach((r) => {
    lines.push([theme.id, theme.name, theme.mode, r.token, r.fg, r.against, r.bg, formatRatio(r.ratio, r.min), r.min, r.criterion, r.level, r.pass ? 'pass' : 'fail']);
  }));
  return `${lines.map((l) => l.map(csvCell).join(',')).join('\n')}\n`;
}

function Swatch({ role, hex }) {
  return (
    <span className="ar-color">
      <span className="ar-swatch" style={ { background: hex } } aria-hidden="true" />
      <span className="ar-color-text"><code>{ role }</code><span className="ar-hex">{ hex }</span></span>
    </span>
  );
}

const LEVEL_TONE = { AAA: 'success', AA: 'success', 'AA large': 'warning', Fail: 'danger' };

const COLUMNS = [
  { title: 'Foreground', 'data-label': 'Foreground', dataKey: 'token', render: (token, k, r) => <Swatch role={ token } hex={ r.fg } /> },
  { title: 'Background', 'data-label': 'Background', dataKey: 'against', render: (against, k, r) => <Swatch role={ against } hex={ r.bg } /> },
  { title: 'Ratio', 'data-label': 'Ratio', dataKey: 'ratio', render: (ratio, k, r) => <span className="ar-num">{ formatRatio(ratio, r.min) }:1</span> },
  {
    title: 'Required',
    'data-label': 'Required',
    dataKey: 'min',
    render: (min, k, r) => (
      <span className="ar-required">
        <span className="ar-num">{ min }:1</span>
        <span className="ar-sc">{ r.criterion }{ r.kind === 'text' && min < 4.5 ? ' (large text)' : '' }</span>
      </span>
    ),
  },
  { title: 'Highest level met', 'data-label': 'Highest level met', dataKey: 'level', render: (level) => <Tag tone={ LEVEL_TONE[level] }>{ level }</Tag> },
  { title: 'Result', 'data-label': 'Result', dataKey: 'pass', render: (pass) => <Tag tone={ pass ? 'success' : 'danger' }>{ pass ? 'Pass' : 'Fail' }</Tag> },
];

/** For procurement and accessibility teams: the contrast of every color pair in every theme. */
export default function AccessibilityReport() {
  const [filter, setFilter] = React.useState('all');
  const root = React.useRef(null);

  // Print in Apollo White whatever the site theme is: a dark page prints as
  // light text on white paper. The attribute nests a theme on this element only.
  React.useEffect(() => {
    const before = () => { if (root.current) root.current.setAttribute('data-theme', 'apollo-white'); };
    const after = () => { if (root.current) root.current.removeAttribute('data-theme'); };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => { window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', after); };
  }, []);

  const shown = filter === 'all' ? REPORT : REPORT.filter((t) => t.theme.id === filter);
  const day = CHECKED_AT.toISOString().slice(0, 10);

  return (
    <div className="dx-page ar" ref={ root }>
      <h1 className="dx-page-title">Accessibility report</h1>
      <p className="dx-lede">
        The color contrast of every text and control color pair in every NURVUS theme, measured with the WCAG 2.x
        formula. { REPORT.length } themes, { PAIRS } pairs each, { TOTAL } checks in all.
      </p>

      <div className="ar-scope">
        <Panel title="What this covers" padding="small">
          <ul className="ar-list">
            <li>Text against its background: <strong>SC 1.4.3 Contrast (Minimum)</strong>, 4.5:1, level AA.</li>
            <li>Controls and marks (input edges, button fills, the text cursor) against the page: <strong>SC 1.4.11 Non-text Contrast</strong>, 3:1, level AA.</li>
            <li>Text that reaches 7:1 is marked AAA (SC 1.4.6 Contrast (Enhanced)).</li>
            <li>The pairs are the ones the theme rules list (<code>src/themes/roles.json</code>), checked in every theme.</li>
          </ul>
        </Panel>
        <Panel title="What this does not cover" padding="small">
          <ul className="ar-list">
            <li>Keyboard use, screen readers, focus order and motion.</li>
            <li>Text on the other backgrounds (bg-alt, bg-deep, surface-hover, selection, accent-soft). The rules check text on bg and surface.</li>
            <li>Colors your app adds itself, images, and text over images.</li>
            <li>This is not a full VPAT or conformance report. It covers color contrast only.</li>
          </ul>
        </Panel>
      </div>

      <div className="ar-controls">
        <label className="ar-filter">
          <span>Theme</span>
          <select value={ filter } onChange={ (e) => setFilter(e.target.value) }>
            <option value="all">All themes</option>
            { themes.map((t) => <option key={ t.id } value={ t.id }>{ t.name }</option>) }
          </select>
        </label>
        <Button type="secondary" size="small" className="ar-csv" onClick={ () => downloadText(`nurvus-contrast-report-${day}.csv`, toCsv(), 'text/csv') }>
          Download CSV
        </Button>
        <Button type="secondary" size="small" className="ar-print" onClick={ () => window.print() }>
          Print / Save as PDF
        </Button>
      </div>

      <p className="ar-total" data-pass={ PASSED === TOTAL }>
        { PASSED === TOTAL ? `All ${TOTAL} checks pass` : `${PASSED} of ${TOTAL} checks pass, ${TOTAL - PASSED} fail` } in { REPORT.length } themes.
      </p>

      { shown.map(({ theme, rows, passed, lowest }) => (
        <section key={ theme.id } className="ar-theme" data-theme-id={ theme.id }>
          <h2 className="ar-h2">
            { theme.name }
            <Tag>{ theme.mode }</Tag>
            <Tag tone={ passed === rows.length ? 'success' : 'danger' }>{ passed } / { rows.length } pass</Tag>
          </h2>
          <p className="ar-summary">
            { passed } of { rows.length } checks pass. Lowest ratio: <strong>{ formatRatio(lowest.ratio, lowest.min) }:1</strong>,{ ' ' }
            <code>{ lowest.token }</code> on <code>{ lowest.against }</code> (needs { lowest.min }:1).
          </p>
          <div className="ar-scroll">
            <Table className="ar-table" columns={ COLUMNS } data={ rows } />
          </div>
        </section>
      )) }

      <section className="ar-method">
        <h2 className="ar-h2">How these numbers are made</h2>
        <ul className="ar-list">
          <li>
            The colors come from the theme files the package ships (<code>src/themes/*.json</code>). The ratios come from
            the same code the build runs (<code>checkTheme</code> in <code>tools/contrast.mjs</code>). The report can't drift
            from the package: change a theme and this page changes with it.
          </li>
          <li>
            The build checks every theme each time it runs (<code>npm run build:tokens</code>). A failing theme marked stable
            stops the build; a failing demo theme prints a warning.
          </li>
          <li>
            Contrast ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 of
            the darker one, as WCAG 2.x defines it. The colors are the exact #RRGGBB values in the files.
          </li>
          <li>
            Ratios are shown to 2 decimals. A ratio just under its minimum is rounded down, so it never reads as a pass.
          </li>
          <li>
            <code>text-subtle</code> is held to 3:1. WCAG accepts 3:1 for large text (at least 24px, or 18.66px bold) and
            sets no minimum for disabled controls. Placeholders and hints in normal-size text need 4.5:1, which
            text-subtle does not promise.
          </li>
        </ul>
        <p className="ar-date">
          { BUILT_AT && <>Built { when(BUILT_AT) }. </> }
          Checked { when(CHECKED_AT) }, when this page loaded.
        </p>
      </section>
    </div>
  );
}
