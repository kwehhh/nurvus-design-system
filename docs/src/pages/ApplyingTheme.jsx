import React from 'react';
import { Table, Tag } from '@nurvus/ui';
import Example from '../examples/Example';
import { href } from '../router';
import './Guides.scss';

const ZERO = `import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@nurvus/ui';

// No theme code: the page is Apollo White.
ReactDOM.render(<Button>Hello, world!</Button>, document.getElementById('root'));`;

const LOAD = `import '@nurvus/ui/themes/tokyo-neon.css';   // one theme, about 1 KB
import '@nurvus/ui/themes/all.css';          // or every theme, for a full theme menu`;

const DEFAULT_HTML = `// In your app's entry file: load the theme.
import '@nurvus/ui/themes/tokyo-neon.css';

<!-- index.html: and make it the page's default -->
<html data-theme="tokyo-neon">`;

const PICKER = `import React from 'react';
import { themes, setTheme, currentTheme } from '@nurvus/ui';

function ThemePicker() {
  const [id, setId] = React.useState(currentTheme().id);
  const pick = (event) => setId(setTheme(event.target.value).id);
  return (
    <label>
      Theme{' '}
      <select value={ id } onChange={ pick }>
        { themes.map((t) => <option key={ t.id } value={ t.id }>{ t.name }</option>) }
      </select>
    </label>
  );
}

<ThemePicker />`;

const NO_FLASH = `<!-- In <head>, before your bundle: the saved theme is on before the first paint. -->
<script>
  try {
    var t = localStorage.getItem('nurvus.theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
</script>`;

const NESTED = `<html data-theme="apollo-white">
  <nav data-theme="tokyo-neon">…a dark sidebar in a light app…</nav>
</html>

// Or from code, without saving it as the visitor's choice:
setTheme('tokyo-neon', { root: navElement, persist: false });`;

const OWN_CSS = `.card {
  background: var(--nv-surface);
  color: var(--nv-text);
  border: 1px solid var(--nv-border);
}
.card a { color: var(--nv-accent); }`;

const LISTEN = `document.addEventListener('nurvus:themechange', (event) => {
  console.log('Now in', event.detail.name);   // the theme object
});`;

const API = [
  { name: 'setTheme(id, { root, persist })', does: 'Applies a theme to <html> (or root) and saves it as the visitor\'s choice (persist: false to skip). Returns the theme.' },
  { name: 'initTheme(fallback)', does: 'Applies the saved theme, or fallback when nothing is saved. Only needed for a default other than Apollo White set from code.' },
  { name: 'currentTheme(root)', does: 'The theme applied right now (Apollo White when none is set).' },
  { name: 'getTheme(id)', does: 'One theme object: id, name, mode, keywords, colors…' },
  { name: 'themes', does: 'Every theme, in menu order. Build a picker from it.' },
  { name: 'THEME_STORAGE_KEY', does: '"nurvus.theme", the localStorage key the choice is saved under.' },
  { name: 'THEME_CHANGE_EVENT', does: '"nurvus:themechange", fired after every setTheme; detail is the theme.' },
];

function Step({ n, title, children }) {
  return (
    <section className="gd-step">
      <h2 className="gd-h2"><span className="gd-n" aria-hidden="true">{ n }</span>{ title }</h2>
      { children }
    </section>
  );
}

/** For app developers: how a theme gets applied, switched, remembered and nested. */
export default function ApplyingTheme() {
  const columns = [
    { dataKey: 'name', title: 'API', render: (value) => <code>{ value }</code> },
    { dataKey: 'does', title: 'What it does' },
  ];
  return (
    <div className="dx-page gd">
      <h1 className="dx-page-title">Applying a theme</h1>
      <p className="dx-lede">
        Themes need no setup. Import any component and the page is Apollo White. Other themes load only if you
        ask for them, one small file each. Everything below is optional: more themes, a different default, a theme
        picker, a dark part of a light page.
      </p>

      <Step n={ 1 } title="Zero setup">
        <p>The package's core CSS carries one theme, Apollo White. With no <code>data-theme</code> anywhere, that's what the page gets.</p>
        <Example owner="Guide" code={ ZERO } mode="static" />
      </Step>

      <Step n={ 2 } title="Load the themes you offer">
        <p>
          Every other theme is its own file, about 1 KB. Import the ones your app offers, or <code>all.css</code> for a
          full theme menu. A theme you don't import never reaches your users. If you switch to a theme whose file isn't
          loaded, <code>setTheme</code> says so in the console and names the file.
        </p>
        <Example owner="Guide" code={ LOAD } mode="static" />
      </Step>

      <Step n={ 3 } title="A different default">
        <p>Load that theme's file and put its name on <code>&lt;html&gt;</code>. No theme code needed.</p>
        <Example owner="Guide" code={ DEFAULT_HTML } mode="static" />
      </Step>

      <Step n={ 4 } title="Let people switch">
        <p>
          <code>setTheme(id)</code> applies a theme and saves it. On the next visit the package brings the saved
          theme back by itself when it loads: no code for that either. A picker can only offer the themes you loaded
          (this site loads all of them). This one is live; it switches this site.
        </p>
        <Example owner="Guide" code={ PICKER } />
      </Step>

      <Step n={ 5 } title="No flash on reload">
        <p>
          The package restores the saved theme when your JavaScript loads, a moment after the first paint. To have it
          on from the very first frame, add this to <code>&lt;head&gt;</code>.
        </p>
        <Example owner="Guide" code={ NO_FLASH } mode="static" />
      </Step>

      <Step n={ 6 } title="Theme one part of a page">
        <p>Themes nest: any element can carry its own, like a dark sidebar in a light app.</p>
        <Example owner="Guide" code={ NESTED } mode="static" />
      </Step>

      <Step n={ 7 } title="Use the colors in your own CSS">
        <p>
          Style your own UI with the role tokens, never raw hex. They mean the same thing in every theme, so your
          screens follow the theme too. <a href={ href('Themes', 'Apollo White') }>Each theme's page</a> lists all of them.
        </p>
        <Example owner="Guide" code={ OWN_CSS } mode="static" lang="text" />
      </Step>

      <Step n={ 8 } title="React to a change">
        <Example owner="Guide" code={ LISTEN } mode="static" />
      </Step>

      <h2 className="gd-h2">The theme API <Tag tone="accent">@nurvus/ui</Tag></h2>
      <Table className="gd-api" columns={ columns } data={ API } />
    </div>
  );
}
