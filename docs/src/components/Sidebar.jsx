import React from 'react';
import { Menu } from '@nurvus/ui';
import { navSections } from '../nav';
import Search from './Search';

/** Which sections the reader closed, remembered between visits. */
const KEY = 'nurvus.docs.sections';
const saved = () => {
  try { return JSON.parse(window.localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
};
const remember = (id, open) => {
  try { window.localStorage.setItem(KEY, JSON.stringify({ ...saved(), [id]: open })); } catch (e) { /* storage blocked */ }
};

/** The nav data in Menu's shape; components link to the `framework` version. */
const menuSections = (framework) => navSections(framework).map((s) => ({
  id: s.id,
  title: s.name,
  href: s.href,
  items: s.items.map((item) => ({ label: item.name, href: item.href, divider: item.divider })),
}));

/**
 * Every section and page, drawn by @nurvus/ui's own Menu (sections open and
 * close, stay as the reader left them, and the arrow keys move through
 * them). On a desktop the whole sidebar can slide shut (the header's menu
 * button); on a phone it is a drawer with the search at its top.
 */
export default function Sidebar({ current, framework, open, onNavigate }) {
  const [defaultOpen] = React.useState(saved);
  const sections = React.useMemo(() => menuSections(framework), [framework]);
  return (
    <aside id="dx-sidebar" className="dx-sidebar" data-open={ open }>
      <Search id="dx-search-drawer" className="dx-search-drawer" onNavigate={ onNavigate } />
      <Menu
        id="dx-nav"
        label="Pages"
        sections={ sections }
        current={ current }
        defaultOpen={ defaultOpen }
        onToggle={ remember }
        onNavigate={ () => { if (onNavigate) onNavigate(); } }
      />
    </aside>
  );
}
