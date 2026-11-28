Screen readers hear "Actions, menu button, collapsed"; once it opens, the menu and its items ("Duplicate, menu item"). A disabled action stays in the list, so people still find it, but does nothing.

```jsx
import { Dropdown, Text } from '@nurvus/ui';

const Demo = () => {
  const [done, setDone] = React.useState('Nothing yet');
  const run = (what) => () => setDone(what);
  return (
    <div style={ { display: 'flex', alignItems: 'center', gap: 16 } }>
      <Dropdown
        id="file-actions"
        label="Actions"
        sections={ [
          { title: 'File', items: [
            { label: 'Duplicate', onSelect: run('Duplicated') },
            { label: 'Rename', onSelect: run('Renamed') },
            { label: 'Move to…', onSelect: run('Moved'), disabled: true },
          ] },
          { items: [{ label: 'Delete', onSelect: run('Deleted') }] },
        ] }
      />
      <Text tone="muted">{ done }</Text>
    </div>
  );
};
<Demo />
```

A flat list with `items`, lined up with the button's right edge (`align="end"`), and an icon-only button: give the icon a `label` so the button has a name.
```jsx
import { Dropdown, Icon } from '@nurvus/ui';

<div style={ { display: 'flex', justifyContent: 'flex-end' } }>
  <Dropdown
    id="row-actions"
    label={ <Icon name="more-horizontal" label="More actions" size="1.25em" /> }
    align="end"
    type="secondary"
    size="small"
    items={ [
      { label: 'Share', onSelect: () => {} },
      { label: 'Download', onSelect: () => {} },
      { label: 'Archive', onSelect: () => {} },
    ] }
  />
</div>
```
