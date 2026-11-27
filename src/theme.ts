import { themes, DEFAULT_THEME, Theme } from './themes';

/** localStorage key that remembers the chosen theme. */
export const THEME_STORAGE_KEY = 'nurvus.theme';

/** Fired on the themed element (bubbles) after setTheme; detail = the theme. */
export const THEME_CHANGE_EVENT = 'nurvus:themechange';

export interface SetThemeOptions {
  /** The element to theme. Defaults to <html>; any element themes just that part of the page. */
  root?: HTMLElement;
  /** Save it as the visitor's choice (localStorage). Defaults to true. */
  persist?: boolean;
}

/** A theme object by id, or undefined. */
export function getTheme(id: string | null | undefined): Theme | undefined {
  return themes.find((theme) => theme.id === id);
}

/** The theme currently applied to `root` (defaults to <html>). */
export function currentTheme(root: HTMLElement = document.documentElement): Theme {
  return (getTheme(root.getAttribute('data-theme')) || getTheme(DEFAULT_THEME)) as Theme;
}

const warned = new Set<string>();

/**
 * Only Apollo White ships in the core CSS; every other theme is its own file
 * (`import '@nurvus/ui/themes/tokyo-neon.css'`). Each theme block sets
 * --nv-theme-id, so after applying a theme we can tell whether its CSS is on
 * the page, and say which file to import when it isn't.
 */
function warnIfNotLoaded(root: HTMLElement, id: string) {
  if (warned.has(id) || typeof getComputedStyle !== 'function') return;
  const applied = getComputedStyle(root).getPropertyValue('--nv-theme-id').trim();
  if (applied && applied !== id) {
    warned.add(id);
    // eslint-disable-next-line no-console
    console.warn(`@nurvus/ui: the "${id}" theme's CSS isn't loaded, so the page still shows "${applied}". Add: import '@nurvus/ui/themes/${id}.css';`);
  }
}

/**
 * Apply a theme. Sets data-theme on `root` (default <html>), which swaps every
 * --nv-* custom property underneath it. Pass any element as `root` to theme
 * just that part of the page; themes nest.
 *
 *   setTheme('tokyo-neon');
 *   setTheme('apollo-white', { root: sidebarEl, persist: false });
 */
export function setTheme(id: string, { root = document.documentElement, persist = true }: SetThemeOptions = {}): Theme {
  const theme = getTheme(id);
  if (!theme) throw new Error(`@nurvus/ui: unknown theme "${id}". Known: ${themes.map((t) => t.id).join(', ')}`);
  root.setAttribute('data-theme', theme.id);
  if (persist) {
    try { window.localStorage.setItem(THEME_STORAGE_KEY, theme.id); } catch (e) { /* storage blocked */ }
  }
  warnIfNotLoaded(root, theme.id);
  root.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme, bubbles: true }));
  return theme;
}

/**
 * Apply the saved theme, or `fallback` when nothing (valid) is saved. Only
 * needed for a default other than Apollo White set from code: the package
 * already restores a saved theme by itself when it loads.
 */
export function initTheme(fallback: string = DEFAULT_THEME, options: SetThemeOptions = {}): Theme {
  let saved: string | null = null;
  try { saved = window.localStorage.getItem(THEME_STORAGE_KEY); } catch (e) { /* storage blocked */ }
  return setTheme(getTheme(saved) ? (saved as string) : fallback, { persist: false, ...options });
}

/**
 * Runs once, when the package is imported: brings back the visitor's saved
 * theme (whatever setTheme saved last time), so an app needs no theme code at
 * all. Nothing saved: nothing changes, and the page shows its own data-theme,
 * or Apollo White when it has none (the CSS default). Skipped outside a
 * browser (server rendering).
 */
function restoreSavedTheme() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  let saved: string | null = null;
  try { saved = window.localStorage.getItem(THEME_STORAGE_KEY); } catch (e) { return; /* storage blocked */ }
  if (saved && getTheme(saved)) document.documentElement.setAttribute('data-theme', saved);
}

restoreSavedTheme();

export { themes, DEFAULT_THEME };
export type { Theme };
