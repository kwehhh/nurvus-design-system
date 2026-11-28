Shows how far along something is. Give it a `label` (what is in progress) and, where the number helps, `showValue`. Screen readers hear "Uploading, progress bar, 40%" and hear it change.

```jsx
import { Layout, Progress } from '@nurvus/ui';

<Layout itemSpacing={ 24 } style={ { maxWidth: 360 } }>
  <Progress label="Uploading photos" percent={ 40 } showValue />
  <Progress label="Storage used" percent={ 72 } size="large" showValue />
  <Progress label="Step 2 of 5" percent={ 40 } size="small" />
</Layout>
```

The status colors the bar, and with `showValue` it is also an icon and a word (Done, Needs attention, Failed), so it never rests on color alone. Screen readers hear the word: "100%, Done".
```jsx
import { Layout, Progress } from '@nurvus/ui';

<Layout itemSpacing={ 24 } style={ { maxWidth: 360 } }>
  <Progress label="Backup" status="success" percent={ 100 } showValue />
  <Progress label="Disk space" status="warning" percent={ 88 } showValue />
  <Progress label="Import" status="critical" percent={ 35 } showValue />
</Layout>
```

Sizes. Where the words around the bar already say what it is, `hideLabel` keeps the label for screen readers only.
```jsx
import { Layout, Progress } from '@nurvus/ui';

<Layout itemSpacing={ 16 } style={ { maxWidth: 240 } }>
  <Progress size="small" percent={ 50 } label="Small" hideLabel />
  <Progress size="medium" percent={ 50 } label="Medium" hideLabel />
  <Progress size="large" percent={ 50 } label="Large" hideLabel />
</Layout>
```
