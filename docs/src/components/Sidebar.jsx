import React from 'react';
import { sections } from '../nav';

/**
 * Themes and Components, with a filter box. On a phone it is a drawer the
 * header's menu button opens; picking a page closes it.
 */
export default function Sidebar({ current, open, onNavigate }) {
  const [query, setQuery] = React.useState('');
  const q = query.trim().toLowerCase();
  const visible = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => !q || i.name.toLowerCase().includes(q)) }))
    .filter((s) => !q || s.items.length || s.name.toLowerCase().includes(q));

  return (
    <nav id="dx-sidebar" className="dx-sidebar" data-open={ open } aria-label="Pages">
      <input
        className="dx-filter"
        type="search"
        placeholder="Filter by name"
        aria-label="Filter pages by name"
        value={ query }
        onChange={ (e) => setQuery(e.target.value) }
      />
      { visible.map((section) => (
        <div key={ section.name } className="dx-nav-section" data-section={ section.name }>
          { section.href ? (
            <a className="dx-nav-section-link" href={ section.href } data-active={ current === section.href } onClick={ onNavigate }>
              { section.name }
            </a>
          ) : <span className="dx-nav-section-link dx-nav-heading">{ section.name }</span> }
          <ul>
            { section.items.map((item) => (
              <li key={ item.href }>
                <a href={ item.href } data-active={ current === item.href } onClick={ onNavigate }>{ item.name }</a>
              </li>
            )) }
          </ul>
        </div>
      )) }
      { !visible.length && <p className="dx-nav-empty">Nothing matches “{ query }”.</p> }
    </nav>
  );
}
