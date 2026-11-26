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
  resolve: {
    // The docs are built from the package's source, like styleguidist was.
    alias: { '@nurvus/ui': path.join(root, 'src/index.js') },
    // One React: the components and the docs must share it.
    dedupe: ['react', 'react-dom'],
  },
  server: { port: 6061, fs: { allow: [root] } },
  build: { outDir: path.join(root, 'docs/dist'), emptyOutDir: true },
});
