import React from 'react';
import { Panel, Text } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from '../router';
import { FRAMEWORKS, useFramework, setFramework, componentHref } from '../framework';

/**
 * Every component as a card: name and the first line of its description.
 * One list for both frameworks: the switch picks which version the cards
 * (and the sidebar, and search) open, and the docs remember it.
 */
export default function ComponentsIndex() {
  const framework = useFramework();
  return (
    <div className="dx-page">
      <h1 className="dx-page-title">Components</h1>
      <p className="dx-lede">
        Every @nurvus/ui component, written once and shipped two ways: for React 16.8 to 19, and as plain DOM
        for <a href={ href('Respawn') }>Respawn</a> and pages without React. Same props, same markup, same themes.
      </p>
      <div className="dx-switch dx-framework-switch" role="group" aria-label="Show components for">
        { FRAMEWORKS.map((f) => (
          <button key={ f.id } type="button" aria-pressed={ framework === f.id } onClick={ () => setFramework(f.id) }>{ f.name }</button>
        )) }
      </div>
      <div className="dx-card-grid">
        { components.map((c) => (
          <a key={ c.name } href={ componentHref(c.name, framework) }>
            <Panel title={ c.name }>
              <Text as="p" variant="caption" tone="muted">{ (c.description || 'No description yet.').split('\n')[0] }</Text>
            </Panel>
          </a>
        )) }
      </div>
    </div>
  );
}
