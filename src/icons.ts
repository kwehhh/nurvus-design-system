// The NURVUS icons, drawn for this library (no icon font, no third-party set).
// Shared by the React and the Respawn Icon (no React here).
//
// The grid: a 24 x 24 artboard with 2 units of padding (a 20 x 20 live area),
// 2-unit strokes with round caps and joins, corners of radius 2, circles of
// radius 9. Every shape is a stroke in currentColor unless it says otherwise,
// so an icon takes the color of the text around it. Icons are 1em by default:
// next to 16px text they are 16px, in a 22px title 22px.

/** One SVG element of an icon: its tag and attributes. */
export type IconNode = [tag: 'path' | 'circle' | 'rect', attrs: Record<string, string | number>];

const path = (d: string): IconNode => ['path', { d }];
const circle = (cx: number, cy: number, r: number): IconNode => ['circle', { cx, cy, r }];
const rect = (x: number, y: number, width: number, height: number, rx = 2): IconNode => ['rect', { x, y, width, height, rx }];
const ring = circle(12, 12, 9);
const dot = (x: number, y: number) => path(`M${x} ${y}h.01`);

const DEFS = {
  // Navigation
  menu: [path('M4 6h16M4 12h16M4 18h16')],
  close: [path('M6 6l12 12M18 6L6 18')],
  'chevron-down': [path('M6 9l6 6 6-6')],
  'chevron-up': [path('M6 15l6-6 6 6')],
  'chevron-left': [path('M15 6l-6 6 6 6')],
  'chevron-right': [path('M9 6l6 6-6 6')],
  'arrow-left': [path('M19 12H5M11 6l-6 6 6 6')],
  'arrow-right': [path('M5 12h14M13 6l6 6-6 6')],
  'arrow-up': [path('M12 19V5M6 11l6-6 6 6')],
  'arrow-down': [path('M12 5v14M6 13l6 6 6-6')],
  'external-link': [path('M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4')],
  // Actions
  add: [path('M12 5v14M5 12h14')],
  remove: [path('M5 12h14')],
  edit: [path('M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16v4z'), path('M13.5 6.5l4 4')],
  copy: [rect(8, 8, 12, 12), path('M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2')],
  delete: [path('M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6M14 11v6')],
  download: [path('M12 4v11M7 10l5 5 5-5M4 20h16')],
  upload: [path('M12 15V4M7 9l5-5 5 5M4 20h16')],
  search: [circle(11, 11, 6.5), path('M16 16l4 4')],
  filter: [path('M4 5h16l-6 7.5V19l-4 2v-8.5z')],
  sliders: [path('M4 7h10M18 7h2M4 17h4M12 17h8'), circle(16, 7, 2), circle(10, 17, 2)],
  refresh: [path('M19 12a7 7 0 1 1-7-7'), path('M9.5 2.5L12 5l-2.5 2.5')],
  undo: [path('M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11')],
  redo: [path('M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13')],
  // Status
  check: [path('M5 12.5l4.5 4.5L19 7.5')],
  info: [ring, path('M12 11v5'), dot(12, 8)],
  warning: [path('M10.27 4.3L2.6 18a2 2 0 0 0 1.73 3h15.34a2 2 0 0 0 1.73-3L13.73 4.3a2 2 0 0 0-3.46 0z'), path('M12 9.5v4'), dot(12, 17)],
  error: [ring, path('M15 9l-6 6M9 9l6 6')],
  help: [ring, path('M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.4'), dot(12, 17)],
  // Things
  file: [path('M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z'), path('M14 3v5h5')],
  folder: [path('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')],
  image: [rect(3, 4, 18, 16), circle(9, 10, 1.5), path('M21 15l-5-5L6 20')],
  layers: [path('M12 3l9 5-9 5-9-5z'), path('M3 13l9 5 9-5')],
  eye: [path('M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z'), circle(12, 12, 3)],
  'eye-off': [path('M3 3l18 18'), path('M10.6 6.1A9.7 9.7 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-2.6 3.4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 6 10 6a9.7 9.7 0 0 0 5.4-1.6'), path('M9.9 9.9a3 3 0 0 0 4.2 4.2')],
  lock: [rect(5, 11, 14, 10), path('M8 11V8a4 4 0 0 1 8 0v3')],
  unlock: [rect(5, 11, 14, 10), path('M8 11V8a4 4 0 0 1 7.75-1.4')],
  link: [path('M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1'), path('M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1')],
  // Theme
  sun: [circle(12, 12, 4), path('M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41')],
  moon: [path('M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z')],
  // Code
  code: [path('M8 7l-5 5 5 5M16 7l5 5-5 5')],
  terminal: [path('M4 17l6-5-6-5M12 19h8')],
};

/** Every icon's name. */
export type IconName = keyof typeof DEFS;

/** Every icon: its name and the shapes it is drawn with. */
export const ICONS: Record<IconName, IconNode[]> = DEFS;

/** The names, in the order above (groups: navigation, actions, status, things, theme, code). */
export const ICON_NAMES = Object.keys(DEFS) as IconName[];

let warned = '';
/** An unknown name draws an empty icon and says so once. */
export function iconNodes(name: string): IconNode[] {
  const nodes = (ICONS as Record<string, IconNode[]>)[name];
  if (!nodes && warned !== name && typeof console !== 'undefined') {
    warned = name;
    console.warn(`[@nurvus/ui] Icon: there is no icon named "${name}". The names: ${ICON_NAMES.join(', ')}.`);
  }
  return nodes || [];
}
