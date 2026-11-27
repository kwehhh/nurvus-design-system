import React from 'react';

/** Saves `text` as a file called `filename` (the browser's normal download). */
export function downloadText(filename, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * A button label that says "Copied" for a moment after a copy works.
 * Returns [label, copy(text)].
 */
export function useCopy(label) {
  const [state, setState] = React.useState(null);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const show = (next) => {
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState(null), 1500);
  };
  const copy = (text) => {
    if (!navigator.clipboard) { show('failed'); return; }
    navigator.clipboard.writeText(text).then(() => show('copied'), () => show('failed'));
  };
  return [state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label, copy];
}
