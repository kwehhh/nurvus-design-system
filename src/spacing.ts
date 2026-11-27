// Layout's spacing on the 4px grid. No React here, so the React Layout and the
// Respawn Layout share it.

/** A step of the 4px spacing grid (the --space--N tokens). */
export type Spacing = 0 | 2 | 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64;
/** Values from before the grid. Still accepted: each snaps to a grid step, with a console warning. */
export type LegacySpacing = 10 | 13 | 20 | 30 | 40;

/** Where each pre-grid value lands: the nearest step, ties going down (20 → 16, 40 → 32). */
export const LEGACY_SPACING: Record<LegacySpacing, Spacing> = { 10: 8, 13: 12, 20: 16, 30: 32, 40: 32 };
const warned = new Set<number>();

/** The grid step to use for `value`; warns once per pre-grid value. */
export function toGrid(value: Spacing | LegacySpacing): Spacing {
  const snapped = LEGACY_SPACING[value as LegacySpacing];
  if (snapped === undefined) return value as Spacing;
  if (!warned.has(value)) {
    warned.add(value);
    // eslint-disable-next-line no-console
    console.warn(`@nurvus/ui Layout: itemSpacing={${value}} is off the 4px grid; using ${snapped}. Pass ${snapped} to keep this look.`);
  }
  return snapped;
}
