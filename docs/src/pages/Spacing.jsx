import React from 'react';
import Example from '../examples/Example';
import './Guides.scss';

// What each step is for. The values themselves are read from the live CSS.
const SPACE = [
  { n: 0, use: 'No space: items that touch.' },
  { n: 2, use: 'The one half-step: hairlines, accent bars, nudging an icon into line.' },
  { n: 4, use: 'Tight: an icon and its label, a tag\'s inner padding.' },
  { n: 8, use: 'The default gap between related items: buttons in a row, a label and its field.' },
  { n: 12, use: 'Control padding, the gap between rows of a list.' },
  { n: 16, use: 'Card padding, the gap between groups.' },
  { n: 24, use: 'Between blocks inside a page section.' },
  { n: 32, use: 'Between page sections.' },
  { n: 48, use: 'Large section breaks.' },
  { n: 64, use: 'Hero and page-level whitespace.' },
];

const RADIUS = [
  { id: '2', use: 'Bars, small marks' },
  { id: '4', use: 'Inputs inside dense UI' },
  { id: '8', use: 'Buttons, fields, menus' },
  { id: '12', use: 'Cards, panels, tables' },
  { id: 'full', use: 'Pills: tags, avatars' },
];

const CODE = `.card {
  padding: var(--space--16);
  border-radius: var(--radius--12);
}
.card > * + * { margin-top: var(--space--8); }

/* In the package's own SCSS the same tokens are $--space--16, $--radius--12. */`;

/** The value of a CSS custom property on <html>, e.g. "8px". */
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Foundations: the spacing scale and the corner radii, drawn from the real tokens. */
export default function Spacing() {
  return (
    <div className="dx-page gd">
      <h1 className="dx-page-title">Spacing</h1>
      <p className="dx-lede">
        One scale for every gap, margin and padding: a <strong>4px base</strong> with an <strong>8px rhythm</strong>,
        plus one 2px half-step. Spacing is the same in every theme. In rem (1rem = 16px, the browser default) the steps are 0.25rem apart.
      </p>

      <h2 className="gd-h2">The scale</h2>
      <table className="gd-scale">
        <thead>
          <tr><th>Token</th><th>Value</th><th>rem</th><th aria-label="Size" /><th>Use it for</th></tr>
        </thead>
        <tbody>
          { SPACE.map(({ n, use }) => {
            const value = cssVar(`--space--${n}`) || `${n}px`;
            return (
              <tr key={ n }>
                <td><code>--space--{ n }</code></td>
                <td className="gd-value">{ value }</td>
                <td className="gd-value">{ n ? `${n / 16}rem` : '0' }</td>
                <td><span className="gd-bar" style={ { width: `var(--space--${n})` } } /></td>
                <td className="gd-use">{ use }</td>
              </tr>
            );
          }) }
        </tbody>
      </table>

      <h2 className="gd-h2">Why 4 and 8</h2>
      <ul className="gd-list">
        <li><strong>Fewer decisions.</strong> Ten steps instead of any number: no more "is this 14 or 15?".</li>
        <li><strong>It divides cleanly.</strong> 8 halves to 4 and 2, always whole pixels. A 10px scale halves to 5 and 2.5.</li>
        <li><strong>Sharp on every screen.</strong> At 1.5× a 4px step is 6px; a 5px step would be a blurry 7.5px.</li>
        <li><strong>What teams already know.</strong> Material (8dp), GitHub Primer, IBM Carbon, Shopify Polaris and Tailwind all use the 4px family.</li>
      </ul>

      <h2 className="gd-h2">Corners</h2>
      <div className="gd-radii">
        { RADIUS.map(({ id, use }) => (
          <figure key={ id } className="gd-radius">
            <span className="gd-shape" style={ { borderRadius: `var(--radius--${id})` } } />
            <figcaption><code>--radius--{ id }</code><span>{ cssVar(`--radius--${id}`) }</span><span>{ use }</span></figcaption>
          </figure>
        )) }
      </div>

      <h2 className="gd-h2">Type is the exception</h2>
      <p className="gd-p">
        Font sizes follow a type scale, so some are off the grid (13px, for one), and that is right. Line heights are
        what land on the grid, so blocks of text still stack on it.
      </p>

      <h2 className="gd-h2">Using it</h2>
      <Example owner="Guide" code={ CODE } mode="static" lang="text" />
      <p className="gd-note">
        <code>Layout</code>'s <code>itemSpacing</code> takes these steps too. Its old values (10, 13, 20, 30, 40) still work:
        each snaps to the nearest step (ties go down: 20 → 16, 40 → 32) with a console warning that names the step to use.
      </p>
    </div>
  );
}
