import React from 'react';
import { Panel, Text } from '@nurvus/ui';
import Example from '../examples/Example';
import PropsTable from '../examples/PropsTable';
import ComponentSwitch from '../components/ComponentSwitch';
import { parseExamples, blockMarkdown } from '../examples/markdown';
import { href } from '../router';

/* eslint-disable react/no-danger -- the HTML is our own .md / docblocks */

/** A component's page: description, its .md (prose + live examples), then its props. */
export default function ComponentPage({ component }) {
  const parts = React.useMemo(() => parseExamples(component.markdown), [component]);
  let exampleIndex = -1;

  return (
    <div className="dx-page" data-component={ component.name }>
      <ComponentSwitch name={ component.name } current="react" />
      <h1 className="dx-page-title">{ component.name }</h1>
      { component.description && <div className="dx-prose dx-lede" dangerouslySetInnerHTML={ { __html: blockMarkdown(component.description) } } /> }

      { parts.map((part, i) => {
        if (part.type === 'prose') return <div key={ i } className="dx-prose" dangerouslySetInnerHTML={ { __html: part.html } } />;
        if (part.mode !== 'static') exampleIndex += 1;
        return <Example key={ `${component.name}-${i}` } owner={ component.name } index={ exampleIndex } code={ part.code } mode={ part.mode } />;
      }) }

      <h2 className="dx-section-title">Props</h2>
      { component.parseError
        ? <Panel title="Couldn't read the props" caption={ component.parseError } />
        : <PropsTable props={ component.props } /> }

      <h2 className="dx-section-title">TypeScript</h2>
      <p className="dx-lede">
        The package ships its types. The props above are <code>{ component.name }Props</code>; editors show each
        description on hover.
      </p>
      <Example owner={ component.name } code={ `import { ${component.name} } from '@nurvus/ui';\nimport type { ${component.name}Props } from '@nurvus/ui';` } mode="static" />
    </div>
  );
}

/** One example alone, full page ("Open isolated"). */
export function IsolatedExample({ component, index }) {
  const examples = React.useMemo(() => parseExamples(component.markdown).filter((p) => p.type === 'example' && p.mode !== 'static'), [component]);
  const example = examples[index];
  return (
    <div className="dx-isolated-page">
      <a className="dx-isolated-back" href={ href('Components', component.name) }>← { component.name }</a>
      { example
        ? <Example owner={ component.name } index={ index } code={ example.code } mode="noeditor" isolated />
        : <Text as="p" variant="body">{ component.name } has no example { index }.</Text> }
    </div>
  );
}
