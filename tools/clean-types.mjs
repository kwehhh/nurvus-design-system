// After tsc: make dist/types/*.d.ts safe for every app's TypeScript setup.
//  - Drop style imports (`import './Tag.scss';`): types don't need them, and
//    an app with noUncheckedSideEffectImports would fail on them.
//  - React.JSX.Element -> React.ReactElement: older @types/react (16, early
//    17) has no React.JSX namespace.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist/types');
let files = 0;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) return walk(p);
  if (!p.endsWith('.d.ts')) return;
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replace(/^import '[^']+\.s?css';\n/gm, '').replace(/React\.JSX\.Element/g, 'React.ReactElement');
  if (after !== before) { fs.writeFileSync(p, after); files += 1; }
});
walk(dir);
console.log(`dist/types: cleaned ${files} files`);
