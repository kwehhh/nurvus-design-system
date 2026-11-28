A column or a row with even space between the children, from the [4px grid](#/Foundations/Spacing). It spaces with CSS `gap`, so a row that wraps keeps its spacing on every line.

```jsx
import { Button, Stack, Tag, Text } from '@nurvus/ui';

<Stack gap={ 12 }>
  <Text weight="semibold">Release 2.4</Text>
  <Stack direction="row" gap={ 8 } align="center">
    <Tag tone="success">Ready</Tag>
    <Text tone="muted">All checks passed</Text>
  </Stack>
  <Stack direction="row" gap={ 8 }>
    <Button>Publish</Button>
    <Button type="secondary">Preview</Button>
  </Stack>
</Stack>
```

The direction can change with the screen: `{ base: 'column', md: 'row' }` stacks on phones and sits in a row from the md breakpoint (48em, 768 pixels) up. Make the window narrower to see it.
```jsx
import { Panel, Stack, Text } from '@nurvus/ui';

<Stack direction={ { base: 'column', md: 'row' } } gap={ 16 }>
  <Panel title="Plan" style={ { flex: 1 } }><Text>Pro, billed yearly</Text></Panel>
  <Panel title="Seats" style={ { flex: 1 } }><Text>12 of 20 used</Text></Panel>
  <Panel title="Renews" style={ { flex: 1 } }><Text>March 3</Text></Panel>
</Stack>
```

`justify="between"` pushes the ends apart; `wrap` lets a long row break onto more lines.
```jsx
import { Button, Stack, Tag, Text } from '@nurvus/ui';

<Stack gap={ 16 }>
  <Stack direction="row" justify="between" align="center">
    <Text weight="semibold">Filters</Text>
    <Button size="small" type="secondary">Clear</Button>
  </Stack>
  <Stack direction="row" gap={ 8 } wrap>
    { ['React', 'Respawn', 'TypeScript', 'Themes', 'Icons', 'Accessibility', 'Spacing', 'Motion'].map((t) => <Tag key={ t }>{ t }</Tag>) }
  </Stack>
</Stack>
```
