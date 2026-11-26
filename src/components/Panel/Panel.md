Give it a `title`, a `caption` footer, or both.
```jsx
import { Panel, Tag, Text } from '@nurvus/ui';

<div style={ { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 } }>
  <Panel title="Deploys" caption="Updated 2 minutes ago">
    <Text variant="display">128</Text>
    <Text as="p" variant="caption" tone="muted">this week, up 12%</Text>
  </Panel>
  <Panel title="Status" caption={ <Tag tone="success">All systems normal</Tag> }>
    <Text as="p" variant="body">Every service answered in under 200 ms.</Text>
  </Panel>
</div>
```

With `padding="none"`, content runs to the edges, for an image or a table.
```jsx
import { Panel } from '@nurvus/ui';

<Panel padding="none" caption="Full-bleed content, then a caption" style={ { maxWidth: 360 } }>
  <div style={ { height: 120, background: 'linear-gradient(135deg, var(--nv-accent-fill), var(--nv-syntax-tag))' } } />
</Panel>
```
