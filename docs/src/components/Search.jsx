import React from 'react';
import { Kbd } from '@nurvus/ui';
import { navSections } from '../nav';
import { getFramework } from '../framework';
import { href } from '../router';

/** Every page the sidebar lists, flat, with the section it belongs to (components in the reader's framework). */
const pages = (framework) => [
  { name: 'Overview', href: href(), group: 'Get started' },
  ...navSections(framework).flatMap((s) => [
    ...(s.href && s.href !== href() ? [{ name: s.name, href: s.href, group: s.name }] : []),
    ...s.items.map((item) => ({ name: item.name, href: item.href, group: s.name, hint: item.hint || '' })),
  ]),
];

const MAX = 8;
const MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Pages matching `query`: names that start with it first, then names, then hints that contain it. */
export function searchPages(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (p) => {
    const name = p.name.toLowerCase();
    if (name.startsWith(q)) return 0;
    if (name.split(/[\s()]+/).some((w) => w.startsWith(q))) return 1;
    if (name.includes(q)) return 2;
    if ((p.hint || '').toLowerCase().includes(q)) return 3;
    return -1;
  };
  return pages(getFramework()).map((p) => ({ p, s: score(p) })).filter((r) => r.s >= 0).sort((a, b) => a.s - b.s).slice(0, MAX).map((r) => r.p);
}

/** The page name with the matched part marked. */
function Highlight({ text, query }) {
  const i = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (!query.trim() || i < 0) return text;
  const end = i + query.trim().length;
  return <>{ text.slice(0, i) }<mark>{ text.slice(i, end) }</mark>{ text.slice(end) }</>;
}

/**
 * Search every page (a WAI-ARIA combobox): type to filter, ↑ / ↓ to move,
 * Enter to open, Esc to close. ⌘K / Ctrl+K or "/" focuses it from anywhere
 * (only the header one listens: `shortcut`).
 */
export default function Search({ id = 'dx-search', shortcut = false, onNavigate, className = '' }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const input = React.useRef(null);
  const results = React.useMemo(() => searchPages(query), [query]);
  const listId = `${id}-list`;
  const optionId = (i) => `${id}-option-${i}`;

  React.useEffect(() => {
    if (!shortcut) return undefined;
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        input.current.focus();
        input.current.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut]);

  const go = (page) => {
    if (!page) return;
    window.location.hash = page.href;
    setQuery('');
    setOpen(false);
    input.current.blur();
    if (onNavigate) onNavigate();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      if (!results.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active] || results[0]);
    } else if (e.key === 'Escape') {
      if (open && query) setOpen(false);
      else { setQuery(''); input.current.blur(); }
    }
  };

  const expanded = open && query.trim() !== '';
  return (
    <div className={ `dx-search ${className}` }>
      <svg className="dx-search-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        ref={ input }
        className="dx-search-input"
        type="text"
        role="combobox"
        aria-label="Search the docs"
        aria-autocomplete="list"
        aria-expanded={ expanded }
        aria-controls={ listId }
        aria-activedescendant={ expanded && results[active] ? optionId(active) : undefined }
        placeholder="Search components, themes, guides"
        autoComplete="off"
        spellCheck="false"
        value={ query }
        onChange={ (e) => { setQuery(e.target.value); setActive(0); setOpen(true); } }
        onFocus={ () => setOpen(true) }
        onBlur={ () => setOpen(false) }
        onKeyDown={ onKeyDown }
      />
      { shortcut && !query && <Kbd className="dx-search-kbd" keys={ [MAC ? '⌘' : 'Ctrl', 'K'] } aria-hidden="true" /> }
      <ul id={ listId } className="dx-search-list" role="listbox" aria-label="Pages" hidden={ !expanded }>
        { results.map((page, i) => (
          <li
            key={ page.href }
            id={ optionId(i) }
            role="option"
            aria-selected={ i === active }
            className="dx-search-option"
            // mousedown, not click: it runs before the input's blur closes the list.
            onMouseDown={ (e) => { e.preventDefault(); go(page); } }
            onMouseMove={ () => setActive(i) }
          >
            <span className="dx-search-name"><Highlight text={ page.name } query={ query } /></span>
            <span className="dx-search-group">{ page.group }</span>
          </li>
        )) }
        { !results.length && <li className="dx-search-empty" role="presentation">Nothing matches “{ query.trim() }”.</li> }
      </ul>
    </div>
  );
}
