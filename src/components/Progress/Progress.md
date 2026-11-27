Basic Example
```jsx
import Layout from '../Layout/Layout.jsx';

<Layout itemSpacing={ 32 }>
  <Layout itemSpacing={ 12 } style={ { maxWidth: 90 } }>
    <Progress size="small" />
    <Progress size="small" percent={ 50 } />
    <Progress size="small" percent={ 100 } />
  </Layout>
  <Layout itemSpacing={ 12 } style={ { maxWidth: 105 } }>
    <Progress size="medium" />
    <Progress size="medium" percent={ 50 } />
    <Progress size="medium" percent={ 100 } />
  </Layout>
  <Layout itemSpacing={ 12 } style={ { maxWidth: 226 } }>
    <Progress size="large" />
    <Progress size="large" percent={ 50 } />
    <Progress size="large" percent={ 100 } />
  </Layout>
</Layout>
```

Status Example
```jsx
import Layout from '../Layout/Layout.jsx';
  <Layout itemSpacing={ 12 } style={ { maxWidth: 90 } }>
    <Progress status="critical" percent={ 10 } />
    <Progress status="warning" percent={ 50 } />
    <Progress status="success" percent={ 100 } />
  </Layout>
```