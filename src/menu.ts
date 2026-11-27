// Menu rules shared by the React and the Respawn Menu (no React here): the
// section ids, which sections start open, and the arrow keys.

/** A section's id: its own, or its title as a slug ("Get started" -> "get-started"). */
export const sectionId = (section: { id?: string; title: unknown }): string =>
  section.id || String(section.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Whether a section starts open: true / false for all, or a map of id -> open (missing = open). */
export const startsOpen = (defaultOpen: boolean | Record<string, boolean> | undefined, id: string): boolean =>
  typeof defaultOpen === 'boolean' ? defaultOpen : !defaultOpen || defaultOpen[id] !== false;

let warnedOldProps = false;
/** Menu used to be the nested, selectable list that is Tree now: say so once. */
export function warnOldMenuProps(props: { sections?: unknown; items?: unknown; activePath?: unknown }): boolean {
  const old = !props.sections && (props.items !== undefined || props.activePath !== undefined);
  if (old && !warnedOldProps && typeof console !== 'undefined') {
    warnedOldProps = true;
    console.warn('[@nurvus/ui] Menu is site navigation now (sections of links). The nested, selectable list it used to be is Tree: import { Tree } from \'@nurvus/ui\'. Drawing a Tree for now.');
  }
  return old;
}

/**
 * The arrow keys on a Menu (the WAI-ARIA disclosure navigation pattern's
 * optional keys). Tab still goes link by link; on top of that:
 *  - Up / Down: the previous / next row (section titles and the links in open
 *    sections), going round at the ends;
 *  - Home / End: the first / last row;
 *  - Right on a section: opens it, or (when open) goes to its first link;
 *  - Left on a section: closes it; Left on a link: goes up to its section.
 * Returns true when it used the key.
 */
export function menuKeydown(event: KeyboardEvent, nav: HTMLElement): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;
  const target = event.target as HTMLElement;
  const rows = Array.from(nav.querySelectorAll<HTMLElement>('.menu-title, .menu-item'))
    .filter((row) => !row.closest('.menu-section[data-open="false"] .menu-items'));
  if (!rows.length) return false;
  const section = target.closest<HTMLElement>('.menu-section');
  // The chevron beside a linked title counts as that title's row.
  const onHeading = !!target.closest('.menu-heading');
  const title = section && section.querySelector<HTMLElement>('.menu-title');
  const at = rows.indexOf(onHeading && title ? title : target);
  const focus = (row: HTMLElement | undefined) => { if (row) row.focus(); };
  const toggle = () => { const button = section && section.querySelector<HTMLElement>('.menu-toggle'); if (button) button.click(); };
  const isOpen = !!section && section.getAttribute('data-open') !== 'false';

  switch (event.key) {
    case 'ArrowDown': focus(rows[(at + 1) % rows.length]); break;
    case 'ArrowUp': focus(rows[at <= 0 ? rows.length - 1 : at - 1]); break;
    case 'Home': focus(rows[0]); break;
    case 'End': focus(rows[rows.length - 1]); break;
    case 'ArrowRight':
      if (!onHeading || !section) return false;
      if (!isOpen) toggle();
      else focus(section.querySelector<HTMLElement>('.menu-item') || undefined);
      break;
    case 'ArrowLeft':
      if (!section) return false;
      if (onHeading) { if (isOpen) toggle(); } else focus(title || undefined);
      break;
    default: return false;
  }
  event.preventDefault();
  return true;
}
