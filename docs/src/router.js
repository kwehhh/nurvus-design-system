import React from 'react';

/** "#/Themes/Tokyo%20Neon" -> ['Themes', 'Tokyo Neon']. */
export function parseHash(hash) {
  return hash.replace(/^#!?\/?/, '').split('/').filter(Boolean).map((part) => {
    try { return decodeURIComponent(part); } catch (e) { return part; }
  });
}

/** "#/Themes/Tokyo%20Neon" from ['Themes', 'Tokyo Neon']. */
export const href = (...parts) => `#/${parts.map((p) => encodeURIComponent(p)).join('/')}`;

/** The current route as path parts; follows hash changes. */
export function useRoute() {
  const [hash, setHash] = React.useState(window.location.hash);
  React.useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parseHash(hash);
}
