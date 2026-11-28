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
// A shape may fill (fill: 'currentColor'): only `contrast` does, for its filled half.

const path = (d: string): IconNode => ['path', { d }];
const circle = (cx: number, cy: number, r: number): IconNode => ['circle', { cx, cy, r }];
const rect = (x: number, y: number, width: number, height: number, rx = 2): IconNode => ['rect', { x, y, width, height, rx }];
const ring = circle(12, 12, 9);
const dot = (x: number, y: number) => path(`M${x} ${y}h.01`);
const bead = (x: number, y: number) => circle(x, y, 1); // a bigger dot: r 1 + the 2-unit line = 4 across

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
  home: [path('M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2z')],
  'panel-left': [rect(3, 4, 18, 16), path('M9 4v16')],
  'more-horizontal': [bead(5, 12), bead(12, 12), bead(19, 12)],
  'more-vertical': [bead(12, 5), bead(12, 12), bead(12, 19)],
  maximize: [path('M14 4h6v6M10 20H4v-6M20 4l-6 6M4 20l6-6')],
  minimize: [path('M4 14h6v6M20 10h-6V4M14 10l6-6M4 20l6-6')],
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
  settings: [path('M10.01 5.29L10.51 2.62L13.49 2.62L13.99 5.29L15.34 5.85L17.58 4.31L19.69 6.42L18.15 8.66L18.71 10.01L21.38 10.51L21.38 13.49L18.71 13.99L18.15 15.34L19.69 17.58L17.58 19.69L15.34 18.15L13.99 18.71L13.49 21.38L10.51 21.38L10.01 18.71L8.66 18.15L6.42 19.69L4.31 17.58L5.85 15.34L5.29 13.99L2.62 13.49L2.62 10.51L5.29 10.01L5.85 8.66L4.31 6.42L6.42 4.31L8.66 5.85z'), circle(12, 12, 3)],
  share: [circle(18, 5, 2.5), circle(6, 12, 2.5), circle(18, 19, 2.5), path('M8.2 13.3l7.6 4.4M15.8 6.3l-7.6 4.4')],
  play: [path('M7 4.5l12.5 7.5L7 19.5z')],
  pause: [path('M8 5v14M16 5v14')],
  'sign-out': [path('M10 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4M15 16l4-4-4-4M19 12H9')],
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
  user: [circle(12, 8, 4), path('M4 21a8 8 0 0 1 16 0')],
  users: [circle(9, 8, 3.5), path('M2 20a7 7 0 0 1 14 0'), path('M15.5 4.6a3.5 3.5 0 0 1 0 6.8M18 13.6a7 7 0 0 1 4 6.4')],
  mail: [rect(3, 5, 18, 14), path('M3 7.5l9 6 9-6')],
  bell: [path('M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z'), path('M10 21a2 2 0 0 0 4 0')],
  calendar: [rect(3, 5, 18, 16), path('M3 10h18M8 3v4M16 3v4')],
  clock: [ring, path('M12 7v5l3 2')],
  globe: [ring, path('M3 12h18'), path('M12 3c-2.5 2.5-3.8 5.5-3.8 9s1.3 6.5 3.8 9c2.5-2.5 3.8-5.5 3.8-9S14.5 5.5 12 3z')],
  'map-pin': [path('M12 21s-7-6-7-11.5a7 7 0 0 1 14 0C19 15 12 21 12 21z'), circle(12, 9.5, 2.5)],
  tag: [path('M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z'), dot(8, 8)],
  bookmark: [path('M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4z')],
  star: [path('M12 3.3L14.47 9.4L21.04 9.86L15.99 14.1L17.58 20.49L12 17L6.42 20.49L8.01 14.1L2.96 9.86L9.53 9.4z')],
  heart: [path('M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4C20 15.4 12 20 12 20z')],
  grid: [rect(4, 4, 6, 6, 1), rect(14, 4, 6, 6, 1), rect(4, 14, 6, 6, 1), rect(14, 14, 6, 6, 1)],
  list: [path('M9 6h11M9 12h11M9 18h11'), dot(4.5, 6), dot(4.5, 12), dot(4.5, 18)],
  link: [path('M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1'), path('M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1')],
  // Theme
  sun: [circle(12, 12, 4), path('M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41')],
  moon: [path('M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z')],
  contrast: [ring, ['path', { d: 'M12 3a9 9 0 0 1 0 18z', fill: 'currentColor' }] as IconNode],
  palette: [path('M12 3a9 9 0 0 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-1-.9-1.4-.9-2.4 0-.9.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3z'), dot(7.5, 11.5), dot(9.5, 7.5), dot(14.5, 7.5)],
  sparkles: [path('M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6z'), path('M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z')],
  zap: [path('M13 2.5L4.5 13.5H11l-1 8 8.5-11H12z')],
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
