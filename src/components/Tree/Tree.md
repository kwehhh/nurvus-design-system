**Tree is a Menu that picks.** `<Tree />` and `<Menu kind="tree" />` are the same thing: rows to choose from on the page (layers, folders, an outline). For links or commands, use [Menu](#/Components/Menu) with links or actions: the same look, and screen readers hear each as what it is.

A list of rows to pick from, nested like a layers panel. Click a row, or use the keyboard: Tab reaches the active row, ↑ ↓ move, → goes to a child row, ← to its parent, Enter or Space picks.
```jsx
import { Tree } from '@nurvus/ui';

const items = [
  { label: 'Header', items: [{ label: 'Logo' }, { label: 'Navigation' }] },
  { label: 'Content', items: [{ label: 'Hero', items: [{ label: 'Title' }, { label: 'Button' }] }] },
  { label: 'Footer' },
];

const Layers = () => {
  const [activePath, setActivePath] = React.useState([0, 1]);
  return (
    <div style={ { maxWidth: 280 } }>
      <Tree
        label="Layers"
        activePath={ activePath }
        items={ items }
        onClick={ (e, path) => setActivePath(path) }
      />
    </div>
  );
};
<Layers />
```

Draw your own rows with `itemRenderer`, e.g. a layer's name with its show and lock icons.
```jsx
import { Icon, Layout, Text, Tree } from '@nurvus/ui';

const itemRenderer = ({ label }) => (
  <Layout display="flex" alignItems="center" justifyContent="space-between">
    <Text>{ label }</Text>
    <Layout display="flex" alignItems="center" itemSpacing={ 4 }>
      <Icon name="eye" />
      <Icon name="unlock" />
    </Layout>
  </Layout>
);
const items = [
  { label: 'Item 1', items: [{ label: 'Sub 1', items: [{ label: 'Sub Item 1' }, { label: 'Sub Item 2' }] }, { label: 'Sub 2' }] },
  { label: 'Item 2' },
];

const MyApp = () => {
  const [activePath, setActivePath] = React.useState([0, 0, 0]);
  return (
    <div style={ { maxWidth: 320 } }>
      <Tree
        label="Layers"
        activePath={ activePath }
        items={ items }
        itemRenderer={ itemRenderer }
        onClick={ (e, path) => setActivePath(path) }
      />
    </div>
  );
};
<MyApp />
```
