import { themes, DEFAULT_THEME } from './themes';

/** localStorage key that remembers the chosen theme. */
export const THEME_STORAGE_KEY = 'nurvus.theme';

/** Fired on the themed element (bubbles) after setTheme; detail = the theme. */
export const THEME_CHANGE_EVENT = 'nurvus:themechange';

/** A theme object by id, or undefined. */
export function getTheme(id) {
  return themes.find((theme) => theme.id === id);
}

/** The theme currently applied to `root` (defaults to <html>). */
export function currentTheme(root = document.documentElement) {
  return getTheme(root.getAttribute('data-theme')) || getTheme(DEFAULT_THEME);
}

/**
 * Apply a theme. Sets data-theme on `root` (default <html>), which swaps every
 * --nv-* custom property underneath it. Pass any element as `root` to theme
 * just that part of the page; themes nest.
 *
 *   setTheme('tokyo-neon');
 *   setTheme('apollo-white', { root: sidebarEl, persist: false });
 */
export function setTheme(id, { root = document.documentElement, persist = true } = {}) {
  const theme = getTheme(id);
  if (!theme) throw new Error(`@nurvus/ui: unknown theme "${id}". Known: ${themes.map((t) => t.id).join(', ')}`);
  root.setAttribute('data-theme', theme.id);
  if (persist) {
    try { window.localStorage.setItem(THEME_STORAGE_KEY, theme.id); } catch (e) { /* storage blocked */ }
  }
  root.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme, bubbles: true }));
  return theme;
}

/**
 * Apply the saved theme, or `fallback` when nothing (valid) is saved.
 * Call once at startup.
 */
export function initTheme(fallback = DEFAULT_THEME, options = {}) {
  let saved = null;
  try { saved = window.localStorage.getItem(THEME_STORAGE_KEY); } catch (e) { /* storage blocked */ }
  return setTheme(getTheme(saved) ? saved : fallback, { persist: false, ...options });
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
  let saved = null;
  try { saved = window.localStorage.getItem(THEME_STORAGE_KEY); } catch (e) { return; /* storage blocked */ }
  if (getTheme(saved)) document.documentElement.setAttribute('data-theme', saved);
}

restoreSavedTheme();

export { themes, DEFAULT_THEME };
