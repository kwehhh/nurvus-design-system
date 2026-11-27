/**
 * How a contrast row reads in the docs: the ratio to 2 decimals, which WCAG
 * success criterion it falls under, and the highest level it meets.
 * Rows are what checkTheme() in tools/contrast.mjs returns.
 */

/**
 * The ratio to 2 decimals. A failing ratio is rounded down, so 4.497 shows
 * as 4.49, never as a 4.50 that looks like a pass.
 */
export function formatRatio(ratio, min) {
  const shown = ratio.toFixed(2);
  if (min !== undefined && ratio < min && Number(shown) >= min) return (Math.floor(ratio * 100) / 100).toFixed(2);
  return shown;
}

/**
 * 'text' (SC 1.4.3) or 'non-text' (SC 1.4.11). A role is text when it must
 * reach 4.5:1 or sits in the Text group (text-subtle, held to 3:1).
 */
export function kindOf(token, roles) {
  const role = roles[token];
  return role.check.min >= 4.5 || role.group === 'Text' ? 'text' : 'non-text';
}

/** "SC 1.4.3" or "SC 1.4.11". */
export const criterionOf = (kind) => (kind === 'text' ? 'SC 1.4.3' : 'SC 1.4.11');

/**
 * The highest WCAG level a row meets. Text: AAA (7:1), AA (4.5:1), AA large
 * (3:1, large text only) or Fail. Non-text has one level: AA (3:1) or Fail.
 */
export function levelOf(ratio, kind) {
  if (kind === 'non-text') return ratio >= 3 ? 'AA' : 'Fail';
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large';
  return 'Fail';
}
