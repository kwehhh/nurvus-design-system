// After webpack: copy the per-theme CSS files to dist/themes/ (apps import the
// ones they offer: '@nurvus/ui/themes/tokyo-neon.css'), plus each theme's JSON
// and roles.json, so apps that can't use CSS (React Native, native, design
// tools) can read the same colors: '@nurvus/ui/themes/apollo-white.json'.
// Then drop the JS stub webpack writes next to dist/nurvus.css.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const from = path.join(root, 'src/themes/css');
const to = path.join(root, 'dist/themes');
fs.mkdirSync(to, { recursive: true });
const files = fs.readdirSync(from).filter((f) => f.endsWith('.css'));
files.forEach((f) => fs.copyFileSync(path.join(from, f), path.join(to, f)));
const json = path.join(root, 'src/themes');
const data = fs.readdirSync(json).filter((f) => f.endsWith('.json'));
data.forEach((f) => fs.copyFileSync(path.join(json, f), path.join(to, f)));
files.push(...data);
for (const stub of ['css-entry.js', 'css-entry.js.LICENSE.txt']) fs.rmSync(path.join(root, 'dist', stub), { force: true });
console.log(`dist/themes: ${files.join(', ')}`);
