import React from 'react';
import { Anchor } from '@nurvus/ui';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * "On this page" beside a docs page (wide screens only): @nurvus/ui's Anchor,
 * built from the page's own section headings (h2, and h3 under them). Headings
 * without an id get one from their text. The site routes with the hash, so the
 * Anchor scrolls without writing #id into the address bar.
 */
export default function PageAnchor({ route }) {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const main = document.querySelector('.dx-main .dx-page');
    if (!main) { setItems([]); return undefined; }
    let timer = 0;
    const scan = () => {
      const used = new Set();
      const found = [...main.querySelectorAll('h2, h3')]
        .filter((h) => h.textContent.trim() && !h.closest('.dx-example, .dx-card-grid, .rv-logos, .nurvus.panel, .anchor'))
        .map((h) => {
          if (!h.id) { let id = `s-${slug(h.textContent)}`; while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== h)) id += '-x'; h.id = id; }
          used.add(h.id);
          return { href: `#${h.id}`, label: h.textContent.trim(), level: h.tagName === 'H3' ? 2 : 1 };
        });
      setItems((was) => (JSON.stringify(was) === JSON.stringify(found) ? was : found));
    };
    const later = () => { clearTimeout(timer); timer = setTimeout(scan, 120); };
    scan();
    const watch = new MutationObserver(later);
    watch.observe(main, { childList: true, subtree: true });
    return () => { clearTimeout(timer); watch.disconnect(); };
  }, [route]);

  if (items.length < 2) return null;
  return (
    <aside className="dx-page-anchor">
      <Anchor id="dx-on-this-page" items={ items } offset={ 88 } updateHash={ false } />
    </aside>
  );
}
