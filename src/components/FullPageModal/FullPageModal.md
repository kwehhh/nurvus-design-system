```jsx
import React, { useState } from 'react';
import { Button, FullPageModal, Layout } from '@nurvus/design-system';

const MyApp = () => {
  const [visible, setVisible] = useState(false);

  const actions = (
    <Layout display="flex">
      <span>SAVE</span>
      <span onClick={ () => setVisible(false) }>CLOSE</span>
    </Layout>
  );

  return (
    <div>
      <Button onClick={ () => setVisible(true) }>
        Show Modal
      </Button>
      <FullPageModal
        title="My Modal"
        headerActions={ actions }
        visible={ visible }
        >
        Modal Stuff
      </FullPageModal>
    </div>
  );
}

<MyApp />
```