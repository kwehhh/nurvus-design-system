// Vite plugin: `import { components, modules } from 'virtual:nurvus-docs'`.
//
// For every src/components/<Name>/<Name>.tsx (or .jsx) it provides:
//   - the API from react-docgen (description + props: type, default, required),
//     read from the component's PropTypes and docblocks (what styleguidist used);
//   - the raw <Name>.md (prose + ```jsx examples), unchanged from styleguidist.
// `modules` holds every module an example imports, keyed "<Name>::<specifier>",
// so the live examples can `import` exactly what the .md file says.
import fs from 'node:fs';
import path from 'node:path';
import { parse, makeFsImporter } from 'react-docgen';

const VIRTUAL = 'virtual:nurvus-docs';
const RESOLVED = `\0${VIRTUAL}`;
const IMPORT_RE = /^\s*import\s+[\s\S]*?from\s+['"]([^'"]+)['"];?/gm;

export default function nurvusDocs({ root }) {
  const componentsDir = path.join(root, 'src/components');
  // A component is a folder with <Name>.tsx (or the older <Name>.jsx) in it.
  const sourceOf = (name) => [`${name}.tsx`, `${name}.jsx`].map((f) => path.join(componentsDir, name, f)).find((f) => fs.existsSync(f));

  function build() {
    const imports = [];
    const modules = [];
    const names = fs.readdirSync(componentsDir)
      .filter((name) => sourceOf(name))
      .sort();

    const components = names.map((name) => {
      const dir = path.join(componentsDir, name);
      const file = sourceOf(name);
      const mdFile = path.join(dir, `${name}.md`);
      let doc = {};
      try {
        // The fs importer follows imports, so a type from another file (Layout's
        // Spacing, in spacing.ts) is expanded in the props table too.
        doc = parse(fs.readFileSync(file, 'utf8'), { filename: file, importer: makeFsImporter() })[0] || {};
      } catch (error) {
        doc = { parseError: error.message };
      }
      const markdown = fs.existsSync(mdFile) ? fs.readFileSync(mdFile, 'utf8') : '';
      const specs = new Set([...markdown.matchAll(IMPORT_RE)].map((m) => m[1]));
      specs.forEach((spec) => {
        const target = spec.startsWith('.') ? path.resolve(dir, spec) : spec;
        const id = `m${imports.length}`;
        imports.push(`import * as ${id} from ${JSON.stringify(target)};`);
        modules.push(`${JSON.stringify(`${name}::${spec}`)}: ${id}`);
      });
      return {
        name,
        // JSDoc tags (@returns …) are for code readers, not the docs page.
        description: (doc.description || '').replace(/^@\w+.*$/gm, '').trim(),
        props: doc.props || {},
        parseError: doc.parseError || null,
        markdown,
      };
    });

    return [
      ...imports,
      `export const modules = { ${modules.join(', ')} };`,
      `export const components = ${JSON.stringify(components)};`,
    ].join('\n');
  }

  return {
    name: 'nurvus-docs',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    load(id) {
      return id === RESOLVED ? build() : undefined;
    },
    // A changed component or example: rebuild the docs data and reload.
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(componentsDir) || !/\.(md|jsx|tsx)$/.test(file)) return undefined;
      const mod = server.moduleGraph.getModuleById(RESOLVED);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
