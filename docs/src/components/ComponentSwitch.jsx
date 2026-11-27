import React from 'react';
import { href } from '../router';

/** React | Respawn: the same component's two versions, one click apart. */
export default function ComponentSwitch({ name, current }) {
  return (
    <nav className="dx-switch" aria-label={ `${name}: React or Respawn` }>
      <a href={ href('Components', name) } aria-current={ current === 'react' ? 'page' : undefined }>React</a>
      <a href={ href('Respawn', name) } aria-current={ current === 'respawn' ? 'page' : undefined }>Respawn</a>
    </nav>
  );
}
