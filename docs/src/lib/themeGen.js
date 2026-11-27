/**
 * Theme Studio's generator: one brand color in, a complete NURVUS theme out.
 * Pure functions, no DOM, so Node can import this file to test it.
 *
 * The color math is OKLCH (Björn Ottosson's OKLab in polar form): L is how
 * light a color looks (0 to 1), C how colorful, H its hue in degrees. Moving L
 * alone keeps a color recognisably the same hue. Contrast is measured with the
 * same code the build runs (tools/contrast.mjs), on the final #RRGGBB values.
 */
import { contrast } from '../../../tools/contrast.mjs';

// ---------------------------------------------------------------------------
// Color conversion

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** "#abc", "abc", "#AABBCC" -> "#AABBCC"; anything else -> null. */
export function normalizeHex(value) {
  const s = String(value || '').trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(s)) return `#${s.split('').map((x) => x + x).join('')}`.toUpperCase();
  if (/^[0-9a-f]{6}$/i.test(s)) return `#${s}`.toUpperCase();
  return null;
}

export const isHex = (value) => /^#[0-9a-f]{6}$/i.test(value);

/** "rgba(36, 92, 199, 0.10)" -> { r, g, b, a }; null if it isn't one. */
export function parseRgba(value) {
  const m = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/i.exec(String(value || '').trim());
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map(Number);
  const a = m[4] === undefined ? 1 : Number(m[4]);
  if ([r, g, b].some((v) => v > 255) || a > 1) return null;
  return { r, g, b, a };
}

export const formatRgba = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;

/** The #RRGGBB part of a hex or rgba() value (for color inputs and swatches). */
export function solidHex(value) {
  if (isHex(value)) return value.toUpperCase();
  const c = parseRgba(value);
  if (!c) return '#000000';
  return `#${[c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function hexToLinear(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [16, 8, 0].map((shift) => toLinear(((n >> shift) & 255) / 255));
}

/** #RRGGBB -> { l, c, h } in OKLCH. */
export function hexToOklch(hex) {
  const [r, g, b] = hexToLinear(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}

/** OKLCH -> linear sRGB [r, g, b] (may fall outside 0..1). */
function oklchToLinear(L, C, H) {
  const hr = (H * Math.PI) / 180;
  const A = C * Math.cos(hr);
  const B = C * Math.sin(hr);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -1e-5 && v <= 1 + 1e-5);

/**
 * OKLCH -> #RRGGBB. A color the screen can't show keeps its lightness and hue
 * and loses chroma (colorfulness) until it fits.
 */
export function oklchToHex({ l, c, h }) {
  const L = clamp(l, 0, 1);
  let rgb = oklchToLinear(L, c, h);
  if (!inGamut(rgb)) {
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 24; i += 1) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear(L, mid, h))) lo = mid; else hi = mid;
    }
    rgb = oklchToLinear(L, lo, h);
  }
  return `#${rgb.map((v) => Math.round(clamp(toGamma(clamp(v, 0, 1)), 0, 1) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

/** Shortest distance between two hues, in degrees (0 to 180). */
export function hueDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// ---------------------------------------------------------------------------
// Contrast fitting

const STEP = 0.0025;
const meets = (hex, against, min) => against.every((bg) => contrast(hex, bg) >= min);
const worst = (hex, against) => Math.min(...against.map((bg) => contrast(hex, bg)));

/**
 * The color closest in lightness to `start` (same hue; chroma where the screen
 * allows it) that meets `min` against every color in `against`. `start` is a
 * hex (kept exactly when it already passes) or an { l, c, h } target. When no
 * lightness can pass, returns black or white, whichever comes closest.
 */
export function fitLightness(start, against, min) {
  const target = typeof start === 'string' ? hexToOklch(start) : start;
  const first = typeof start === 'string' ? start.toUpperCase() : oklchToHex(start);
  if (meets(first, against, min)) return first;
  for (let d = STEP; d <= 1; d += STEP) {
    for (const dir of [-1, 1]) {
      const l = target.l + dir * d;
      if (l < 0 || l > 1) continue;
      const hex = oklchToHex({ ...target, l });
      if (meets(hex, against, min)) return hex;
    }
  }
  return worst('#000000', against) >= worst('#FFFFFF', against) ? '#000000' : '#FFFFFF';
}

/** Every role that has a contrast check, with its rule. Same filter as checkTheme. */
export function checkedRoles(roles) {
  return Object.keys(roles).filter((role) => roles[role].check && roles[role].check.min > 1);
}

/** Roles that are a foreground or background in any check: these must stay #RRGGBB. */
export function rolesInChecks(roles) {
  const set = new Set();
  checkedRoles(roles).forEach((role) => {
    set.add(role);
    roles[role].check.against.forEach((a) => set.add(a));
  });
  return set;
}

/**
 * Moves each failing foreground's lightness until every check passes (or
 * can't). Backgrounds are left alone. Repeats because a fixed color can be a
 * background in another check (accent-fill under on-accent).
 * Returns { colors, changed } with `changed` the roles that moved.
 */
export function fixContrast(colors, roles) {
  const out = { ...colors };
  const changed = new Set();
  for (let round = 0; round < 4; round += 1) {
    let moved = false;
    checkedRoles(roles).forEach((role) => {
      const { against, min } = roles[role].check;
      const bgs = against.map((a) => out[a]);
      if (!isHex(out[role]) || !bgs.every(isHex) || meets(out[role], bgs, min)) return;
      const next = fitLightness(out[role], bgs, min);
      if (next !== out[role]) { out[role] = next; changed.add(role); moved = true; }
    });
    if (!moved) break;
  }
  return { colors: out, changed: [...changed] };
}

// ---------------------------------------------------------------------------
// The generator

// Starting points, [lightness, chroma] per role. Chroma for the greys is
// scaled by how colorful the brand is, so a grey brand gets true greys.
const NEUTRALS = {
  light: {
    bg: [0.995, 0.003], 'bg-alt': [0.973, 0.006], 'bg-deep': [0.955, 0.010],
    surface: [0.962, 0.008], 'surface-hover': [0.935, 0.013], border: [0.92, 0.013],
    'border-strong': [0.64, 0.03], text: [0.28, 0.03], 'text-muted': [0.43, 0.032],
    'text-subtle': [0.55, 0.028], 'syntax-comment': [0.54, 0.028], selection: [0.935, 0.045],
  },
  dark: {
    bg: [0.2, 0.025], 'bg-alt': [0.18, 0.023], 'bg-deep': [0.16, 0.02],
    surface: [0.228, 0.03], 'surface-hover': [0.265, 0.035], border: [0.29, 0.04],
    'border-strong': [0.51, 0.05], text: [0.92, 0.03], 'text-muted': [0.78, 0.04],
    'text-subtle': [0.57, 0.04], 'syntax-comment': [0.66, 0.04], selection: [0.31, 0.065],
  },
};

// Status colors sit on fixed hues, whatever the brand: [hue, chroma].
const STATUS = {
  success: [155, 0.12],
  warning: [70, 0.13],
  danger: [22, 0.18],
  info: [255, 0.15],
};

// Code colors: six hues spread evenly around the wheel, starting at the brand.
const SYNTAX = {
  'syntax-function': 0,
  'syntax-keyword': 60,
  'syntax-tag': 120,
  'syntax-number': 180,
  'syntax-attr': 240,
  'syntax-string': 300,
};

// Starting lightness for status and code colors; the contrast pass then moves
// any that fall short.
const STATUS_L = { light: 0.52, dark: 0.75 };
const SYNTAX_L = { light: 0.52, dark: 0.78 };
const SYNTAX_C = { light: 0.16, dark: 0.15 };

/**
 * The fill closest in lightness to the brand that has 3:1 against the page
 * and lets `text` reach 4.5:1 on it. Returns { fill, d } (d = how far the
 * lightness moved), or null.
 */
function nearestFill(brand, bg, text) {
  const ok = (fill) => contrast(fill, bg) >= 3 && contrast(text, fill) >= 4.5;
  if (ok(brand)) return { fill: brand, d: 0 };
  const b = hexToOklch(brand);
  for (let d = STEP; d <= 1; d += STEP) {
    for (const dir of [-1, 1]) {
      const l = b.l + dir * d;
      if (l < 0 || l > 1) continue;
      const fill = oklchToHex({ ...b, l });
      if (ok(fill)) return { fill, d };
    }
  }
  return null;
}

// White text on a brand button is the usual look: keep it unless near-black
// text lets the fill stay this much closer to the brand's lightness.
const WHITE_TEXT_BIAS = 0.06;

/**
 * The button fill and the text on it, solved together: the fill needs 3:1
 * against the page and its text 4.5:1 against the fill. Tries white text and
 * near-black text, and keeps whichever lets the fill stay closest to the
 * brand (white wins near-ties, see WHITE_TEXT_BIAS).
 */
function solveFill(brand, bg, darkText) {
  const white = nearestFill(brand, bg, '#FFFFFF');
  const dark = nearestFill(brand, bg, darkText);
  if (white && (!dark || white.d <= dark.d + WHITE_TEXT_BIAS)) return { fill: white.fill, on: '#FFFFFF' };
  if (dark) return { fill: dark.fill, on: darkText };
  return { fill: brand, on: '#FFFFFF' };
}

/**
 * All 27 role colors for a brand color and a mode ('light' or 'dark'),
 * adjusted so every check in roles.json passes. `roles` is roles.json.
 */
export function generateColors({ brand, mode }, roles) {
  const hex = normalizeHex(brand) || '#245CC7';
  const dark = mode === 'dark';
  const b = hexToOklch(hex);
  const k = clamp(b.c / 0.12, 0, 1); // how much of the brand's hue the greys get
  const c = {};

  Object.entries(NEUTRALS[dark ? 'dark' : 'light']).forEach(([role, [l, chroma]]) => {
    c[role] = oklchToHex({ l, c: chroma * k, h: b.h });
  });

  const m = dark ? 'dark' : 'light';
  Object.entries(STATUS).forEach(([role, [h, chroma]]) => { c[role] = oklchToHex({ l: STATUS_L[m], c: chroma, h }); });
  Object.entries(SYNTAX).forEach(([role, offset]) => {
    c[role] = oklchToHex({ l: SYNTAX_L[m], c: SYNTAX_C[m], h: (b.h + offset) % 360 });
  });

  // The brand itself: links and marks (4.5:1 on bg and surface), then the button.
  c.accent = fitLightness(hex, [c.bg, c.surface], 4.5);
  const { fill, on } = solveFill(hex, c.bg, oklchToHex({ l: 0.18, c: 0.03 * k, h: b.h }));
  c['accent-fill'] = fill;
  c['on-accent'] = on;
  c.cursor = c.accent;
  const f = parseInt(fill.slice(1), 16);
  c['accent-soft'] = formatRgba({ r: (f >> 16) & 255, g: (f >> 8) & 255, b: f & 255, a: dark ? 0.16 : 0.1 });

  // Then every check in roles.json: move lightness until it passes.
  const { colors } = fixContrast(c, roles);
  return orderColors(colors, roles);
}

/** The colors in roles.json order (the order of the shipped theme files). */
export function orderColors(colors, roles) {
  const out = {};
  Object.keys(roles).forEach((role) => { out[role] = colors[role]; });
  return out;
}

// ---------------------------------------------------------------------------
// The theme file

/** "Acme Corp!" -> "acme-corp". */
export function slugify(name) {
  return String(name || '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** A plain color name for a hue, for the theme's keywords. */
export function hueName(hex) {
  const { c, h } = hexToOklch(hex);
  if (c < 0.03) return 'Grey';
  const names = [[15, 'Pink'], [35, 'Red'], [75, 'Orange'], [115, 'Yellow'], [165, 'Green'], [215, 'Teal'], [275, 'Blue'], [315, 'Violet'], [345, 'Purple'], [360, 'Pink']];
  return names.find(([end]) => h < end)[1];
}

/**
 * The theme as a src/themes/*.json object: the same keys, in the same order,
 * as the shipped themes.
 */
export function buildTheme({ name, mode, brand, colors, order }, roles) {
  const title = String(name || '').trim() || 'My theme';
  const Mode = mode === 'dark' ? 'Dark' : 'Light';
  return {
    id: slugify(title) || 'my-theme',
    name: title,
    mode: mode === 'dark' ? 'dark' : 'light',
    status: 'demo',
    order,
    keywords: `Custom. ${Mode}. ${hueName(brand)}.`,
    summary: `A ${Mode.toLowerCase()} theme made from the brand color ${brand}.`,
    description: `Made in Theme Studio from the brand color ${brand}. The greys carry a little of its hue; status and code colors sit on fixed hues.`,
    bestFor: `Products that carry the ${title} brand.`,
    showcase: {
      label: 'text-subtle',
      title: 'accent',
      tagline: 'text-muted',
      swatches: ['accent', 'syntax-keyword', 'syntax-tag', 'surface', 'syntax-string'],
    },
    colors: orderColors(colors, roles),
  };
}

/** The theme as the CSS block tools/build-tokens.js writes for it. */
export function themeCss(theme) {
  const lines = Object.entries(theme.colors).map(([role, value]) => `  --nv-${role}: ${value};`);
  return `/* ${theme.name}: ${theme.keywords} (${theme.mode}, ${theme.status}) */\n[data-theme="${theme.id}"] {\n  color-scheme: ${theme.mode};\n${lines.join('\n')}\n}\n`;
}
