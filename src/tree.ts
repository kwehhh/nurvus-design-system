// Tree rules shared by the React and the Respawn Tree (no React here): the
// keys of the WAI-ARIA tree pattern, for rows that sit flat in the DOM with
// their depth in aria-level.

const level = (row: HTMLElement) => Number(row.getAttribute('aria-level')) || 1;

/**
 * Moves focus like the WAI-ARIA tree pattern, with one row in the tab order
 * at a time (roving tabindex):
 *  - Up / Down: the previous / next row; Home / End: the first / last;
 *  - Right: the first child row; Left: the parent row;
 *  - Enter / Space: selects the row (the same as a click).
 * Returns true when it used the key.
 */
export function treeKeydown(event: KeyboardEvent, tree: HTMLElement): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey) return false;
  const rows = Array.from(tree.querySelectorAll<HTMLElement>('[role="treeitem"]'));
  const row = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
  // Keys typed into something inside a row (a button in a custom row) are its own.
  if (!row || row !== event.target) return false;
  const at = rows.indexOf(row);
  let next: HTMLElement | undefined;

  switch (event.key) {
    case 'ArrowDown': next = rows[at + 1]; break;
    case 'ArrowUp': next = rows[at - 1]; break;
    case 'Home': next = rows[0]; break;
    case 'End': next = rows[rows.length - 1]; break;
    case 'ArrowRight': next = rows[at + 1] && level(rows[at + 1]) > level(row) ? rows[at + 1] : undefined; break;
    case 'ArrowLeft':
      for (let i = at - 1; i >= 0; i -= 1) if (level(rows[i]) < level(row)) { next = rows[i]; break; }
      break;
    case 'Enter':
    case ' ':
      row.click();
      event.preventDefault();
      return true;
    default: return false;
  }
  event.preventDefault();
  if (next) {
    rows.forEach((r) => r.setAttribute('tabindex', r === next ? '0' : '-1'));
    next.focus();
  }
  return true;
}
