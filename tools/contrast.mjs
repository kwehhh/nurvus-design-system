/**
 * WCAG 2 contrast for theme colors. Shared by tools/build-tokens.js (the
 * build-time check) and the styleguide's theme pages (the per-token column).
 * An ES module (.mjs) so Node (build-tokens), webpack (the old styleguide) and
 * Vite (the docs app) all load the same file.
 */

/** Relative luminance of a #RRGGBB color. */
export function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [16, 8, 0]
    .map((shift) => ((n >> shift) & 255) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}

/** Contrast ratio of two #RRGGBB colors, 1 to 21. */
export function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v);

/**
 * Every contrast check a theme must pass, from the `check` entries in
 * src/themes/roles.json. Returns one row per (token, against) pair.
 */
export function checkTheme(theme, roles) {
  const rows = [];
  Object.keys(roles).forEach((token) => {
    const rule = roles[token].check;
    if (!rule || rule.min <= 1) return;
    rule.against.forEach((against) => {
      const fg = theme.colors[token];
      const bg = theme.colors[against];
      if (!isHex(fg) || !isHex(bg)) return;
      const ratio = contrast(fg, bg);
      rows.push({ token, against, ratio, min: rule.min, pass: ratio >= rule.min });
    });
  });
  return rows;
}

