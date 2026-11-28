Basic Example
```jsx
import { Button, Icon, Layout, Title } from '@nurvus/ui';

<Layout>
  <Title level={ 3 }>Layers</Title>
  <Button aria-label="Add">
    <Icon name="add" size="1.25em" />
  </Button>
</Layout>
```

Horizontal Example
```jsx
import { Button, Icon, Layout, Title } from '@nurvus/ui';

<Layout itemSpacing={ 32 }>
  <Layout itemSpacing={ 8 }>
    <Title level={ 4 }>Display Flex</Title>
    <Layout display="flex">
      <Title level={ 3 }>Layers</Title>
      <Button aria-label="Add">
        <Icon name="add" size="1.25em" />
      </Button>
    </Layout>
  </Layout>
  <Layout itemSpacing={ 8 }>
    <Title level={ 4 }>Display Flex and Align Item</Title>
    <Layout display="flex" alignItems="center">
      <Title level={ 3 }>Layers</Title>
      <Button aria-label="Add">
        <Icon name="add" size="1.25em" />
      </Button>
    </Layout>
  </Layout>
  <Layout itemSpacing={ 8 }>
    <Title level={ 4 }>Display Flex and Align Item and Spaced Apart</Title>
    <Layout display="flex" alignItems="center" justifyContent="space-between">
      <Title level={ 3 }>Layers</Title>
      <Button aria-label="Add">
        <Icon name="add" size="1.25em" />
      </Button>
    </Layout>
  </Layout>
</Layout>
```

