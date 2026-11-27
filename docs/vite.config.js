// The NURVUS docs site (replaces react-styleguidist). `npm run docs` / `npm run docs:build`.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nurvusDocs from './plugins/nurvus-docs.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

export default defineConfig({
  root: here,
  base: './',
  plugins: [react(), nurvusDocs({ root })],
  // When this site was built: the accessibility report shows it.
  define: { __NURVUS_BUILD_TIME__: JSON.stringify(new Date().toISOString()) },
  resolve: {
    alias: [
      // The docs are built from the package's source, like styleguidist was.
      // The package's entry points, from source: '@nurvus/ui', '/respawn', '/themes/<id>.css'.
      { find: /^@nurvus\/ui\/respawn$/, replacement: path.join(root, 'src/respawn/index.ts') },
      { find: /^@nurvus\/ui\/themes\/(.+)$/, replacement: path.join(root, 'src/themes/css/$1') },
      { find: /^@nurvus\/ui$/, replacement: path.join(root, 'src/index.ts') },
      // @material-ui/icons/<Name> is CommonJS; its default export arrived as the
      // whole exports object after Vite re-bundled deps. The package ships an
      // ES-module copy of every icon: use that, so default imports just work.
      { find: /^@material-ui\/icons\/(?!esm\/)(.+)$/, replacement: '@material-ui/icons/esm/$1' },
    ],
    // One React: the components and the docs must share it.
    dedupe: ['react', 'react-dom'],
  },
  server: { port: 6061, fs: { allow: [root] } },
  build: { outDir: path.join(root, 'docs/dist'), emptyOutDir: true },
});
