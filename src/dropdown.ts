// Dropdown rules shared by the React and the Respawn Dropdown (no React here):
// the WAI-ARIA menu button pattern's keys and focus.

/** The menu's items, in order. */
export const menuItems = (root: HTMLElement): HTMLElement[] => Array.from(root.querySelectorAll<HTMLElement>('.dropdown-popup [role="menuitem"]'));

/** Moves focus to the first or last item (and makes it the menu's Tab stop). */
export function focusItem(root: HTMLElement, which: 'first' | 'last'): void {
  const items = menuItems(root);
  const item = which === 'first' ? items[0] : items[items.length - 1];
  if (!item) return;
  items.forEach((i) => i.setAttribute('tabindex', i === item ? '0' : '-1'));
  item.focus();
}

/**
 * Keys on the button: ↓ (or Enter / Space, which click it) opens the menu on
 * its first item, ↑ on its last. Returns which item to focus, or null.
 */
export function triggerKey(event: KeyboardEvent): 'first' | 'last' | null {
  if (event.key === 'ArrowDown') return 'first';
  if (event.key === 'ArrowUp') return 'last';
  return null;
}
