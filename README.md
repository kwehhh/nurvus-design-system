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
- React 16.8+, 17, 18 or 19, and the same React DOM (peer dependencies). Tested on 16.14, 18.3 and 19.3.
- One runtime dependency: `classnames`.
- TypeScript types are included (`import type { TagProps } from '@nurvus/ui'`).

### Usage
Use the following example after installation:
```jsx static
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@nurvus/ui';

function App() {
  return <Button type="primary">Hello, world!</Button>;
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

### Themes
Seven themes ship with the package, each a complete palette of the same 27 role tokens (`--nv-bg`, `--nv-text`, `--nv-accent`, `--nv-syntax-keyword`…): **Apollo White** and **Dopamine** (light), **Tokyo Neon**, **Nether**, **Nether Neon**, **Outworld** and **Arcane** (dark). All are `demo` status while the colors mature.

No setup: import any component and the page is Apollo White, the only theme in the core CSS. **Every other theme is its own small file (about 1 KB) that an app loads only if it offers it:**

```js static
import '@nurvus/ui/themes/tokyo-neon.css';   // one theme
import '@nurvus/ui/themes/all.css';          // or every theme, for a full theme menu
```

A visitor's saved choice comes back by itself when the package loads. For another default, put it on the page: `<html data-theme="tokyo-neon">`. `setTheme` warns in the console when a theme's file isn't loaded, and names the file.

```js static
import { setTheme, themes } from '@nurvus/ui';

setTheme('tokyo-neon');    // switch, and remember it (localStorage "nurvus.theme")
themes.map((t) => t.name); // every theme, for a picker
```

Step by step (default, theme menu, no flash on reload, nesting, your own CSS): **Applying a theme** on the docs site (https://design.nurvus.ai/#/Themes/Applying%20a%20theme).

Themes nest (`<nav data-theme="tokyo-neon">` inside a light page), and your own CSS should use the role tokens, never raw hex. Theme files live in `src/themes/*.json`; `npm run build:tokens` turns them into CSS and checks every theme's WCAG contrast (a failing `stable` theme fails the build). Each theme has its own page on the docs site.

### Without React
- **Respawn, or plain DOM:** `import { Button, setTheme } from '@nurvus/ui/respawn'`: the same components as plain DOM elements, styles included. Or `<script src="…/dist/respawn.js">` (`window.nurvusRespawn`).
- **Just the CSS:** link `@nurvus/ui/nurvus.css` (core + Apollo White + every component's styles) and the theme files you want; `@nurvus/ui/theme` (`dist/theme.js`) is the theme API alone.
- **Colors as data** (React Native, native apps, design tools): `@nurvus/ui/themes/<id>.json`, the same files the CSS is built from, plus `roles.json` (what each color is for).
- Guide: **Without React (Respawn)** on the docs site.

### Renamed in 0.1.0-alpha.14
- **`Menu`** is site navigation now (sections of links that open and close, with arrow keys): it was `NavList` in alpha.13.
- **`Tree`** is the nested, selectable list that `Menu` used to be (a layers panel), now with keyboard support. `Menu` given the old props (`items`, `activePath`) still draws a `Tree` and warns once, so old code keeps working until you rename it.
- New: **`Select`**, pick one value from a list (the WAI-ARIA select-only combobox).

### New in 0.1.0-alpha.15
- **`Icon`**: icons drawn for NURVUS on a 24-unit grid, in the text color, **1em by default** so an icon is as big as the text it sits in (`<Icon name="search" />`; `label` for an icon that stands alone). Names are typed (`IconName`); `ICONS` / `ICON_NAMES` list them. Same markup in `@nurvus/ui/respawn`.

### New in 0.1.0-alpha.18
- **`NavToggle`**: the button that shows and hides navigation. The hamburger (even or asymmetric lines; eight ways to turn into a close mark: slide, cross, squeeze, elastic, spin, arrow, chevron, collapse) or the sidebar icon (its pane fills while the sidebar shows; closed, it shrinks away and the divider slides left). Says what it will do and whether it is open.
- **`Tooltip`**: a short label for a control, on hover (after a short rest) and keyboard focus, with an optional shortcut as key caps. WCAG 1.4.13: Esc hides it, the pointer can move onto it, it stays while hovered or focused. Describes the control (`aria-describedby`).
- **`Kbd`**: key caps for shortcuts (`<kbd>` per key), sized in em. `modKey()` returns ⌘ on Apple devices and Ctrl elsewhere.
- **`Anchor`**: the list icon before its title, a dot at each end of the rail, the highlight over every section in view (the first is `aria-current`), and `fade`: a soft wash behind the row being read.
- **`align-left` icon** (72).

### New in 0.1.0-alpha.17
- **`Dropdown`**: a button that opens a menu of actions (the WAI-ARIA menu button: `aria-haspopup`, ↓ / ↑ / Enter / Space open it, Esc and choosing put focus back on the button, a click outside or Tab closes it).
- **`Anchor`**: "On this page". A rail beside the rows bends in and out with the nesting, and a highlight slides along it to the section in view (scroll-spy on the page or inside `scrollRoot`); picking a row scrolls there and moves focus. Drawn from the items alone (rows are 1.75rem), so it renders the same on the server.
- **`Menu` chevrons at the start** (as Material UI): › closed, ⌄ open, before the title, with a hairline guide down an open section and the current page's bar on it. `chevron="end"` keeps the old look. A menu of actions now carries its `id` (for `aria-controls`).
- **`contrast` icon** (71 icons): a ring with its right half filled, for theme switches.

### New in 0.1.0-alpha.16
- **Sizes are rem.** Type, spacing, radii and component sizes are in rem (hairlines and focus rings stay px), so everything grows when a reader sets bigger text in their browser. At the default (16px) nothing moves: the same pixels as before.
- **`Menu` is links, actions or a tree**, and screen readers hear each as what it is. Items with `href` make navigation (as before); items with `onSelect` make a menu of actions (`role="menu"`, one Tab stop, arrow keys, type to find); `kind="tree"` (or Tree's props) makes a tree. Up and Down move between items in all three. `Tree` is still there: the same as `<Menu kind="tree" />`. Menu with Tree's props no longer warns.
- **`Loader`**: the NURVUS mark with a light running round it (`role="status"`, a label for screen readers).
- **`Grid`** (equal columns, a count per breakpoint or as many as fit) and **`Stack`** (a column or a row with `gap`, the direction can change at a breakpoint), and **`BREAKPOINTS`** (sm 40em, md 48em, lg 64em, xl 80em).
- **`FullPageModal` is a modal dialog**: `role="dialog"`, `aria-modal`, named by its title; focus moves in when it opens and back when it closes; Tab stays inside; Esc calls the new `onClose`. Give it an `id` to label it by its title element.
- **`Progress`** is a `progressbar` with a name and value (`label`, `hideLabel`, `showValue`, `valueText`); with `showValue` its status is an icon and a word too. Its markup changed: the bar's track is now `.progress-track` inside `.progress`.
- **70 icons** (28 new: settings, user, bell, calendar, star, panel-left…) and **`dist/icons.svg`**, every icon as a `<symbol>` for pages without JavaScript: `<svg width="1em" height="1em"><use href="icons.svg#search"/></svg>`.
- `Select`'s list height is a CSS variable: `--nurvus-select-list-height` (default 360px).

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
