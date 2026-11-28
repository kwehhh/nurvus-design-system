import React from 'react';
import { Icon, ICON_NAMES, ICONS } from '@nurvus/ui';
import Example from '../examples/Example';
import { href } from '../router';
import './Guides.scss';
import './Icons.scss';

const SIZES = [
  { id: 'em', name: '1em', size: '1em' },
  { id: '16', name: '16', size: 16 },
  { id: '20', name: '20', size: 20 },
  { id: '24', name: '24', size: 24 },
];

const GROUPS = [
  ['Navigation', ['menu', 'close', 'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'external-link']],
  ['Actions', ['add', 'remove', 'edit', 'copy', 'delete', 'download', 'upload', 'search', 'filter', 'sliders', 'refresh', 'undo', 'redo']],
  ['Status', ['check', 'info', 'warning', 'error', 'help']],
  ['Things', ['file', 'folder', 'image', 'layers', 'eye', 'eye-off', 'lock', 'unlock', 'link']],
  ['Theme and code', ['sun', 'moon', 'code', 'terminal']],
];

const USE = `import { Icon } from '@nurvus/ui';

<Icon name="search" />                     // 1em: the size of the text around it
<Icon name="info" label="Information" />   // standing alone: say what it means
<Icon name="close" size={ 20 } />          // or a fixed size in pixels

// Respawn: the same icon as an <svg> element
import { Icon } from '@nurvus/ui/respawn';
document.body.append(Icon({ name: 'check' }));`;

/** The 24-unit grid: the artboard, the 2-unit padding, the keylines, an icon on top. */
function GridPlate({ name }) {
  const lines = Array.from({ length: 25 }, (_, i) => i);
  return (
    <svg className="ic-plate" viewBox="-1 -1 26 26" role="img" aria-label={ `The ${name} icon on the 24-unit grid` }>
      { lines.map((i) => <line key={ `v${i}` } x1={ i } y1="0" x2={ i } y2="24" className="ic-grid-line" />) }
      { lines.map((i) => <line key={ `h${i}` } x1="0" y1={ i } x2="24" y2={ i } className="ic-grid-line" />) }
      <rect x="2" y="2" width="20" height="20" className="ic-keyline" />
      <circle cx="12" cy="12" r="10" className="ic-keyline" />
      <rect x="3" y="3" width="18" height="18" rx="2" className="ic-keyline ic-keyline-soft" />
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ic-plate-icon">
        { ICONS[name].map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs })) }
      </g>
    </svg>
  );
}

/** The icon set: how sizing in em works, the grid, every icon (click to copy). */
export default function Icons() {
  const [query, setQuery] = React.useState('');
  const [size, setSize] = React.useState('24');
  const [copied, setCopied] = React.useState('');
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const q = query.trim().toLowerCase();
  const chosen = SIZES.find((s) => s.id === size);
  const copy = (name) => {
    const code = `<Icon name="${name}" />`;
    if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
    setCopied(name);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="dx-page gd ic">
      <h1 className="dx-page-title">Icons</h1>
      <p className="dx-lede">
        { ICON_NAMES.length } icons drawn for NURVUS: one grid, one line weight, the text's color. No icon font, no
        outside set, nothing to license.
      </p>

      <h2 className="gd-h2">Sized in em</h2>
      <p className="gd-p">
        An icon is <code>1em</code> by default: as tall as the text it sits in. Beside body text it is 16 pixels, in a
        title 22, in a caption 14, and when someone makes their text bigger, the icons grow with it. It takes the
        text's color too (<code>currentColor</code>), so it follows every theme.
      </p>
      <div className="ic-scale">
        <span className="ic-caption"><Icon name="check" /> Caption, 14px</span>
        <span className="ic-body"><Icon name="check" /> Body, 16px</span>
        <span className="ic-title"><Icon name="check" /> Title, 22px</span>
        <span className="ic-display"><Icon name="check" /> 32px</span>
      </div>
      <p className="gd-p">
        An icon on its own (in a button with no words) reads better a little bigger: <code>size=&quot;1.25em&quot;</code>.
        Give it a <code>label</code> then, so screen readers can say what it does.
      </p>

      <h2 className="gd-h2">The grid</h2>
      <div className="ic-grid-row">
        <GridPlate name="layers" />
        <ul className="gd-list">
          <li><strong>24 by 24 units</strong>, with 2 units of room on every side: the live area is 20 by 20 (pink).</li>
          <li><strong>Lines 2 units wide</strong>, round ends and corners. At 1em beside 16px text a line is 1.3 pixels.</li>
          <li><strong>Keylines</strong> keep different shapes the same visual size: a circle of radius 10, a square of 18 with corners of 2.</li>
          <li><strong>Corners</strong> of radius 2; circles inside icons have radius 9.</li>
          <li>Shapes are lines, not fills, so every icon has the same weight beside text.</li>
        </ul>
      </div>

      <h2 className="gd-h2">Every icon</h2>
      <div className="ic-tools">
        <label className="ic-search">
          <Icon name="search" />
          <input type="search" placeholder="Find an icon" aria-label="Find an icon" value={ query } onChange={ (e) => setQuery(e.target.value) } />
        </label>
        <div className="dx-switch" role="group" aria-label="Icon size">
          { SIZES.map((s) => <button key={ s.id } type="button" aria-pressed={ size === s.id } onClick={ () => setSize(s.id) }>{ s.name }</button>) }
        </div>
      </div>
      <p className="gd-note">Click an icon to copy its code.</p>
      { GROUPS.map(([group, names]) => {
        const shown = names.filter((n) => !q || n.includes(q));
        if (!shown.length) return null;
        return (
          <section key={ group } className="ic-group">
            <h3 className="gd-h3">{ group }</h3>
            <ul className="ic-gallery">
              { shown.map((name) => (
                <li key={ name }>
                  <button type="button" className="ic-tile" data-icon-tile={ name } onClick={ () => copy(name) } aria-label={ `${name}: copy <Icon name="${name}" />` }>
                    <span className="ic-tile-icon"><Icon name={ name } size={ chosen.size } /></span>
                    <span className="ic-tile-name">{ copied === name ? 'Copied' : name }</span>
                  </button>
                </li>
              )) }
            </ul>
          </section>
        );
      }) }
      { q && !ICON_NAMES.some((n) => n.includes(q)) && <p className="gd-note">No icon called “{ query }” yet.</p> }

      <h2 className="gd-h2">Using them</h2>
      <Example owner="Guide" code={ USE } mode="static" />
      <p className="gd-note">
        The props: <a href={ href('Components', 'Icon') }>Icon</a>. The names are typed (<code>IconName</code>), so an
        editor lists them and catches a typo.
      </p>
    </div>
  );
}
