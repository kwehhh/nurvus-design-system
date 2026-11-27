import React from 'react';
import { Button, Layout, Panel, Table, Tag, Text, Title, themes, setTheme, themeRoles } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import Example from '../examples/Example';
import { href } from '../router';
import './Home.scss';

const INSTALL = 'npm install @nurvus/ui';

// The live sample in the hero: a small product screen built only from
// @nurvus/ui components, in whichever theme the site is in.
const DEPLOYS = [
  { service: 'Checkout API', region: 'us-east-1', status: 'success', label: 'Live' },
  { service: 'Search', region: 'eu-west-2', status: 'warning', label: 'Degraded' },
  { service: 'Billing jobs', region: 'us-west-2', status: 'info', label: 'Deploying' },
];

function HeroSample() {
  const columns = [
    { dataKey: 'service', title: 'Service' },
    { dataKey: 'region', title: 'Region', render: (value) => <code>{ value }</code> },
    { dataKey: 'label', title: 'Status', render: (value, key, row) => <Tag tone={ row.status }>{ value }</Tag> },
  ];
  return (
    <Panel title="Deployments" caption="Every color here is a theme token. Switch the theme at the top right.">
      <Table columns={ columns } data={ DEPLOYS } />
      <Layout display="flex" alignItems="center" itemSpacing={ 10 } className="hm-sample-actions">
        <Button type="primary" size="small">Deploy</Button>
        <Button type="secondary" size="small">View logs</Button>
      </Layout>
    </Panel>
  );
}

function InstallLine() {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(INSTALL).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };
  return (
    <div className="hm-install">
      <code><span aria-hidden="true">$ </span>{ INSTALL }</code>
      <button type="button" className="hm-install-copy" onClick={ copy }>{ copied ? 'Copied' : 'Copy' }</button>
    </div>
  );
}

/** One theme, drawn in itself: the same components in its own colors. */
function ThemeTile({ theme }) {
  return (
    <div className="hm-theme" data-theme={ theme.id }>
      <Layout itemSpacing={ 10 }>
        <Layout display="flex" alignItems="center" justifyContent="space-between">
          <Title level={ 4 }>{ theme.name }</Title>
          <Tag tone={ theme.mode === 'dark' ? 'accent' : 'neutral' }>{ theme.mode }</Tag>
        </Layout>
        <Text as="p" variant="caption" tone="muted">{ theme.keywords }</Text>
        <Layout display="flex" alignItems="center" itemSpacing={ 10 }>
          <Button type="primary" size="mini" onClick={ () => setTheme(theme.id) }>Use this theme</Button>
          <a className="hm-theme-link" href={ href('Themes', theme.name) }>Details</a>
        </Layout>
      </Layout>
    </div>
  );
}

const ROLE_COUNT = Object.keys(themeRoles).length;

const STEPS = [
  {
    n: 1,
    name: 'Tokens',
    text: `Each theme is one JSON file with the same ${ROLE_COUNT} roles: background, text, accent, status and code colors.`,
    code: '"accent": "#245CC7"',
  },
  {
    n: 2,
    name: 'Build',
    text: 'The build turns every theme into CSS variables and checks each text color against its background for WCAG contrast.',
    code: '[data-theme="tokyo-neon"] { … }',
  },
  {
    n: 3,
    name: 'Components',
    text: 'Components only ever read roles, never hex values, so every theme fits every component.',
    code: 'color: var(--nv-text);',
  },
  {
    n: 4,
    name: 'Your app',
    text: 'One call switches the whole product and remembers the choice. Themes can nest, too.',
    code: "setTheme('apollo-white');",
  },
];

const STACK = [
  { name: 'React 16.8+', text: 'Function components and hooks. React and ReactDOM are peer dependencies, so you bring your own.' },
  { name: 'CSS custom properties', text: 'The themes are plain CSS variables, so the colors work in any stack: Vue, Svelte, Rails or static HTML.' },
  { name: 'Sass', text: 'Component styles are written in Sass and compiled into the package. Nothing extra to set up.' },
  { name: 'PropTypes and docblocks', text: 'Every prop is typed and described in the code. The API tables on this site are generated from them.' },
  { name: 'npm with provenance', text: 'Each change on main is published from GitHub Actions through npm Trusted Publishing, with provenance: no tokens, no hand-made builds.' },
  { name: '≈ 18 KB gzipped', text: 'The whole library with its styles and themes, React not included.' },
];

const why = (light, dark) => [
  { name: 'Accessible color, checked at build', text: 'A theme marked stable cannot ship with a text color that fails WCAG contrast. The build stops.' },
  { name: 'Your brand in one file', text: 'A new theme is one JSON file of roles. Every component, page and code sample follows it.' },
  { name: 'Light and dark, both first class', text: `${light} light and ${dark} dark themes ship today. Set one per page, or nest a dark panel inside a light page.` },
  { name: 'Documented as it is built', text: 'Each component has editable live examples and an API table taken straight from its code.' },
];

const TRY = `<Panel title="Try it" caption="Edit the code below. The preview updates as you type.">
  <Layout display="flex" alignItems="center" justifyContent="space-between">
    <Text>Quarterly report</Text>
    <Tag tone="success">Approved</Tag>
  </Layout>
</Panel>`;

const QUICK_START = `import { Button, Panel, initTheme } from '@nurvus/ui';

// At startup: the visitor's saved theme, or this default.
initTheme('apollo-white');

export default function Settings() {
  return (
    <Panel title="Settings">
      <Button type="primary">Save changes</Button>
    </Panel>
  );
}`;

/** The front page: what NURVUS UI is, how theming works, and where to start. */
export default function Home() {
  const light = themes.filter((t) => t.mode === 'light').length;
  const dark = themes.length - light;
  return (
    <div className="dx-page hm">
      <section className="hm-hero">
        <div className="hm-hero-copy">
          <Layout display="flex" alignItems="center" itemSpacing={ 10 } className="hm-badges">
            <Tag tone="accent">React</Tag>
            <Tag>v0.1 alpha</Tag>
            <Tag>MIT</Tag>
          </Layout>
          <h1 className="hm-title">Build the interface once. Ship it in every theme.</h1>
          <p className="hm-lede">
            NURVUS UI is a React component library where every color is a theme token.
            { ` ${themes.length} themes` } ship in the box, each checked for contrast before it builds,
            and one call switches your whole product between them.
          </p>
          <div className="hm-actions">
            <a className="hm-cta hm-cta-primary" href={ href('Components') }>Browse components</a>
            <a className="hm-cta" href={ href('Themes') }>See the themes</a>
          </div>
          <InstallLine />
        </div>
        <div className="hm-hero-sample">
          <HeroSample />
        </div>
      </section>

      <dl className="hm-stats">
        <div><dt>Components</dt><dd>{ components.length }</dd></div>
        <div><dt>Themes</dt><dd>{ themes.length }<span> ({ light } light, { dark } dark)</span></dd></div>
        <div><dt>Roles per theme</dt><dd>{ ROLE_COUNT }</dd></div>
        <div><dt>Contrast</dt><dd>WCAG<span> checked at build</span></dd></div>
      </dl>

      <section className="hm-section">
        <h2 className="hm-h2">Same components. Every theme.</h2>
        <p className="dx-lede">
          Each tile below is the same handful of components, drawn in its own theme. Pick one to switch the whole site.
        </p>
        <div className="hm-themes">
          { themes.map((t) => <ThemeTile key={ t.id } theme={ t } />) }
        </div>
      </section>

      <section className="hm-section">
        <h2 className="hm-h2">How it works</h2>
        <ol className="hm-flow">
          { STEPS.map((s) => (
            <li key={ s.n } className="hm-step">
              <span className="hm-step-n" aria-hidden="true">{ s.n }</span>
              <h3>{ s.name }</h3>
              <p>{ s.text }</p>
              <code>{ s.code }</code>
            </li>
          )) }
        </ol>
      </section>

      <section className="hm-section">
        <h2 className="hm-h2">Why teams choose it</h2>
        <div className="hm-grid hm-grid-2">
          { why(light, dark).map((w) => (
            <Panel key={ w.name } title={ w.name }>
              <Text as="p" tone="muted">{ w.text }</Text>
            </Panel>
          )) }
        </div>
      </section>

      <section className="hm-section">
        <h2 className="hm-h2">Try it</h2>
        <p className="dx-lede">
          Every example on this site is live code. Every @nurvus/ui component is in scope, so there is nothing to import.
        </p>
        <Example owner="Home" code={ TRY } />
      </section>

      <section className="hm-section">
        <h2 className="hm-h2">Built with, built for</h2>
        <div className="hm-grid hm-grid-3">
          { STACK.map((s) => (
            <div key={ s.name } className="hm-stack">
              <h3>{ s.name }</h3>
              <p>{ s.text }</p>
            </div>
          )) }
        </div>
      </section>

      <section className="hm-section">
        <h2 className="hm-h2">Quick start</h2>
        <Example owner="Home" code={ QUICK_START } mode="static" />
        <p className="dx-lede">
          Building the library itself? <a href={ href('Guides', 'Add a component') }>Add a component</a> shows the
          three files a component needs and how this site picks them up.
        </p>
      </section>
    </div>
  );
}
