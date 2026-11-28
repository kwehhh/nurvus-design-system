Key caps for keyboard shortcuts: in tooltips, menus and guides, so people can see the keys to press. `keys` draws a shortcut; one key can be the child.

```jsx
import { Kbd, Layout, Text } from '@nurvus/ui';

<Layout itemSpacing={ 12 }>
  <Text>Search: <Kbd keys={ ['⌘', 'K'] } /> (Mac) or <Kbd keys={ ['Ctrl', 'K'] } /> (Windows, Linux)</Text>
  <Text>Show or hide the sidebar: <Kbd keys={ ['⌘', 'B'] } /></Text>
  <Text>Close: <Kbd>Esc</Kbd> · Move: <Kbd>↑</Kbd> <Kbd>↓</Kbd> · Pick: <Kbd>Enter</Kbd></Text>
  <Text variant="caption" tone="muted">Sized in em: <Kbd keys={ ['Shift', '?'] } /> follows the text it sits in.</Text>
</Layout>
```

A control with a shortcut should also say so to assistive technology: put `aria-keyshortcuts` on it (`aria-keyshortcuts="Meta+B"`), as the docs header's sidebar button does.
