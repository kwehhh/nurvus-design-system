Sections open and close with the chevron (or the whole heading, when it isn't a link). The current page is marked with a bar beside it, and its section opens by itself.

By keyboard: Tab goes link by link as usual, and inside the menu ↑ ↓ move between rows (going round at the ends), Home and End jump to the first and last, → opens a section and ← closes it.
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
