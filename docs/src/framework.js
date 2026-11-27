import React from 'react';
import { href } from './router';

// One list of components, two ways to use each: React or Respawn. The docs
// remember which one the reader last looked at, and the sidebar and search
// link each component to that version.
const KEY = 'nurvus.docs.framework';
const EVENT = 'nurvus-docs:framework';

export const FRAMEWORKS = [
  { id: 'react', name: 'React' },
  { id: 'respawn', name: 'Respawn' },
];

/** The framework the reader last chose: 'react' (the default) or 'respawn'. */
export function getFramework() {
  try { return window.localStorage.getItem(KEY) === 'respawn' ? 'respawn' : 'react'; } catch (e) { return 'react'; }
}

/** Remembers the framework and tells every useFramework() about it. */
export function setFramework(framework) {
  if (framework === getFramework()) return;
  try { window.localStorage.setItem(KEY, framework); } catch (e) { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: framework }));
}

/** The chosen framework; follows setFramework(). */
export function useFramework() {
  const [framework, set] = React.useState(getFramework);
  React.useEffect(() => {
    const onChange = (e) => set(e.detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  return framework;
}

/** A component's page in one framework. */
export const componentHref = (name, framework) => (framework === 'respawn' ? href('Respawn', name) : href('Components', name));
