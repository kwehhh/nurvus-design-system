A small pill for a status or label. Each tone uses the theme's own color, so it reads in every theme.
```jsx
import { Tag } from '@nurvus/ui';

<div style={ { display: 'flex', flexWrap: 'wrap', gap: 8 } }>
  <Tag>neutral</Tag>
  <Tag tone="accent">preview</Tag>
  <Tag tone="success">new</Tag>
  <Tag tone="warning">beta</Tag>
  <Tag tone="danger">deprecated</Tag>
  <Tag tone="info">demo</Tag>
</div>
```
