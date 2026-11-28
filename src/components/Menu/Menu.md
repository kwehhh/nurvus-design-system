**Menu or Tree?** Menu takes people to pages: its rows are links (a `<nav>`), Tab visits each one, and the current page is marked. [Tree](#/Components/Tree) picks an item in a list on the same page, like layers in an editor: one Tab stop, the arrow keys move, and the picked row is selected. Screen readers announce them differently (links in a navigation area versus a tree you choose from), so they are two components with the same look.

Sections open and close with the chevron (or the whole heading, when it isn't a link). The current page is marked with a bar beside it, and its section opens by itself.

By keyboard: Tab goes link by link as usual, and inside the menu ↑ ↓ move between rows (going round at the ends), Home and End jump to the first and last, → opens a section and ← closes it. Enter follows a link; Enter or Space opens and closes a section (its chevron is a button). Links take Enter only, as everywhere on the web: Space scrolls the page.
```jsx
import { Menu } from '@nurvus/ui';

<div style={ { maxWidth: 260 } }>
  <Menu
    current="#/settings/billing"
    onNavigate={ (href, event) => event.preventDefault() }
    sections={ [
      { title: 'Account', href: '#/account', items: [
        { label: 'Profile', href: '#/account/profile' },
        { label: 'Security', href: '#/account/security' },
      ] },
      { title: 'Settings', items: [
        { label: 'General', href: '#/settings/general' },
        { label: 'Billing', href: '#/settings/billing' },
        { label: 'Danger zone', href: '#/settings/danger', divider: true },
      ] },
    ] }
  />
</div>
```

Start with some sections closed: `defaultOpen` takes a map of section ids (the title as a slug, or the section's own `id`).
```jsx
import { Menu } from '@nurvus/ui';

<div style={ { maxWidth: 260 } }>
  <Menu
    id="closed-example"
    defaultOpen={ { reports: false } }
    onNavigate={ (href, event) => event.preventDefault() }
    sections={ [
      { title: 'Projects', items: [{ label: 'Website', href: '#/p/web' }, { label: 'App', href: '#/p/app' }] },
      { title: 'Reports', items: [{ label: 'Weekly', href: '#/r/week' }, { label: 'Monthly', href: '#/r/month' }] },
    ] }
  />
</div>
```
