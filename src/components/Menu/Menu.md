Basic Example
```jsx
import { Menu } from '@nurvus/ui';

const initialPath = [1];
const items = [
  {
    label: 'Item 1',
  },
  {
    label: 'Item 2'
  },
  {
    label: 'Item 3'
  },
  {
    label: 'Item 4'
  }
];

const MyApp = ({initialPath}) => {
  const [activePath, setActivePath] = React.useState(initialPath);

  return (
    <Menu
      activePath={ activePath }
      items={ items }
      onClick={ (e, path) => setActivePath(path) }
    />
  );
}
<MyApp initialPath={ initialPath } />
```

Using Sub Menus
```jsx
import { Menu } from '@nurvus/ui';

const initialPath = [0, 0, 0];
const items = [
  {
    label: 'Item 1',
    items: [
      {
        label: 'Sub 1',
        items: [
          {
            label: 'Sub Item 1'
          },
          {
            label: 'Sub Item 2'
          }
        ]
      },
      {
        label: 'Sub 2'
      }
    ]
  },
  {
    label: 'Item 2'
  }
];

const MyApp = ({initialPath}) => {
  const [activePath, setActivePath] = React.useState(initialPath);

  return (
    <Menu
      activePath={ activePath }
      items={ items }
      onClick={ (e, path) => setActivePath(path) }
    />
  );
}
<MyApp initialPath={ initialPath } />
```

Using itemRenderer
```jsx
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Layout, Menu, Text } from '@nurvus/ui';

const itemRenderer = ({ label }) => {
  return (
    <Layout display="flex" alignItems="center" justifyContent="space-between">
      <Text>{ label }</Text>
      <Layout display="flex" alignItems="center" justifyContent="space-between">
        <RemoveRedEyeIcon />
        <LockOpenIcon />
      </Layout>
    </Layout>
  );
};
const initialPath = [0, 0, 0];
const items = [
  {
    label: 'Item 1',
    items: [
      {
        label: 'Sub 1',
        items: [
          {
            label: 'Sub Item 1'
          },
          {
            label: 'Sub Item 2'
          }
        ]
      },
      {
        label: 'Sub 2'
      }
    ]
  },
  {
    label: 'Item 2'
  }
];

const MyApp = ({initialPath}) => {
  const [activePath, setActivePath] = React.useState(initialPath);

  return (
    <Menu
      activePath={ activePath }
      items={ items }
      itemRenderer={ itemRenderer }
      onClick={ (e, path) => setActivePath(path) }
    />
  );
}
<MyApp initialPath={ initialPath } />
```