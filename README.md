# NURVUS Design System (NDS)

A React based reusable component library.

The NURVUS System (/ˈnərvəs ˌsistəm/) is the network of highly complex interconnected CaaS (Component as a service) for your application design.

### Installation
1. CLI Install `npm install https://github.com/UnfocusedDrive/nurvus-design-system.git#main`
2. Or, Manual Install: Or as alternative, add `"@nurvus/ui": "git+https://github.com/UnfocusedDrive/nurvus-design-system.git#main",` to `package.json` dependencies.

### Dependencies
- React ^16.8

### Usage
Use the following example after installation:
```jsx static
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@nurvus/design-system';

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
