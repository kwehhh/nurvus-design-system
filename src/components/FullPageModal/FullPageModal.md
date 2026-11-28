A modal dialog over the whole screen. When it opens, focus moves into it and screen readers say its title and "dialog"; Tab stays inside it; Esc calls `onClose`; when it closes, focus goes back to the button that opened it. Close buttons belong in `headerActions`, and they should be real buttons.

```jsx
import React, { useState } from 'react';
import { Button, FullPageModal, Layout, Panel, Text } from '@nurvus/ui';

const MyApp = () => {
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);

  return (
    <div>
      <Button onClick={ () => setVisible(true) }>Show the modal</Button>
      <FullPageModal
        id="settings-modal"
        title="Settings"
        visible={ visible }
        onClose={ close }
        headerActions={
          <Layout display="flex" itemSpacing={ 8 }>
            <Button size="small" onClick={ close }>Save</Button>
            <Button size="small" type="secondary" onClick={ close }>Close</Button>
          </Layout>
        }
      >
        <Panel style={ { margin: 16 } }>
          <Text>Press Tab: focus stays in here. Press Esc to close.</Text>
        </Panel>
      </FullPageModal>
    </div>
  );
};

<MyApp />
```
