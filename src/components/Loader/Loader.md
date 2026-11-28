The light is the logo's Pulse (see [Brand](#/Foundations/Brand)). It is 2em by default, so it sizes with the text around it.

```jsx
import { Layout, Loader } from '@nurvus/ui';

<Layout display="flex" alignItems="center" itemSpacing={ 32 }>
  <Loader size="1em" />
  <Loader />
  <Loader size={ 48 } />
  <Loader size={ 96 } id="big-loader" label="Loading your workspace" />
</Layout>
```

With `showLabel` the label shows beside it. Name what is loading where it helps: "Loading photos" says more than "Loading".
```jsx
import { Button, Layout, Loader, Text } from '@nurvus/ui';

const Fetch = () => {
  const [loading, setLoading] = React.useState(true);
  return (
    <Layout itemSpacing={ 12 }>
      { loading ? <Loader label="Loading photos" showLabel /> : <Text>12 photos</Text> }
      <div><Button size="small" type="secondary" onClick={ () => setLoading(!loading) }>{ loading ? 'Finish' : 'Load again' }</Button></div>
    </Layout>
  );
};
<Fetch />
```

From about 64 pixels the segments look better with the logo's gradients: give it an `id` and they are drawn with gradients named after it.
