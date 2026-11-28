// The breakpoints: where layouts change as the screen widens. In em, so they
// follow the reader's text size (at the default 16px: 640, 768, 1024, 1280).
// Shared by Grid, Stack and your own code (no React here).

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Each breakpoint's min-width: from this width up, the `sm`/`md`/`lg`/`xl` value applies. */
export const BREAKPOINTS: Record<Breakpoint, string> = { sm: '40em', md: '48em', lg: '64em', xl: '80em' };

/** A value for every width (`base`), changing from a breakpoint up: { base: 1, md: 2, lg: 3 }. */
export type Responsive<T> = T | ({ base?: T } & Partial<Record<Breakpoint, T>>);

/** `true` once the window is at least as wide as `breakpoint` (for your own code). */
export const isAtLeast = (breakpoint: Breakpoint): boolean =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]})`).matches;

/**
 * The data attributes for a responsive value: data-<name>="base value" and
 * data-<name>-md="…" for each breakpoint given. The CSS reads them.
 */
export function responsiveData<T>(name: string, value: Responsive<T> | undefined): Record<string, T | undefined> {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object') return { [`data-${name}`]: value as T };
  const v = value as { base?: T } & Partial<Record<Breakpoint, T>>;
  const out: Record<string, T | undefined> = { [`data-${name}`]: v.base };
  (Object.keys(BREAKPOINTS) as Breakpoint[]).forEach((bp) => { if (v[bp] !== undefined) out[`data-${name}-${bp}`] = v[bp]; });
  return out;
}
