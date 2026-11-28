Which look? The **hamburger** for navigation that covers the page (a phone's drawer, a menu), the **sidebar icon** for a sidebar that sits beside the page and folds away (as VS Code, shadcn/ui and Keyframery do). The docs header uses the hamburger with Slide and asymmetric lines; the sidebar icon is kept here for a docked sidebar. Click each one.

```jsx
import { NavToggle, Text } from '@nurvus/ui';

const MORPHS = [
  ['slide', 'Slide: a cross, the middle bar sliding out to the left (the docs header)'],
  ['cross', 'Cross: the middle bar fades'],
  ['squeeze', 'Squeeze: in to the middle, then a cross'],
  ['elastic', 'Elastic: a cross on a spring'],
  ['spin', 'Spin: a cross, turning half a circle'],
  ['arrow', 'Arrow: points at the sidebar'],
  ['chevron', 'Chevron: a ‹, slide it away'],
  ['collapse', 'Collapse: three bars become one'],
];

const One = ({ morph, about }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={ { display: 'flex', alignItems: 'center', gap: 12 } }>
      <NavToggle open={ open } morph={ morph } lines="asymmetric" label={ `navigation (${morph})` } onClick={ () => setOpen(!open) } />
      <Text variant="caption" tone="muted">{ about }</Text>
    </div>
  );
};

<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: 12 } }>
  { MORPHS.map(([morph, about]) => <One key={ morph } morph={ morph } about={ about } />) }
</div>
```

Lines: even (three of one length) or asymmetric (long, short, middle), which line up when pointed at and while open. And the sidebar icon: its pane fills while the sidebar shows; closed, it shrinks away and the divider slides left.
```jsx
import { NavToggle, Layout, Text } from '@nurvus/ui';

const Pair = () => {
  const [open, setOpen] = React.useState(true);
  const flip = () => setOpen(!open);
  return (
    <Layout display="flex" alignItems="center" itemSpacing={ 24 }>
      <NavToggle open={ open } lines="even" onClick={ flip } label="menu (even)" />
      <NavToggle open={ open } lines="asymmetric" onClick={ flip } label="menu (asymmetric)" />
      <NavToggle open={ open } variant="sidebar" onClick={ flip } label="sidebar" />
      <Text variant="caption" tone="muted">{ open ? 'Open' : 'Closed' }: click any</Text>
    </Layout>
  );
};
<Pair />
```

Give it `controls` (the navigation's id) so screen readers can follow it there, and when your app has a shortcut for it, say so with `aria-keyshortcuts` and a [Tooltip](#/Components/Tooltip) with the keys. The docs header does: <kbd>⌘</kbd> <kbd>B</kbd>.
