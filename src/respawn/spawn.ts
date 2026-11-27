// spawn(): builds real DOM from the same props shape as Respawn's Spawn
// ({ tag, className, events, style, children, ...attrs }), with no dependency
// on Respawn. What it adds, so the output matches what React renders:
//  - null, undefined, true and false children render nothing (React's rule);
//  - any DOM node passes through (Respawn's Spawn passes only HTMLElements);
//  - onClick and other on<Event> functions become event listeners, like
//    `events: { click }`; both get (event, el);
//  - style numbers get px the way React adds them (not for opacity, zIndex,
//    flex… or custom properties), and styles go through el.style, as in React;
//  - data-* and aria-* attributes write true/false as "true"/"false"; other
//    attributes treat true as present and false as absent.

/** Something to render: text, a DOM node, nested spawn props, or a list of them. */
export type Child = string | number | boolean | null | undefined | Node | SpawnProps | Child[];

/** An event listener: gets the event and the element it is on. */
export type Listener<E extends Event = Event> = (event: E, el: HTMLElement) => void;

/** `events: { click: (event, el) => … }`, as in Respawn's Spawn. */
export type Events = { [K in keyof HTMLElementEventMap]?: Listener<HTMLElementEventMap[K]> } & {
  [type: string]: Listener<any> | undefined;
};

/** Inline styles: camelCase or kebab-case names, custom properties (--x) too. Numbers get px where CSS needs a unit. */
export type Style = { [name: string]: string | number | null | undefined };

/** What every component's root element accepts besides its own props: HTML attributes and listeners. */
export interface ElementProps {
  /** Your class name; it comes first: class="yours <component> nurvus". */
  className?: string;
  /** Inline styles, as an object or a CSS string. */
  style?: Style | string;
  /** Event listeners by event type, as in Respawn: `{ click: (event, el) => … }`. */
  events?: Events;
  /** on<Event> listeners, e.g. onClick, onMouseEnter. */
  [handler: `on${string}`]: ((...args: any[]) => void) | undefined;
  /** Any other HTML attribute: id, title, disabled, aria-label, data-*… */
  [attribute: string]: unknown;
}

/** Respawn's props shape: the element to make, its attributes, listeners and children. */
export interface SpawnProps extends ElementProps {
  /** The element to create. Defaults to 'div'. */
  tag?: string;
  /** What goes inside. A function is called with the element instead. */
  children?: Child | ((el: HTMLElement) => void);
  /** Appends the new element to this one. */
  mountEl?: Element;
}

const SKIP = new Set(['tag', 'children', 'className', 'events', 'style', 'mountEl', 'key', 'ref']);
const RENAME: Record<string, string> = { htmlFor: 'for', acceptCharset: 'accept-charset', httpEquiv: 'http-equiv' };
// Attributes whose value is the text "true" / "false" (React writes these as such).
const BOOLEANISH = new Set(['draggable', 'spellcheck', 'contenteditable']);
// Style properties React leaves unitless when given a number.
const UNITLESS = new Set([
  'animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth',
  'columnCount', 'columns', 'fillOpacity', 'flex', 'flexGrow', 'flexShrink', 'floodOpacity', 'fontWeight',
  'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart',
  'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'stopOpacity', 'strokeDasharray',
  'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'widows', 'zIndex', 'zoom',
]);

const isNode = (value: unknown): value is Node => typeof Node !== 'undefined' && value instanceof Node;

/** 'backgroundColor' -> 'background-color', 'WebkitTransition' -> '-webkit-transition'. */
const cssName = (name: string) => (name.startsWith('--') || name.includes('-')
  ? name
  : name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`).replace(/^(webkit|moz|ms|o)-/, '-$1-'));

function applyStyle(el: HTMLElement, style: Style | string) {
  if (typeof style === 'string') {
    el.setAttribute('style', style);
    return;
  }
  Object.keys(style).forEach((name) => {
    const value = style[name];
    if (value === null || value === undefined || typeof value === 'boolean' || value === '') return;
    const custom = name.startsWith('--');
    const text = typeof value === 'number' && value !== 0 && !custom && !UNITLESS.has(name) ? `${value}px` : String(value).trim();
    el.style.setProperty(cssName(name), text);
  });
}

function applyAttribute(el: HTMLElement, key: string, value: unknown) {
  if (value === null || value === undefined) return;
  // onClick, onMouseEnter… : listeners, like events: { click, mouseenter }.
  if (typeof value === 'function') {
    if (/^on[A-Z]/.test(key)) {
      const type = key === 'onDoubleClick' ? 'dblclick' : key.slice(2).toLowerCase();
      el.addEventListener(type, (event) => value(event, el));
    }
    return;
  }
  if (typeof value === 'object') return;
  const name = RENAME[key] || key;
  const lower = name.toLowerCase();
  if (typeof value === 'boolean') {
    if (lower.startsWith('data-') || lower.startsWith('aria-') || BOOLEANISH.has(lower)) el.setAttribute(name, String(value));
    else if (value) el.setAttribute(name, '');
    return;
  }
  el.setAttribute(name, String(value));
}

/** Appends `child` (any Child) to `parent`. */
export function append(parent: Node, child: Child) {
  if (child === null || child === undefined || typeof child === 'boolean') return;
  if (Array.isArray(child)) {
    child.forEach((c) => append(parent, c));
    return;
  }
  parent.appendChild(toNode(child));
}

/** One Child as a single DOM node (a list becomes a fragment; nothing becomes an empty fragment). */
export function toNode(child: Child): Node {
  if (child === null || child === undefined || typeof child === 'boolean') return document.createDocumentFragment();
  if (typeof child === 'string' || typeof child === 'number') return document.createTextNode(String(child));
  if (isNode(child)) return child;
  if (Array.isArray(child)) {
    const fragment = document.createDocumentFragment();
    append(fragment, child);
    return fragment;
  }
  return spawn(child);
}

/**
 * Builds an element from Respawn-style props and returns it.
 *
 *   spawn({ tag: 'p', className: 'note', children: ['Saved ', spawn({ tag: 'b', children: 'now' })] })
 *   spawn({ tag: 'button', events: { click: (event, el) => el.remove() }, children: 'Remove' })
 *
 * An element passed in comes back as it is, so components and your own
 * elements mix freely in children.
 */
export function spawn<E extends HTMLElement = HTMLElement>(props: SpawnProps | HTMLElement = {}): E {
  if (isNode(props)) return props as E;
  const { tag = 'div', children, className, events, style, mountEl } = props;
  const el = document.createElement(tag) as E;
  if (className) el.setAttribute('class', className);
  Object.keys(props).forEach((key) => { if (!SKIP.has(key)) applyAttribute(el, key, props[key]); });
  if (style) applyStyle(el, style);
  if (events) {
    Object.keys(events).forEach((type) => {
      const listener = events[type];
      if (listener) el.addEventListener(type, (event) => listener(event, el));
    });
  }
  if (typeof children === 'function') children(el);
  else append(el, children);
  if (mountEl) mountEl.appendChild(el);
  return el;
}
