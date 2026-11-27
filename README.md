# NURVUS Design System (NDS)

The React component library of the NURVUS Design System, published as **`@nurvus/ui`**.

The NURVUS System (/ˈnərvəs ˌsistəm/) is the network of highly complex interconnected CaaS (Component as a service) for your application design.

### Installation

```bash
npm install @nurvus/ui@alpha
```

Or pin the range in `package.json`:

```json
"dependencies": {
  "@nurvus/ui": "^0.1.0-alpha.1"
}
```

> Every version publishes under the `alpha` dist-tag, and until a stable 1.0 `latest` follows it, so `npm install @nurvus/ui` and `@nurvus/ui@alpha` give the same newest build.

> **Publishing is automatic.** Every push to `main` that changes the package (`src/`, `tools/`, build config) publishes `0.1.0-alpha.<build number>` from GitHub Actions (`.github/workflows/publish.yml`, npm Trusted Publishing: no token, no 2FA code). Pick up the newest with `npm update @nurvus/ui`.

### Dependencies
- React ^16.8 (peer dependency)

### Usage
Use the following example after installation:
```jsx static
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@nurvus/ui';

function App() {
  return (
    <Button>
      This button is lit yo!
    </Button>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

### Themes
Seven themes ship with the package, each a complete palette of the same 27 role tokens (`--nv-bg`, `--nv-text`, `--nv-accent`, `--nv-syntax-keyword`…): **Apollo White** and **Dopamine** (light), **Tokyo Neon**, **Nether**, **Nether Neon**, **Outworld** and **Arcane** (dark). All are `demo` status while the colors mature. Every theme is a `[data-theme="<id>"]` block in the package CSS; with no attribute a page gets Apollo White.

No setup: import any component and the page is Apollo White. A visitor's saved choice comes back by itself when the package loads. For another default, put it on the page: `<html data-theme="tokyo-neon">`.

```js static
import { setTheme, themes } from '@nurvus/ui';

setTheme('tokyo-neon');    // switch, and remember it (localStorage "nurvus.theme")
themes.map((t) => t.name); // every theme, for a picker
```

Step by step (default, theme menu, no flash on reload, nesting, your own CSS): **Applying a theme** on the docs site (https://design.nurvus.ai/#/Guides/Applying%20a%20theme).

Themes nest (`<nav data-theme="tokyo-neon">` inside a light page), and your own CSS should use the role tokens, never raw hex. Theme files live in `src/themes/*.json`; `npm run build:tokens` turns them into CSS and checks every theme's WCAG contrast (a failing `stable` theme fails the build). Each theme has its own page on the docs site.

### Docs
Every component and theme, with live examples you can edit and each component's props: **https://design.nurvus.ai/**

## Contribute
### Getting Started
Run/Dev
1. `npm install` to install
2. `npm run docs` (or `npm run styleguide`) to run the docs site with hot reload
3. Go to `http://localhost:6061/`

The docs site lives in `docs/` (Vite). Component pages come from each component's `<Name>.md` (examples in ```jsx blocks: imports work, every @nurvus/ui component is in scope, the last JSX renders) and its PropTypes + docblocks (the props table). Step by step, with the files: **Add a component** on the docs site (https://design.nurvus.ai/#/Contributing/Add%20a%20component).

Build
1. `npm run build` to generate components package to `./dist` (webpack 5; runs on current Node with no OpenSSL flag).
2. `npm run docs:build` to build the docs site to `./docs/dist/` (what design.nurvus.ai serves; CI deploys it on every push to `main`).
