import React from 'react';
import ReactDOM from 'react-dom';
import * as NurvusReact from '@nurvus/ui';
import * as NurvusRespawn from '@nurvus/ui/respawn';
import Example from '../examples/Example';
import { href } from '../router';
import './Guides.scss';
import './RespawnGuide.scss';

// For the Playwright parity probe (.ai-assist/tools/nurvus-themes-playwright/probeRespawn.js):
// with ?probe in the address, both versions of the components are on window so
// it can render the React and the Respawn one with the same props.
if (typeof window !== 'undefined' && /[?&]probe\b/.test(window.location.search)) {
  window.__nurvusProbe = { React, ReactDOM, ui: NurvusReact, respawn: NurvusRespawn };
}

const INSTALL = `// npm install @nurvus/ui
import { Button, setTheme } from '@nurvus/ui/respawn';
import '@nurvus/ui/themes/tokyo-neon.css'; // only for a theme other than Apollo White

document.body.append(Button({ children: 'Hello, world!' }));
setTheme('tokyo-neon');`;

const SCRIPT = `<!-- dist/respawn.js from the @nurvus/ui package, served by your site -->
<script src="/js/respawn.js"></script>
<script>
  const { Button } = window.nurvusRespawn;
  document.body.append(Button({ children: 'Hello, world!' }));
</script>`;

const CSS_FILES = `// With a bundler
import '@nurvus/ui/nurvus.css';            // every component, and Apollo White
import '@nurvus/ui/themes/tokyo-neon.css'; // one more theme (themes/all.css has them all)`;

const CSS_LINKS = `<!-- Or in HTML: the same files, from dist/ in the package -->
<link rel="stylesheet" href="/css/nurvus.css">
<link rel="stylesheet" href="/css/themes/tokyo-neon.css">`;

const WITH_RESPAWN = `import Spawn, { Mount, Respawn } from '@nurvus/respawn';
import { Button, Panel, Tag } from '@nurvus/ui/respawn';

let status = Tag({ tone: 'neutral', children: 'Draft' });

const app = Spawn({
  className: 'app',
  children: [
    Panel({ title: 'Release', children: status }),
    Button({
      children: 'Publish',
      events: {
        click: () => {
          // Respawn's way to change the page: build a new element and swap it in.
          status = Respawn(status, Tag({ tone: 'success', children: 'Published' }));
        },
      },
    }),
  ],
});

Mount(document.body, app);`;

const UPDATE = `let bar = Progress({ percent: 20 });
app.append(bar);

bar = bar.update({ percent: 60 }); // the same as Respawn(bar, Progress({ percent: 60 }))
bar = bar.update({ percent: 100, status: 'success' });`;

// Each demo's code is what runs: the import line names what it uses, and
// `app` is the element it renders into.
export const DEMOS = [
  {
    name: 'Button',
    about: 'A <button>. onClick, disabled and any other attribute go on it.',
    code: `import { Button, Layout, Text } from '@nurvus/ui/respawn';

const note = Text({ variant: 'caption', tone: 'muted', children: 'Not saved yet' });

app.append(Layout({
  itemSpacing: 12,
  children: [
    Layout({
      display: 'flex',
      itemSpacing: 8,
      children: [
        Button({ children: 'Save', onClick: () => { note.textContent = 'Saved'; } }),
        Button({ type: 'secondary', children: 'Cancel' }),
        Button({ size: 'small', disabled: true, children: 'Disabled' }),
      ],
    }),
    note,
  ],
}));`,
  },
  {
    name: 'ButtonGroup',
    about: 'Joins Buttons into one row.',
    code: `import { Button, ButtonGroup } from '@nurvus/ui/respawn';

app.append(ButtonGroup({
  children: [
    Button({ type: 'secondary', children: 'Day' }),
    Button({ type: 'secondary', children: 'Week' }),
    Button({ type: 'secondary', children: 'Month' }),
  ],
}));`,
  },
  {
    name: 'FullPageModal',
    about: 'Covers the whole screen. Mount it on document.body; update({ visible }) opens and closes it.',
    code: `import { Button, FullPageModal, Panel } from '@nurvus/ui/respawn';

const modal = FullPageModal({
  title: 'Settings',
  mountEl: document.body,
  headerActions: Button({
    size: 'small',
    children: 'Close',
    onClick: () => modal.update({ visible: false }),
  }),
  children: Panel({ style: { margin: 16 }, children: 'The modal covers the page.' }),
});

app.append(Button({ children: 'Open the modal', onClick: () => modal.update({ visible: true }) }));`,
  },
  {
    name: 'HistoryList',
    about: 'Undo history, newest first. The app owns the history: a click calls onJump, and the app moves the current step.',
    code: `import { HistoryList } from '@nurvus/ui/respawn';

const now = Date.now();
const steps = [
  { id: 1, label: 'Hide layer', detail: 'triforce', time: now - 9000 },
  { id: 2, label: 'Delete layer', detail: 'zelda_dark_shadow', time: now - 6000 },
  { id: 3, label: 'Rename layer', detail: 'cloud', time: now - 3000 },
  { id: 4, label: 'Edit class', detail: '.me404', time: now },
];

let list = HistoryList({
  steps,
  index: steps.length,
  onJump: (step) => { list = list.update({ index: step }); },
});

app.append(list);`,
  },
  {
    name: 'Layout',
    about: 'Puts its children in a column or a row, with space from the 4px grid between them.',
    code: `import { Layout, Tag } from '@nurvus/ui/respawn';

app.append(Layout({
  itemSpacing: 12,
  children: [
    Layout({
      display: 'flex',
      itemSpacing: 8,
      children: [Tag({ children: 'A' }), Tag({ children: 'row' }), Tag({ children: 'of tags' })],
    }),
    Layout({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      itemSpacing: 4,
      children: [Tag({ tone: 'accent', children: 'A column' }), Tag({ tone: 'accent', children: 'of tags' })],
    }),
  ],
}));`,
  },
  {
    name: 'Link',
    about: 'An <a>. href, target and any other attribute go on it.',
    code: `import { Link } from '@nurvus/ui/respawn';

app.append(Link({ href: '#/Components/Link', children: 'The React Link' }));`,
  },
  {
    name: 'Menu',
    about: 'Nested rows, like a layers panel. A click marks the row active and calls onClick with its path.',
    code: `import { Menu, Text } from '@nurvus/ui/respawn';

const status = Text({ variant: 'caption', tone: 'muted', children: 'Click a row' });

const menu = Menu({
  activePath: [0, 0],
  items: [
    { label: 'Header', items: [{ label: 'Logo' }, { label: 'Navigation' }] },
    { label: 'Content', items: [{ label: 'Hero', items: [{ label: 'Title' }] }] },
    { label: 'Footer' },
  ],
  onClick: (event, path) => { status.textContent = \`Clicked row [\${path.join(', ')}]\`; },
});

app.append(menu, status);`,
  },
  {
    name: 'NavList',
    about: 'Site navigation: sections that open and close, the current page marked. A toggle opens or closes its section in place.',
    code: `import { NavList, Text } from '@nurvus/ui/respawn';

const status = Text({ variant: 'caption', tone: 'muted', children: 'Click a link or a chevron' });

app.append(NavList({
  id: 'respawn-demo-nav',
  current: '#/billing',
  onNavigate: (href, event) => { event.preventDefault(); status.textContent = 'Go to ' + href; },
  onToggle: (id, open) => { status.textContent = id + (open ? ' opened' : ' closed'); },
  sections: [
    { title: 'Account', href: '#/account', items: [
      { label: 'Profile', href: '#/profile' },
      { label: 'Security', href: '#/security' },
    ] },
    { title: 'Settings', items: [
      { label: 'General', href: '#/general' },
      { label: 'Billing', href: '#/billing' },
    ] },
  ],
}), status);`,
  },
  {
    name: 'Panel',
    about: 'A card with an optional title and caption.',
    code: `import { Panel, Text } from '@nurvus/ui/respawn';

app.append(Panel({
  title: 'Deployments',
  caption: 'Updated a minute ago',
  children: Text({ as: 'p', variant: 'body', tone: 'muted', children: 'Three services are live.' }),
}));`,
  },
  {
    name: 'Progress',
    about: 'A progress bar. Each click builds a new bar with update().',
    code: `import { Button, Layout, Progress } from '@nurvus/ui/respawn';

let percent = 30;
let bar = Progress({ percent });

const add = Button({
  type: 'secondary',
  size: 'small',
  children: 'Add 10%',
  onClick: () => {
    percent = percent >= 100 ? 0 : percent + 10;
    bar = bar.update({ percent, status: percent === 100 ? 'success' : 'active' });
  },
});

app.append(Layout({ itemSpacing: 12, children: [bar, add] }));`,
  },
  {
    name: 'Table',
    about: 'A data table. A column\'s render can return text, an element or a component.',
    code: `import { Table, Tag } from '@nurvus/ui/respawn';

app.append(Table({
  columns: [
    { dataKey: 'name', title: 'Service' },
    { dataKey: 'region', title: 'Region' },
    {
      dataKey: 'status',
      title: 'Status',
      render: (value) => Tag({ tone: value === 'Live' ? 'success' : 'warning', children: value }),
    },
  ],
  data: [
    { name: 'api', region: 'eu-west', status: 'Live' },
    { name: 'web', region: 'us-east', status: 'Live' },
    { name: 'jobs', region: 'eu-west', status: 'Paused' },
  ],
}));`,
  },
  {
    name: 'Tag',
    about: 'A small label in one of six tones. spawn() builds the row they sit in.',
    code: `import { spawn, Tag } from '@nurvus/ui/respawn';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'];

app.append(spawn({
  style: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  children: tones.map((tone) => Tag({ tone, children: tone })),
}));`,
  },
  {
    name: 'Text',
    about: 'Text in one of the type roles: display, title, body, caption or mono.',
    code: `import { Layout, Text } from '@nurvus/ui/respawn';

app.append(Layout({
  itemSpacing: 8,
  children: [
    Text({ as: 'h3', variant: 'title', children: 'A section title' }),
    Text({ as: 'p', variant: 'body', children: 'Body text, for paragraphs.' }),
    Text({ as: 'p', variant: 'caption', tone: 'muted', children: 'A caption, in the muted tone.' }),
    Text({ variant: 'mono', children: 'npm install @nurvus/ui' }),
  ],
}));`,
  },
  {
    name: 'Title',
    about: 'A heading, <h1> to <h6>.',
    code: `import { Layout, Title } from '@nurvus/ui/respawn';

app.append(Layout({
  itemSpacing: 8,
  children: [
    Title({ level: 1, children: 'Heading 1' }),
    Title({ level: 3, children: 'Heading 3' }),
    Title({ level: 5, type: 'secondary', children: 'Heading 5, secondary' }),
  ],
}));`,
  },
];

export const RETURNS = {
  Button: '<button>', ButtonGroup: '<div>', FullPageModal: '<div class="portal">', HistoryList: '<ol>', Layout: '<div>', Link: '<a>',
  Menu: '<div>', NavList: '<nav>', Panel: '<section>', Progress: '<div>', Table: '<table>', Tag: '<span>', Text: '<span> (or as)', Title: '<h1> to <h6>',
};
export const NOTES = {
  FullPageModal: 'Mount it on document.body. update({ visible }) animates it in or out and keeps the same element.',
  HistoryList: 'A click calls onJump(step). Move the current step with update({ index }).',
  Menu: 'A click marks the row active (same element), then calls onClick(event, path).',
  NavList: 'A toggle opens or closes its section in place, then calls onToggle(id, open). update({ current }) marks another page.',
};

const IMPORT_RE = /^import\s[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm;

/** Runs a demo's code with the names its import line asks for, and `app`. */
function run(code, app) {
  const names = [];
  const body = code.replace(IMPORT_RE, (line) => {
    const list = line.match(/\{([^}]*)\}/);
    if (list) list[1].split(',').map((n) => n.trim()).filter(Boolean).forEach((n) => names.push(n));
    return '';
  });
  // eslint-disable-next-line no-new-func
  new Function('nurvus', 'app', `"use strict";\nconst { ${names.join(', ')} } = nurvus;\n${body}`)(NurvusRespawn, app);
}

/** One component: the Respawn version running in a box, then its code. */
export function Demo({ name, about, code, heading = true }) {
  const host = React.useRef(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const app = host.current;
    const before = new Set(document.body.children);
    try { run(code, app); } catch (e) { setError(e.message); }
    // The modal mounts itself on <body>: take it away with the page.
    const added = [...document.body.children].filter((el) => !before.has(el));
    return () => { app.replaceChildren(); added.forEach((el) => el.remove()); };
  }, [code]);
  return (
    <section className="rg-demo" data-demo={ name }>
      { heading && <h3 className="rg-h3"><a href={ href('Respawn', name) }>{ name }</a></h3> }
      <p>{ about }</p>
      <div className="rg-frame">
        <div className="rg-preview" ref={ host } />
        { error && <pre className="dx-example-error" role="alert">{ error }</pre> }
        <Example owner="Guide" code={ code } mode="static" />
      </div>
    </section>
  );
}

function Step({ n, title, children }) {
  return (
    <section className="gd-step">
      <h2 className="gd-h2"><span className="gd-n" aria-hidden="true">{ n }</span>{ title }</h2>
      { children }
    </section>
  );
}

/** For developers without React: the components as plain DOM, with Respawn or alone. */
export default function RespawnGuide() {
  const { Table: ApiTable } = NurvusReact;
  const columns = [
    { dataKey: 'name', title: 'Call', render: (value) => <code>{ value }(props)</code> },
    { dataKey: 'returns', title: 'Returns', render: (value) => <code>{ value }</code> },
    { dataKey: 'notes', title: 'Notes' },
  ];
  const api = DEMOS.map(({ name }) => ({ key: name, name, returns: RETURNS[name], notes: NOTES[name] || 'Rebuilt by update(changes).' }));
  return (
    <div className="dx-page gd rg">
      <h1 className="dx-page-title">Respawn</h1>
      <p className="dx-lede">
        The NURVUS components and themes as plain DOM elements, for Respawn or any page without React. Every React
        component has a Respawn version with the same props and the same markup; each one also has its own page in the
        Respawn section of the menu.
      </p>

      <Step n={ 1 } title="What it is">
        <p>
          Each component is a function. Give it the same props as the React component, and it returns a real element:
          {' '}<code>Button</code> returns a <code>&lt;button&gt;</code>, <code>Table</code> a <code>&lt;table&gt;</code>.
          You put the element on the page yourself. React is not needed.
        </p>
        <p>
          Respawn is a small DOM library. <code>Spawn</code> builds an element, <code>Mount</code> adds it to the page,
          and <code>Respawn</code> swaps one element for another. The components work with all three.
        </p>
      </Step>

      <Step n={ 2 } title="Install">
        <p>From npm. The import brings the styles and the default theme, Apollo White.</p>
        <Example owner="Guide" code={ INSTALL } mode="static" />
        <p>Without a build step, add the script. It puts the same functions on <code>window.nurvusRespawn</code>.</p>
        <Example owner="Guide" code={ SCRIPT } mode="static" />
        <p>
          The styles are also CSS files, for a page that links its CSS itself (for example, HTML made on a server with
          the same classes).
        </p>
        <Example owner="Guide" code={ CSS_FILES } mode="static" />
        <Example owner="Guide" code={ CSS_LINKS } mode="static" />
      </Step>

      <Step n={ 3 } title="With Respawn">
        <p>
          A component's element goes anywhere an element goes in Respawn: in the children of <code>Spawn</code>, and
          in <code>Mount</code> and <code>Respawn</code>.
        </p>
        <Example owner="Guide" code={ WITH_RESPAWN } mode="static" />
        <p>
          Props work as in <code>Spawn</code>: <code>events: {'{ click }'}</code> or <code>onClick</code> for
          listeners, a <code>style</code> object, and children as text, elements or nested props.
        </p>
      </Step>

      <Step n={ 4 } title="Change an element">
        <p>
          Respawn changes a page by building a new element and swapping it in. Each component's element can do this
          itself: <code>update(changes)</code> builds it again with your changes (the other props stay), swaps it in and
          returns the new element. Keep what it returns.
        </p>
        <Example owner="Guide" code={ UPDATE } mode="static" />
        <ul className="gd-list">
          <li><strong>Menu</strong> changes in place: a click marks that row active, then calls <code>onClick(event, path)</code>.</li>
          <li><strong>FullPageModal</strong> changes in place: <code>update({'{ visible: true }'})</code> animates it in, <code>false</code> animates it out and hides it.</li>
          <li><strong>HistoryList</strong> shows what you give it, like the React one. A click calls <code>onJump(step)</code>; you move the current step with <code>update({'{ index: step }'})</code>.</li>
        </ul>
      </Step>

      <h2 className="gd-h2">The components</h2>
      <p className="gd-p">
        Every example runs on this page. In each one, <code>app</code> is the element it renders into, such as
        {' '}<code>document.getElementById('app')</code>. The props are the same as in React: each name links to the
        component's page.
      </p>
      { DEMOS.map((demo) => <Demo key={ demo.name } { ...demo } />) }

      <h2 className="gd-h2">Same markup as React</h2>
      <p className="gd-p">
        Each function makes the same tags, classes, data attributes and text as its React component. So the same CSS
        styles both, every theme applies the same way, and both can be on one page.
      </p>
      <ul className="gd-list">
        <li><strong>FullPageModal</strong> returns its element for you to mount. React puts it into <code>&lt;body&gt;</code> itself.</li>
        <li><strong>HistoryList</strong> with no steps returns an empty, hidden list, so there is an element to update. React renders nothing.</li>
        <li><strong>Menu</strong> marks a clicked row active by itself. In React, the app sets <code>activePath</code>.</li>
      </ul>

      <h2 className="gd-h2">The API</h2>
      <p className="gd-p">
        Also exported: <code>spawn(props)</code>, which builds an element from the same props as Respawn&apos;s <code>Spawn</code>,
        and the theme API from <a href={ href('Themes', 'Applying a theme') }>Applying a theme</a> (<code>setTheme</code>,
        {' '}<code>initTheme</code>, <code>currentTheme</code>, <code>themes</code>…).
      </p>
      <div className="rg-scroll">
        <ApiTable className="gd-api rg-api" columns={ columns } data={ api } />
      </div>
    </div>
  );
}
