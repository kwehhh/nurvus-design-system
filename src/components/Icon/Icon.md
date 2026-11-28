Icons are 1em by default, so they are as big as the text they sit in, and they take its color. Every icon is in **Foundations → Icons**.
```jsx
import { Icon, Layout, Text, Title } from '@nurvus/ui';

<Layout itemSpacing={ 12 }>
  <Title level={ 3 }><Icon name="layers" /> Layers</Title>
  <Text as="p" variant="body"><Icon name="info" /> Body text, and its icon is body size.</Text>
  <Text as="p" variant="caption" tone="muted"><Icon name="check" /> A caption, a smaller icon.</Text>
</Layout>
```

In a button: put the icon beside the words. An icon alone needs a `label`, which screen readers read; with words beside it, leave the label out (the icon is decorative).
```jsx
import { Button, Icon, Layout } from '@nurvus/ui';

<Layout display="flex" alignItems="center" itemSpacing={ 8 }>
  <Button type="primary"><Icon name="add" /> New layer</Button>
  <Button type="secondary"><Icon name="download" /> Export</Button>
  <Button type="secondary" aria-label="Delete layer"><Icon name="delete" /></Button>
  <Icon name="warning" label="Unsaved changes" size={ 24 } style={ { color: 'var(--nv-warning)' } } />
</Layout>
```
