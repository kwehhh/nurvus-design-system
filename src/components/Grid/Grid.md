Lays its children out in equal columns. Columns never overflow the grid: a long word or a wide child shrinks its cell instead of pushing the page sideways.

`columns` can change at the breakpoints: `{ base: 1, sm: 2, lg: 3 }` is one column on phones, two from sm (40em, 640 pixels) and three from lg (64em, 1024 pixels). Make the window narrower to see it.
```jsx
import { Grid, Panel, Text } from '@nurvus/ui';

<Grid columns={ { base: 1, sm: 2, lg: 3 } } gap={ 16 }>
  { ['Checkout API', 'Search', 'Billing jobs', 'Images', 'Email', 'Webhooks'].map((name) => (
    <Panel key={ name } title={ name }><Text tone="muted">Healthy</Text></Panel>
  )) }
</Grid>
```

Or no count at all: `minItemWidth` fits as many columns as there is room for, each at least that wide, and they share what is left. Good for cards and galleries.
```jsx
import { Grid, Icon, Stack, Text } from '@nurvus/ui';

<Grid minItemWidth="9rem" gap={ 12 }>
  { ['home', 'search', 'settings', 'user', 'bell', 'calendar', 'mail', 'star'].map((name) => (
    <Stack key={ name } align="center" gap={ 4 } style={ { padding: 12, border: '1px solid var(--nv-border)', borderRadius: 8 } }>
      <Icon name={ name } size="1.5em" />
      <Text variant="caption">{ name }</Text>
    </Stack>
  )) }
</Grid>
```

A fixed count, and a child that spans two columns with `style={ { gridColumn: 'span 2' } }`.
```jsx
import { Grid, Panel, Text } from '@nurvus/ui';

<Grid columns={ 4 } gap={ 12 }>
  <Panel title="Revenue" style={ { gridColumn: 'span 2' } }><Text>$48,200</Text></Panel>
  <Panel title="Orders"><Text>1,284</Text></Panel>
  <Panel title="Refunds"><Text>12</Text></Panel>
</Grid>
```
