import React from 'react';
import Example from '../examples/Example';
import { href } from '../router';
import './Guides.scss';

const INSTALL = `npm install @nurvus/ui
# React 16.8 or newer, and the same React DOM, are its peers.`;

const FIRST = `import { Button, Layout, Panel, Tag, Text } from '@nurvus/ui';

<Panel title="Release 2.4">
  <Layout itemSpacing={ 12 }>
    <Layout display="flex" alignItems="center" itemSpacing={ 8 }>
      <Tag tone="success">Ready</Tag>
      <Text tone="muted">All checks passed</Text>
    </Layout>
    <Layout display="flex" itemSpacing={ 8 }>
      <Button>Publish</Button>
      <Button type="secondary">Preview</Button>
    </Layout>
  </Layout>
</Panel>`;

const STATE = `import { Button, Layout, Progress, Select, Text } from '@nurvus/ui';

// Your app owns the state; the components show it and report changes.
const Upload = () => {
  const [size, setSize] = React.useState('medium');
  const [percent, setPercent] = React.useState(40);
  return (
    <Layout itemSpacing={ 12 } style={ { maxWidth: 360 } }>
      <Select
        id="react-guide-size"
        label="Image size"
        value={ size }
        onChange={ setSize }
        options={ [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ] }
      />
      <Progress percent={ percent } label="Uploading" />
      <Layout display="flex" alignItems="center" itemSpacing={ 8 }>
        <Button size="small" onClick={ () => setPercent((p) => Math.min(100, p + 20)) }>Add 20%</Button>
        <Text variant="caption" tone="muted">{ size }, { percent }%</Text>
      </Layout>
    </Layout>
  );
};
<Upload />`;

const THEMES = `import { setTheme } from '@nurvus/ui';
import '@nurvus/ui/themes/tokyo-neon.css'; // each theme other than Apollo White is its own small file

setTheme('tokyo-neon'); // switches the page, and remembers it`;

const TYPES = `import { Button } from '@nurvus/ui';
import type { ButtonProps, IconName } from '@nurvus/ui';

type ToolbarAction = { icon: IconName; label: string } & Pick<ButtonProps, 'onClick'>;`;

const PROPS = `<Button
  className="save-button"   // yours comes first: class="save-button button nurvus"
  id="save"
  data-testid="save"
  aria-describedby="save-help"
>
  Save
</Button>`;

/**
 * The React side of Get started, the twin of the Respawn guide: install,
 * render, state, themes, TypeScript, and what every component accepts.
 */
export default function ReactGuide() {
  return (
    <div className="dx-page gd">
      <h1 className="dx-page-title">React</h1>
      <p className="dx-lede">
        Every NURVUS UI component is a React component: React 16.8 to 19, typed, styled and themed as soon as you
        import it. Want them without React? The same components, with the same props and markup, are in{' '}
        <a href={ href('Respawn') }>Respawn</a>.
      </p>

      <h2 className="gd-h2">Install</h2>
      <Example owner="Guide" code={ INSTALL } mode="static" lang="text" />

      <h2 className="gd-h2">Render a component</h2>
      <p className="gd-p">
        Import what you need from <code>@nurvus/ui</code>. The styles come with the components: the first import adds
        the core CSS and the default theme (Apollo White) to the page, once. There is nothing else to set up.
      </p>
      <Example owner="Guide" code={ FIRST } />

      <h2 className="gd-h2">Your state, their looks</h2>
      <p className="gd-p">
        The components keep no app data of their own: you pass the value (<code>value</code>, <code>current</code>,{' '}
        <code>percent</code>) and they call you back when someone changes it (<code>onChange</code>,{' '}
        <code>onNavigate</code>, <code>onClick</code>). Keep it in <code>useState</code>, a store or the address bar.
      </p>
      <Example owner="Guide" code={ STATE } />

      <h2 className="gd-h2">Themes</h2>
      <p className="gd-p">
        Apollo White needs nothing. For another theme, import its file and call <code>setTheme</code>. Every color in
        every component is a theme token, so the whole app changes at once.{' '}
        <a href={ href('Themes', 'Applying a theme') }>Applying a theme</a> covers the default, a theme menu, no flash
        on reload and nesting.
      </p>
      <Example owner="Guide" code={ THEMES } mode="static" />

      <h2 className="gd-h2">TypeScript</h2>
      <p className="gd-p">
        Types ship with the package: each component&apos;s props (<code>ButtonProps</code>, <code>SelectProps</code>…)
        and the names it takes, like <code>IconName</code>, so an editor lists them and catches typos.
      </p>
      <Example owner="Guide" code={ TYPES } mode="static" />

      <h2 className="gd-h2">What every component takes</h2>
      <ul className="gd-list">
        <li>
          <strong><code>className</code></strong>, put before the component&apos;s own classes, so your styles can
          build on them: <code>class=&quot;save-button button nurvus&quot;</code>.
        </li>
        <li>
          <strong>Any other attribute</strong> (<code>id</code>, <code>style</code>, <code>aria-*</code>,{' '}
          <code>data-*</code>, event handlers) goes on the component&apos;s outer element.
        </li>
        <li><strong>A ref</strong>: Button passes yours to its <code>&lt;button&gt;</code>.</li>
      </ul>
      <Example owner="Guide" code={ PROPS } mode="static" />

      <h2 className="gd-h2">Versions</h2>
      <ul className="gd-list">
        <li><strong>React 16.8, 17, 18 and 19</strong>, tested on 16.14, 18.3 and 19.3.</li>
        <li>Hooks inside, no class components to extend, nothing that needs a provider around your app.</li>
        <li>
          Server rendering (Next.js, Remix) isn&apos;t tested yet: see{' '}
          <a href={ href('Guides', 'Supported libraries') }>Supported libraries</a>.
        </li>
      </ul>

      <h2 className="gd-h2">Next</h2>
      <ul className="gd-list">
        <li><a href={ href('Components') }>Components</a>: every component, live examples you can edit, and its props.</li>
        <li><a href={ href('Foundations', 'Icons') }>Icons</a>, <a href={ href('Foundations', 'Spacing') }>Spacing</a> and <a href={ href('Foundations', 'Typography') }>Typography</a>: the parts they are made of.</li>
      </ul>
    </div>
  );
}
