// Select rules shared by the React and the Respawn Select (no React here):
// the order options are listed in, typing to find one, and what each key does
// (the WAI-ARIA "select-only combobox" pattern).

export interface OptionLike {
  value: string;
  label?: unknown;
  textValue?: string;
  group?: string;
  disabled?: boolean;
}

/** A run of options under one heading ('' = no heading). */
export interface OptionGroup<O> { name: string; options: { option: O; index: number }[] }

/**
 * The options as the list shows them: grouped, groups in the order they first
 * appear. `index` is the place in that order, which the keys move through.
 */
export function groupOptions<O extends OptionLike>(options: O[]): { groups: OptionGroup<O>[]; ordered: O[] } {
  const groups: OptionGroup<O>[] = [];
  options.forEach((option) => {
    const name = option.group || '';
    let group = groups.find((g) => g.name === name);
    if (!group) { group = { name, options: [] }; groups.push(group); }
    group.options.push({ option, index: -1 });
  });
  const ordered: O[] = [];
  groups.forEach((g) => g.options.forEach((entry) => { entry.index = ordered.length; ordered.push(entry.option); }));
  return { groups, ordered };
}

/** The text typing matches: textValue, else a plain-text label, else the value. */
export const optionText = (option: OptionLike): string => (
  option.textValue !== undefined ? option.textValue
    : typeof option.label === 'string' || typeof option.label === 'number' ? String(option.label) : option.value
);

/** The next option that can be picked, `delta` steps away (stops at the ends). */
export function stepOption(options: OptionLike[], from: number, delta: number): number {
  const dir = delta < 0 ? -1 : 1;
  let at = from;
  let found = from;
  for (let moved = 0; moved < Math.abs(delta);) {
    at += dir;
    if (at < 0 || at >= options.length) break;
    if (!options[at].disabled) { found = at; moved += 1; }
  }
  return found;
}

/** The first (or last) option that can be picked, or -1. */
export function edgeOption(options: OptionLike[], last = false): number {
  const list = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  if (!list.length) return -1;
  return last ? list[list.length - 1] : list[0];
}

/**
 * Typing: the next option (after `from`, going round) whose text starts with
 * what was typed. Typing one letter again and again steps through the options
 * that start with it, as a native select does.
 */
export function matchOption(options: OptionLike[], typed: string, from: number): number {
  const query = typed.toLowerCase();
  const same = query.split('').every((c) => c === query[0]);
  const find = (text: string, start: number) => {
    for (let k = 0; k < options.length; k += 1) {
      const i = (start + k) % options.length;
      if (!options[i].disabled && optionText(options[i]).toLowerCase().startsWith(text)) return i;
    }
    return -1;
  };
  // A new search starts at the current option (it may already match); a repeated letter moves on.
  const exact = find(query, query.length > 1 && !same ? Math.max(from, 0) : from + 1);
  if (exact >= 0) return exact;
  return same ? find(query[0], from + 1) : -1;
}

export type SelectAction =
  | { type: 'open'; active: number }
  | { type: 'move'; active: number }
  | { type: 'pick'; active: number }
  | { type: 'close' };

/**
 * What a key does. Closed: ↓ ↑ Enter Space (and Alt+↓) open the list at the
 * picked option; Home / End open it at the first / last. Open: ↓ ↑ Home End
 * Page Up / Page Down move; Enter, Space, Alt+↑ and Tab pick and close; Esc
 * closes without picking. null: not a key the select uses.
 */
export function selectKey(
  key: string,
  altKey: boolean,
  state: { open: boolean; active: number; selected: number },
  options: OptionLike[],
): SelectAction | null {
  const { open, active, selected } = state;
  const start = selected >= 0 && !options[selected].disabled ? selected : edgeOption(options);
  if (!open) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) return { type: 'open', active: start };
    if (key === 'Home') return { type: 'open', active: edgeOption(options) };
    if (key === 'End') return { type: 'open', active: edgeOption(options, true) };
    return null;
  }
  switch (key) {
    case 'ArrowDown': return { type: 'move', active: active < 0 ? start : stepOption(options, active, 1) };
    case 'ArrowUp':
      if (altKey) return { type: 'pick', active };
      return { type: 'move', active: active < 0 ? start : stepOption(options, active, -1) };
    case 'Home': return { type: 'move', active: edgeOption(options) };
    case 'End': return { type: 'move', active: edgeOption(options, true) };
    case 'PageDown': return { type: 'move', active: stepOption(options, Math.max(active, 0), 10) };
    case 'PageUp': return { type: 'move', active: stepOption(options, Math.max(active, 0), -10) };
    case 'Enter':
    case ' ':
    case 'Tab': return { type: 'pick', active };
    case 'Escape': return { type: 'close' };
    default: return null;
  }
}

/** Remembers what was typed for half a second (typeahead). While text is pending, Space is part of the search, not a pick. */
export function typeahead(): { add: (key: string) => string; pending: () => boolean } {
  let text = '';
  let timer: ReturnType<typeof setTimeout> | undefined;
  return {
    add: (key: string) => {
      text += key;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { text = ''; }, 500);
      return text;
    },
    pending: () => text !== '',
  };
}

/** A key that types a character (no Ctrl, Cmd or Alt). */
export const isPrintable = (event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }): boolean =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
