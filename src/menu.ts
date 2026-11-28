// Menu rules shared by the React and the Respawn Menu (no React here): which
// kind of menu the props make, the section ids, which sections start open,
// and the keys.

/**
 * What a Menu is, and so what screen readers hear:
 *  - 'nav': navigation. A <nav> landmark of links ("link", "current page");
 *    an item without an href is a button in it ("button").
 *  - 'actions': a menu of commands (the WAI-ARIA menu pattern): role="menu",
 *    each item a "menu item"; one Tab stop, the arrow keys move.
 *  - 'tree': a tree to pick from (the WAI-ARIA tree pattern), like layers:
 *    "tree", each row "level 2, 3 of 5, selected". Drawn by Tree.
 */
export type MenuKind = 'nav' | 'actions' | 'tree';

interface KindProps {
  kind?: MenuKind;
  sections?: { href?: string; items?: { href?: string }[] }[];
  items?: unknown;
  activePath?: unknown;
}

/**
 * The kind to draw: `kind` when given; else a tree for Tree's props (items,
 * activePath), navigation when any item is a link, a menu of actions when
 * none is.
 */
export function menuKind(props: KindProps): MenuKind {
  if (props.kind) return props.kind;
  if (!props.sections && (props.items !== undefined || props.activePath !== undefined)) return 'tree';
  const sections = props.sections || [];
  const links = sections.some((s) => s.href !== undefined || (s.items || []).some((item) => item.href !== undefined));
  return links || !sections.length ? 'nav' : 'actions';
}

/** A section's id: its own, or its title as a slug ("Get started" -> "get-started"). */
export const sectionId = (section: { id?: string; title?: unknown }): string =>
  section.id || String(section.title ?? 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Whether a section starts open: true / false for all, or a map of id -> open (missing = open). */
export const startsOpen = (defaultOpen: boolean | Record<string, boolean> | undefined, id: string): boolean =>
  typeof defaultOpen === 'boolean' ? defaultOpen : !defaultOpen || defaultOpen[id] !== false;

/** Makes `row` the one item of an actions menu that Tab reaches (roving tabindex). */
export function roveTo(menu: HTMLElement, row: HTMLElement): void {
  menu.querySelectorAll<HTMLElement>('[role="menuitem"]').forEach((item) => item.setAttribute('tabindex', item === row ? '0' : '-1'));
}

/** Focus moved onto an item of an actions menu (a click, say): it becomes the Tab stop. */
export function menuFocus(event: FocusEvent, menu: HTMLElement): void {
  const row = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
  if (row && menu.getAttribute('role') === 'menu') roveTo(menu, row);
}

/**
 * The keys on a Menu. Up / Down move to the previous / next item (going round
 * at the ends) and Home / End to the first / last, in every kind.
 *  - Navigation (the WAI-ARIA disclosure navigation pattern, with its
 *    optional keys): Tab still goes link by link. The rows are the section
 *    titles and the links in open sections; Right on a section opens it, or
 *    goes to its first link; Left closes it, or goes from a link up to its
 *    section. Enter follows a link; Enter or Space opens a section.
 *  - Actions (the WAI-ARIA menu pattern): one Tab stop that follows the
 *    focus; typing a letter goes to the next item starting with it; Enter or
 *    Space runs the item.
 * Returns true when it used the key.
 */
export function menuKeydown(event: KeyboardEvent, nav: HTMLElement): boolean {
  if (event.altKey || event.ctrlKey || event.metaKey) return false;
  return nav.getAttribute('role') === 'menu' ? actionsKeydown(event, nav) : navKeydown(event, nav);
}

function actionsKeydown(event: KeyboardEvent, menu: HTMLElement): boolean {
  const rows = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  const target = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
  if (!rows.length || !target) return false;
  const at = rows.indexOf(target);
  let next: HTMLElement | undefined;
  switch (event.key) {
    case 'ArrowDown': next = rows[(at + 1) % rows.length]; break;
    case 'ArrowUp': next = rows[at <= 0 ? rows.length - 1 : at - 1]; break;
    case 'Home': next = rows[0]; break;
    case 'End': next = rows[rows.length - 1]; break;
    default:
      // Type to find: the next item whose text starts with the letter.
      if (event.key.length === 1 && !event.shiftKey && /\S/.test(event.key)) {
        const key = event.key.toLowerCase();
        for (let i = 1; i <= rows.length; i += 1) {
          const row = rows[(at + i) % rows.length];
          if ((row.textContent || '').trim().toLowerCase().startsWith(key)) { next = row; break; }
        }
        if (!next) return false;
        break;
      }
      return false;
  }
  event.preventDefault();
  roveTo(menu, next);
  next.focus();
  return true;
}

function navKeydown(event: KeyboardEvent, nav: HTMLElement): boolean {
  if (event.shiftKey) return false;
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
