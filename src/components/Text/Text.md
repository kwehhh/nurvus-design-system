The type roles. Every size comes from the `--nv-type-*` tokens.
```jsx
import { Text } from '@nurvus/ui';

<div style={ { display: 'grid', gap: 10 } }>
  <Text as="h1" variant="display">Display: the one big headline</Text>
  <Text as="h2" variant="title">Title: section headings</Text>
  <Text as="p" variant="body">Body: running text, 16px with room to breathe between lines.</Text>
  <Text as="p" variant="caption" tone="muted">Caption: labels, notes and table cells.</Text>
  <Text variant="mono">mono: #245CC7 --nv-accent 0.1.0-alpha.6</Text>
</div>
```

Basic Usage
```jsx
<Text>Hi</Text>
```

Using Text Overflow
```jsx
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import AddIcon from '@material-ui/icons/Add';
import { Button, Layout, Menu, Text } from '@nurvus/ui';

const overflowStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
};

<Layout display="flex" alignItems="center" justifyContent="space-between">
  <Text style={ overflowStyle }>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
  <Button>
    <AddIcon />
  </Button>
</Layout>
```

