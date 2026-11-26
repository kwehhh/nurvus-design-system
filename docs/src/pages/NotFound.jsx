import React from 'react';
import { Panel, Text } from '@nurvus/ui';

export default function NotFound({ path }) {
  return (
    <div className="dx-page">
      <Panel title="Page not found" caption={ <a href="#/Themes">Go to the themes</a> }>
        <Text as="p" variant="body">
          There is no page at <Text variant="mono">#/{ path.join('/') }</Text>. It may have been renamed: try the sidebar or its filter.
        </Text>
      </Panel>
    </div>
  );
}
