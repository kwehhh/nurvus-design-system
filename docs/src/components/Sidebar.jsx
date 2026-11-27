import React from 'react';
import { sections } from '../nav';
import Search from './Search';

/**
 * Every section and page. On a desktop it can be collapsed (the header's
 * menu button), giving the page the full width; on a phone it is a drawer
 * with the search at its top.
 */
export default function Sidebar({ current, open, onNavigate }) {
  return (
    <nav id="dx-sidebar" className="dx-sidebar" data-open={ open } aria-label="Pages">
      <Search id="dx-search-drawer" className="dx-search-drawer" onNavigate={ onNavigate } />
      { sections.map((section) => (
        <div key={ section.name } className="dx-nav-section" data-section={ section.name }>
          { section.href ? (
            <a className="dx-nav-section-link" href={ section.href } data-active={ current === section.href } onClick={ onNavigate }>
              { section.name }
            </a>
          ) : <span className="dx-nav-section-link dx-nav-heading">{ section.name }</span> }
          <ul>
            { section.items.map((item) => (
              <li key={ item.href } data-divider={ item.divider || undefined }>
                <a href={ item.href } data-active={ current === item.href } onClick={ onNavigate }>{ item.name }</a>
              </li>
            )) }
          </ul>
        </div>
      )) }
    </nav>
  );
}
