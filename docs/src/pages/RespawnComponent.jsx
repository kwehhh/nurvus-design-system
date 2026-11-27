import React from 'react';
import Example from '../examples/Example';
import ComponentSwitch from '../components/ComponentSwitch';
import A11yTags from '../components/A11yTags';
import { DEMOS, Demo, RETURNS, NOTES } from './RespawnGuide';
import { href } from '../router';
import './Guides.scss';

/** One component's Respawn version: what it returns, how it updates, a live demo. */
export default function RespawnComponent({ component }) {
  const { name, description } = component;
  const demo = DEMOS.find((d) => d.name === name);
  return (
    <div className="dx-page gd rg">
      <ComponentSwitch name={ name } current="respawn" />
      <h1 className="dx-page-title">{ name }</h1>
      <p className="dx-lede">{ (description || '').split('\n\n')[0] }</p>
      <A11yTags name={ name } />
      <Example owner="Guide" code={ `import { ${name} } from '@nurvus/ui/respawn';\n\nconst el = ${name}({ /* the same props as in React */ });\ndocument.getElementById('app').append(el);` } mode="static" />
      <p className="gd-p">
        Returns a { RETURNS[name] ? <code>{ RETURNS[name] }</code> : 'DOM element' }. { NOTES[name] || 'update(changes) rebuilds it with the changes and swaps it in place.' }
        {' '}The props are the same as in React: the <a href={ href('Components', name) }>React page</a> has the full table.
      </p>
      { demo ? <Demo { ...demo } heading={ false } /> : <p className="gd-note">No live demo yet.</p> }
      <p className="gd-note">How Respawn versions work, and how to install them: <a href={ href('Respawn') }>Respawn</a>.</p>
    </div>
  );
}
