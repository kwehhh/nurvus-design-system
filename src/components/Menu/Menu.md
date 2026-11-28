**The items decide what it is**, and screen readers hear it that way:

| Items | It becomes | Screen readers say | Keys |
|---|---|---|---|
| Links (`href`) | Navigation: a `<nav>` landmark | "Pages, navigation… Billing, link, current page" | Tab goes link by link; ↑ ↓ Home End move too; → ← open and close sections |
| Actions (`onSelect`) | A menu of commands (`role="menu"`) | "Actions, menu… Duplicate, menu item" | One Tab stop; ↑ ↓ Home End move; type a letter to jump; Enter or Space runs it |
| Rows to pick, `kind="tree"` | A tree (the same as [Tree](#/Components/Tree)) | "Layers, tree… Header, level 1, 1 of 3, selected" | One Tab stop; ↑ ↓ move, → ← go in and out, Enter or Space picks |

Left out, `kind` follows the items: navigation when any item has an `href`, actions when none has. An item without an `href` inside navigation is a button there ("Sign out"). Links take Enter only, as everywhere on the web (Space scrolls the page); buttons, chevrons and tree rows take Enter and Space.

**Navigation.** Sections open and close with the chevron (or the whole heading, when it isn't a link). The chevron sits before the title, as Material UI draws it: › while a section is closed, ⌄ while it is open, so it stays next to the words it belongs to (easier to find for people who zoom in) and every title lines up. An open section has a hairline guide down its items, and the current page's bar sits on it; the page also opens its section by itself. `chevron="end"` puts the chevron after the title instead (⌄ closed, ⌃ open), with no guide line.

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

**Actions.** Items with `onSelect` and no `href`: a menu of commands. Tab reaches it once (the item you were last on), then ↑ ↓ move and typing a letter jumps to the next item that starts with it. A disabled item stays in the list, so people still find it, but does nothing.
```jsx
import { Menu, Text } from '@nurvus/ui';

const Actions = () => {
  const [done, setDone] = React.useState('Nothing yet');
  const run = (what) => () => setDone(what);
  return (
    <div style={ { maxWidth: 260 } }>
      <Menu
        id="layer-actions"
        label="Layer actions"
        sections={ [
          { title: 'Edit', items: [
            { label: 'Duplicate', onSelect: run('Duplicated') },
            { label: 'Rename', onSelect: run('Renamed') },
            { label: 'Group', onSelect: run('Grouped'), disabled: true },
          ] },
          { title: 'Arrange', items: [
            { label: 'Bring to front', onSelect: run('Brought to front') },
            { label: 'Send to back', onSelect: run('Sent to back') },
            { label: 'Delete', onSelect: run('Deleted'), divider: true },
          ] },
        ] }
      />
      <Text variant="caption" tone="muted">{ done }</Text>
    </div>
  );
};
<Actions />
```

**A tree.** `kind="tree"` takes Tree's props: nested `items`, the `activePath` of the picked row, and `onClick(event, path)`.
```jsx
import { Menu } from '@nurvus/ui';

const Layers = () => {
  const [path, setPath] = React.useState([1, 0]);
  return (
    <div style={ { maxWidth: 260 } }>
      <Menu
        kind="tree"
        label="Layers"
        activePath={ path }
        onClick={ (event, next) => setPath(next) }
        items={ [
          { label: 'Header' },
          { label: 'Hero', items: [{ label: 'Title' }, { label: 'Image' }] },
          { label: 'Footer' },
        ] }
      />
    </div>
  );
};
<Layers />
```
