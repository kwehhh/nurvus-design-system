// Turns an example from a component's .md file into a React component, the
// way styleguidist ran them:
//   - `import` lines work (each specifier is resolved by the docs plugin);
//   - every @nurvus/ui export is in scope without importing it;
//   - the LAST top-level JSX in the code is what renders.
import React from 'react';
import ReactDOM from 'react-dom';
import { transform } from 'sucrase';
import * as Nurvus from '@nurvus/ui';
import { modules } from 'virtual:nurvus-docs';

const IMPORT_RE = /^import\s[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm;
// Module-shaped (a default export plus the named ones), so both `import React from 'react'`
// and `import { useState } from 'react'` work in examples that belong to no component.
const BASE = { react: { default: React, ...React }, 'react-dom': { default: ReactDOM, ...ReactDOM }, '@nurvus/ui': Nurvus };
const nurvusNames = Object.keys(Nurvus).filter((k) => /^[A-Z]/.test(k));

/**
 * sucrase's CommonJS output expects __esModule on real ES modules. A CommonJS
 * package that Vite pre-bundled (e.g. @material-ui/icons/Add) arrives one level
 * deeper: the namespace's `default` is the whole `exports` object, whose own
 * `default` is the icon. Unwrap that, so `import AddIcon from …` gets the icon.
 */
const asModule = (ns) => {
  const inner = ns && ns.default;
  if (inner && typeof inner === 'object' && inner.__esModule) return inner;
  return { __esModule: true, ...ns };
};

/** Splits off the final top-level JSX: the first `<` at column 0 that opens it. */
function splitLastJsx(body) {
  const lines = body.split('\n');
  let start = -1;
  lines.forEach((line, i) => { if (/^<[A-Za-z>]/.test(line)) start = i; });
  if (start < 0) return null;
  return { before: lines.slice(0, start).join('\n'), jsx: lines.slice(start).join('\n').replace(/;\s*$/, '') };
}

/** Names an example declares itself, which must not be shadowed. */
function declaredNames(code) {
  const names = new Set();
  for (const m of code.matchAll(/\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of code.matchAll(/^import\s+([\s\S]*?)\s+from\s/gm)) {
    m[1].replace(/[{}*]/g, ' ').split(/[\s,]+/).filter(Boolean).forEach((part, i, all) => {
      if (part === 'as') return;
      if (all[i + 1] === 'as') return; // `A as B` declares B
      names.add(part);
    });
  }
  return names;
}

/**
 * Compiles `code` (from component `owner`'s .md). Returns a component, or
 * throws an Error whose message is what to show the reader.
 */
export function compileExample(code, owner) {
  const imports = (code.match(IMPORT_RE) || []).join('\n');
  const body = code.replace(IMPORT_RE, '').trim();
  const split = splitLastJsx(body);
  if (!split) throw new Error('The example has to end with JSX to render, e.g. <Button>Hi</Button>.');

  const declared = declaredNames(code);
  const inScope = nurvusNames.filter((n) => !declared.has(n));
  const source = `${imports}
const { ${inScope.join(', ')} } = __nurvus;
export default function Example() {
${split.before}
return (
${split.jsx}
);
}`;

  const { code: compiled } = transform(source, { transforms: ['jsx', 'imports'], production: true });
  const exports = {};
  const require = (spec) => {
    if (modules[`${owner}::${spec}`]) return asModule(modules[`${owner}::${spec}`]);
    if (BASE[spec]) return asModule(BASE[spec]);
    throw new Error(`Can't import "${spec}" here.`);
  };
  // eslint-disable-next-line no-new-func
  new Function('require', 'exports', 'React', '__nurvus', compiled)(require, exports, React, Nurvus);
  return exports.default;
}
