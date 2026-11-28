// After webpack: copy the per-theme CSS files to dist/themes/ (apps import the
// ones they offer: '@nurvus/ui/themes/tokyo-neon.css'), plus each theme's JSON
// and roles.json, so apps that can't use CSS (React Native, native, design
// tools) can read the same colors: '@nurvus/ui/themes/apollo-white.json'.
// Then the icon sprite (dist/icons.svg: every icon as a <symbol>, for pages
// without JavaScript), and drop the JS stub webpack writes next to dist/nurvus.css.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

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

// dist/icons.svg: <svg><use href="icons.svg#search"/></svg> draws the search icon. Each
// symbol carries the line style itself: a <use> copy inherits from where it is used, not from this file.
const iconsTs = fs.readFileSync(path.join(root, 'src/icons.ts'), 'utf8');
const iconsJs = path.join(root, 'dist/.icons.mjs');
fs.writeFileSync(iconsJs, ts.transpileModule(iconsTs, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2019 } }).outputText);
const { ICONS, ICON_NAMES } = await import(pathToFileURL(iconsJs).href);
fs.rmSync(iconsJs);
const attrs = (a) => Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
const symbols = ICON_NAMES.map((name) => `  <symbol id="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name].map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('')}</symbol>`);
fs.writeFileSync(path.join(root, 'dist/icons.svg'), `<svg xmlns="http://www.w3.org/2000/svg">
  <!-- The NURVUS icons (@nurvus/ui). Use one: <svg class="icon nurvus" width="1em" height="1em" aria-hidden="true"><use href="icons.svg#search"/></svg> -->
${symbols.join('\n')}
</svg>
`);
console.log(`dist/icons.svg: ${ICON_NAMES.length} icons`);
