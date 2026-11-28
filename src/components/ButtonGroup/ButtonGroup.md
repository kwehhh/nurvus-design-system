```jsx
import { Button, ButtonGroup, Icon, Layout } from '@nurvus/ui';

<Layout>
  <ButtonGroup>
    <Button aria-label="Add"><Icon name="add" size="1.25em" /></Button>
    <Button aria-label="Copy"><Icon name="copy" size="1.25em" /></Button>
    <Button disabled={ true } aria-label="Show"><Icon name="eye" size="1.25em" /></Button>
    <Button aria-label="Unlock"><Icon name="unlock" size="1.25em" /></Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button disabled={ true } aria-label="Show"><Icon name="eye" size="1.25em" /></Button>
    <Button aria-label="Unlock"><Icon name="unlock" size="1.25em" /></Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button aria-label="Unlock"><Icon name="unlock" size="1.25em" /></Button>
  </ButtonGroup>
</Layout>
```
