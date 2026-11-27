import React from 'react';
import { Panel, Tag } from '@nurvus/ui';
// The real Tag files, read at build time, so this guide never drifts from them.
import tagJsx from '../../../src/components/Tag/Tag.jsx?raw';
import tagScss from '../../../src/components/Tag/Tag.scss?raw';
import tagMd from '../../../src/components/Tag/Tag.md?raw';
import CodeEditor from '../examples/CodeEditor';
import { href } from '../router';
import './AddComponent.scss';

// Each file in a component folder, and the part of its page it becomes.
const MAP = [
  { file: 'Tag.jsx', from: 'the docblock above the function', to: 'the description under the page title' },
  { file: 'Tag.jsx', from: 'propTypes, with a comment on each', to: 'the Props table: type, default, required, description' },
  { file: 'Tag.jsx', from: 'defaults in the parameter list', to: 'the Default column' },
  { file: 'Tag.md', from: 'each ```jsx block', to: 'a live example you can edit' },
  { file: 'Tag.scss', from: 'styles that use theme roles only', to: 'a component that fits every theme' },
  { file: 'src/index.js', from: 'export { default as Tag } …', to: 'the npm package, and in scope in every example' },
];

const STEPS = [
  {
    title: 'Make the folder',
    body: <>One folder per component under <code>src/components/</code>, with three files named after it. The names must match the folder: that is how this site finds it.</>,
  },
  {
    title: 'Write the component',
    body: <>A function component with a docblock above it, its defaults in the parameter list, and <code>propTypes</code> with a comment on every prop. Pass the rest of the props through to the root element.</>,
  },
  {
    title: 'Style it with theme roles',
    body: <>Use <code>var(--nv-surface)</code>, <code>var(--nv-text-muted)</code>, <code>var(--nv-accent)</code> and the other roles, never a hex value. Then every theme fits it without any extra work.</>,
  },
  {
    title: 'Write the examples',
    body: <>In <code>Tag.md</code>: text in Markdown, examples in <code>```jsx</code> blocks. The last JSX in a block renders. Add <code>noeditor</code> after <code>jsx</code> to hide the code, or <code>static</code> to show code only.</>,
  },
  {
    title: 'Export it',
    body: <>Add one line to <code>src/index.js</code>. That puts it in the npm package and in scope in every example on this site.</>,
  },
  {
    title: 'See it, then ship it',
    body: <><code>npm run docs</code> opens this site at <code>localhost:6061</code>; the new page is in the sidebar and reloads as you save. A push to <code>main</code> redeploys this site, and publishes the next alpha to npm when the package changed.</>,
  },
];

// The tree: [branch drawing, name, class, note]. Notes line up in one column.
const TREE = [
  ['', 'nurvus-design-system/', 'ac-dim'],
  ['├─ ', 'src/', 'ac-dim'],
  ['│  ├─ ', 'components/', 'ac-dim'],
  ['│  │  ├─ ', 'Button/ … Text/', 'ac-dim'],
  ['│  │  └─ ', 'Tag/', 'ac-new', 'one folder per component'],
  ['│  │     ├─ ', 'Tag.jsx', 'ac-jsx', 'the component + PropTypes'],
  ['│  │     ├─ ', 'Tag.scss', 'ac-scss', 'styles, theme roles only'],
  ['│  │     └─ ', 'Tag.md', 'ac-md', 'examples, live on this site'],
  ['│  ├─ ', 'themes/*.json', 'ac-dim', 'the theme colors'],
  ['│  └─ ', 'index.js', 'ac-index', 'add one export line'],
  ['└─ ', 'docs/', 'ac-dim', 'this site: no change needed'],
];
const NOTE_COLUMN = 26;

function FileTree() {
  return (
    <pre className="ac-tree" aria-label="Files for a new component">
      { TREE.map(([branch, name, kind, note], i) => (
        <React.Fragment key={ name }>
          { branch }<span className={ kind }>{ name }</span>
          { note && <>{ ' '.repeat(Math.max(2, NOTE_COLUMN - branch.length - name.length)) }<span className="ac-note">{ note }</span></> }
          { i < TREE.length - 1 && '\n' }
        </React.Fragment>
      )) }
    </pre>
  );
}

/** How to add a component: the files, what each becomes, and a real one (Tag). */
export default function AddComponent() {
  return (
    <div className="dx-page ac">
      <h1 className="dx-page-title">Add a component</h1>
      <p className="dx-lede">
        A component is one folder with three files. This site finds it on its own: the API table comes from the code,
        and the examples come from a Markdown file. <a href={ href('Components', 'Tag') }>Tag</a> was added exactly this way,
        so it is the example below.
      </p>

      <div className="ac-visual">
        <Panel title="The files" padding="small">
          <FileTree />
        </Panel>
        <Panel title="What each part becomes" padding="small">
          <ul className="ac-map">
            { MAP.map((m) => (
              <li key={ m.from }>
                <Tag tone={ m.file.endsWith('.md') ? 'success' : m.file.endsWith('.scss') ? 'warning' : m.file.includes('index') ? 'info' : 'accent' }>{ m.file }</Tag>
                <span className="ac-from">{ m.from }</span>
                <span className="ac-arrow" aria-hidden="true">→</span>
                <span className="ac-to">{ m.to }</span>
              </li>
            )) }
          </ul>
        </Panel>
      </div>

      <h2 className="ac-h2">Steps</h2>
      <ol className="ac-steps">
        { STEPS.map((s) => (
          <li key={ s.title }>
            <h3>{ s.title }</h3>
            <p>{ s.body }</p>
          </li>
        )) }
      </ol>

      <h2 className="ac-h2">The real files: Tag</h2>
      <p className="dx-lede">Read straight from the repository when this site is built.</p>
      <h3 className="ac-file"><code>src/components/Tag/Tag.jsx</code></h3>
      <div className="dx-example"><CodeEditor value={ tagJsx } readOnly label="Tag.jsx" /></div>
      <h3 className="ac-file"><code>src/components/Tag/Tag.scss</code></h3>
      <div className="dx-example"><CodeEditor value={ tagScss } readOnly lang="text" label="Tag.scss" /></div>
      <h3 className="ac-file"><code>src/components/Tag/Tag.md</code></h3>
      <div className="dx-example"><CodeEditor value={ tagMd } readOnly lang="text" label="Tag.md" /></div>
      <h3 className="ac-file"><code>src/index.js</code> (the one line)</h3>
      <div className="dx-example"><CodeEditor value={ "export { default as Tag } from './components/Tag/Tag.jsx';" } readOnly label="index.js line" /></div>

      <h2 className="ac-h2">Before you push</h2>
      <ul className="ac-checklist">
        <li>Every prop has a PropType and a one-line comment.</li>
        <li>No hex colors in the <code>.scss</code>: theme roles only. Check it in a light and a dark theme.</li>
        <li>One example per variant, so each shows up on the page.</li>
        <li><code>npm run build</code> passes. It also re-checks every theme's contrast.</li>
      </ul>
    </div>
  );
}
