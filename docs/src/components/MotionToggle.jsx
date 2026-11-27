import React from 'react';

// Pause every animation on the site, remembered. WCAG 2.2.2 (Pause, Stop,
// Hide): anything that moves by itself for more than five seconds needs a
// way to stop it. styles.scss pauses all animations under
// <html data-motion="paused">; prefers-reduced-motion stops them anyway.
const KEY = 'nurvus.docs.motion';
const EVENT = 'nurvus-docs:motion';

const isPaused = () => {
  try { return window.localStorage.getItem(KEY) === 'paused'; } catch (e) { return false; }
};
const apply = (paused) => {
  if (paused) document.documentElement.setAttribute('data-motion', 'paused');
  else document.documentElement.removeAttribute('data-motion');
};
apply(isPaused());

/** A small "Pause motion" / "Play motion" button; every copy stays in step. */
export default function MotionToggle({ className = '' }) {
  const [paused, setPaused] = React.useState(isPaused);
  React.useEffect(() => {
    const onChange = (e) => setPaused(e.detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  const toggle = () => {
    const next = !paused;
    try { window.localStorage.setItem(KEY, next ? 'paused' : 'playing'); } catch (e) { /* storage blocked */ }
    apply(next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  };
  return (
    <button type="button" className={ `dx-motion-toggle ${className}` } aria-pressed={ paused } onClick={ toggle }>
      <span className="dx-motion-icon" data-paused={ paused } aria-hidden="true" />
      { paused ? 'Play motion' : 'Pause motion' }
    </button>
  );
}
