import React from 'react';

// Which button the header shows on a desktop: 'hamburger' (the default since
// round 10: Slide, asymmetric lines) or 'sidebar' (the window-with-a-pane
// icon). Chosen on Foundations > Review, remembered, and live everywhere.
const KEY = 'nurvus.docs.navButton';
const EVENT = 'nurvus:navbutton';

export const getNavButton = () => {
  try { return window.localStorage.getItem(KEY) === 'sidebar' ? 'sidebar' : 'hamburger'; } catch (e) { return 'hamburger'; }
};

export const setNavButton = (value) => {
  try { window.localStorage.setItem(KEY, value); } catch (e) { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
};

export function useNavButton() {
  const [value, setValue] = React.useState(getNavButton);
  React.useEffect(() => {
    const on = () => setValue(getNavButton());
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return value;
}
