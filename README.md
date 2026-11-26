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
Six themes ship with the package, each a complete palette of the same 27 role tokens (`--nv-bg`, `--nv-text`, `--nv-accent`, `--nv-syntax-keyword`…): **Apollo White** and **Dopamine** (light), **Tokyo Neon**, **Nether**, **Outworld** and **Arcane** (dark). All are `demo` status while the colors mature. Every theme is a `[data-theme="<id>"]` block in the package CSS; with no attribute a page gets Apollo White.

```js static
import { initTheme, setTheme, themes } from '@nurvus/ui';

initTheme('tokyo-neon');   // at startup: the saved theme, or this default
setTheme('apollo-white');  // switch, and remember it (localStorage "nurvus.theme")
```

Themes nest (`<nav data-theme="tokyo-neon">` inside a light page), and your own CSS should use the role tokens, never raw hex. Theme files live in `src/themes/*.json`; `npm run build:tokens` turns them into CSS and checks every theme's WCAG contrast (a failing `stable` theme fails the build). Each theme has its own page in the styleguide.

Not sure yet? Try out the styleguide here:
http://nurvus.memoryleak.ai/

Latest preview version can be viewed here:
https://unstable.memoryleak.ai/nurvus-design-system

## Contribute
### Getting Started
Run/Dev
1. `npm install` to install
2. `npm run styleguide` to run Styleguide
3. Go to `http://localhost:6060/`

Build
1. `npm run build` to generate components package to `./dist`.
2. `npm run styleguide:build` to build Styleguide to `./styleguide/build/`.
