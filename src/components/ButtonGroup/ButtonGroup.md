```jsx
import { Button, ButtonGroup, Layout } from '@nurvus/ui';
import AddIcon from '@material-ui/icons/Add';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import LockOpenIcon from '@material-ui/icons/LockOpen';

<Layout>
  <ButtonGroup>
    <Button><AddIcon /></Button>
    <Button><FileCopyIcon /></Button>
    <Button disabled={ true }><RemoveRedEyeIcon /></Button>
    <Button><LockOpenIcon /></Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button disabled={ true }><RemoveRedEyeIcon /></Button>
    <Button><LockOpenIcon /></Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button><LockOpenIcon /></Button>
  </ButtonGroup>
</Layout>
```
