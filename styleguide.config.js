var package = require('./package.json');
const path = require('path');
const fs = require('fs');

// Every theme gets its own page under Themes, in the same order as the
// switcher (src/themes/*.json → `order`).
const THEMES_DIR = path.join(__dirname, 'src/themes');
const themes = fs.readdirSync(THEMES_DIR)
  .filter((f) => f.endsWith('.json') && f !== 'roles.json')
  .map((f) => require(path.join(THEMES_DIR, f)))
  .sort((a, b) => a.order - b.order);

// Applies the saved theme before the first paint (no flash of the default).
// Also moves people off the old 2026-08 light/dark toggle's key.
const applySavedTheme = `<script>try{var k='nurvus.theme',o=localStorage.getItem('nurvus-theme');
if(o!==null){if(o==='dark'&&!localStorage.getItem(k))localStorage.setItem(k,'tokyo-neon');localStorage.removeItem('nurvus-theme');}
var t=localStorage.getItem(k);if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>`;

module.exports = {
  theme: {
    fontFamily: {
      base: '"Inter", sans-serif'
    }
  },
  template: {
    head: { raw: applySavedTheme }
  },
  // Import Loaders, etc from base config
  webpackConfig: Object.assign({}, require('./webpack.config.js'), {
    /* Custom config options */
  }),
  // One page per section: each theme and each component is its own page.
  pagePerSection: true,
  sections: [
    {
      name: 'Themes',
      content: './styleguide/docs/Themes.md',
      sectionDepth: 1,
      sections: themes.map((t) => ({
        name: t.name,
        content: `./styleguide/docs/themes/${t.id}.md`
      }))
    },
    {
      name: 'Components',
      components: './src/components/**/*.jsx',
      sectionDepth: 1
    }
  ],
  require: [
    path.join(__dirname, './styleguide/styles.scss')
  ],
  title: 'NURVUS UI',
  version: package.version,
  // Where to build Styleguide
  styleguideDir: './styleguide/build',
  styleguideComponents: {
    // Wrapper: path.join(__dirname, 'styleguide/Renderer'),
    PlaygroundRenderer: path.join(__dirname, './styleguide/components/PlaygroundRenderer.jsx'),
    SectionsRenderer: path.join(__dirname, './styleguide/components/SectionsRenderer.jsx'),
    StyleGuideRenderer: path.join(
      __dirname,
      './styleguide/components/StyleguideRenderer.jsx'
    )
  },
  moduleAliases: {
    [package.name]: path.resolve(__dirname, './src/index.js')
  }
};


