// Builds src/logo.ts (the mark Loader draws) from docs/src/components/logoData.js.
// Run it after the logo changes: node tools/build-logo.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { GRADIENTS, INNER, OUTER } = await import(pathToFileURL(path.join(root, 'docs/src/components/logoData.js')).href);
const CX = 761, CY = 419;
const grad = Object.fromEntries(GRADIENTS.map(([k, x1, y1, x2, y2, from, to]) => [k, { x1, y1, x2, y2, from, to }]));
const seg = ([k, d]) => {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let x = 0, y = 0, c = 0;
  for (let i = 0; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; c += 1; }
  const a = ((Math.atan2(y / c - CY, x / c - CX) / (2 * Math.PI)) + 1.25) % 1;
  const g = grad[k];
  return [d, g.from, g.to, [g.x1, g.y1, g.x2, g.y2], +a.toFixed(3)];
};
const out = `// GENERATED from docs/public/nurvus-logo.svg (via docs/src/components/logoData.js) by
// tools/build-logo.mjs. The NURVUS mark, for Loader: two rings of segments.
// Each segment: [path, gradient from, gradient to, [x1, y1, x2, y2] of the gradient, angle round the ring (0 at the top, 0..1 clockwise)].

export type LogoSegment = [d: string, from: string, to: string, line: [number, number, number, number], angle: number];

/** The artwork's viewBox around the mark alone. */
export const LOGO_VIEWBOX = '492 149 540 540';

export const LOGO_INNER: LogoSegment[] = ${JSON.stringify(INNER.map(seg))};

export const LOGO_OUTER: LogoSegment[] = ${JSON.stringify(OUTER.map(seg))};
`;
fs.writeFileSync(path.join(root, 'src/logo.ts'), out);
console.log('segments', INNER.length + OUTER.length, 'bytes', out.length);
