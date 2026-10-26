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

> Prereleases publish under the `alpha` dist-tag. Consumers opt in explicitly — `latest` is reserved for the first stable release.

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
