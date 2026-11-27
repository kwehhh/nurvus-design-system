import React from 'react';
import { Panel, Text } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from '../router';

/** Every component as a card: name and the first line of its description. */
export default function ComponentsIndex() {
  return (
    <div className="dx-page">
      <h1 className="dx-page-title">React components</h1>
      <p className="dx-lede">
        Every @nurvus/ui component for React 16.8 to 19, with live examples you can edit and its full API. Each one
        also comes as plain DOM, for pages without React: see <a href={ href('Respawn') }>Respawn</a>.
      </p>
      <div className="dx-card-grid">
        { components.map((c) => (
          <a key={ c.name } href={ href('Components', c.name) }>
            <Panel title={ c.name }>
              <Text as="p" variant="caption" tone="muted">{ (c.description || 'No description yet.').split('\n')[0] }</Text>
            </Panel>
          </a>
        )) }
      </div>
    </div>
  );
}
