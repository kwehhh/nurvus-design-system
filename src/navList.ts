// NavList rules shared by the React and the Respawn NavList (no React here).

/** A section's id: its own, or its title as a slug ("Get started" -> "get-started"). */
export const sectionId = (section: { id?: string; title: unknown }): string =>
  section.id || String(section.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Whether a section starts open: true / false for all, or a map of id -> open (missing = open). */
export const startsOpen = (defaultOpen: boolean | Record<string, boolean> | undefined, id: string): boolean =>
  typeof defaultOpen === 'boolean' ? defaultOpen : !defaultOpen || defaultOpen[id] !== false;
