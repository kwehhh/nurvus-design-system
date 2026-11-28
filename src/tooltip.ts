// Tooltip rules shared by the React and the Respawn Tooltip (no React here).

/** True when focus on `el` came from the keyboard (the browser shows a focus ring). */
export const keyboardFocus = (el: EventTarget | null): boolean => {
  try { return !!el && (el as Element).matches(':focus-visible'); } catch (e) { return true; }
};

/** The platform's modifier for shortcuts: ⌘ on Apple devices, Ctrl elsewhere. */
export const modKey = (): '⌘' | 'Ctrl' => {
  if (typeof navigator === 'undefined') return 'Ctrl';
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = (nav.userAgentData && nav.userAgentData.platform) || navigator.platform || navigator.userAgent;
  return /mac|iphone|ipad|ipod/i.test(platform) ? '⌘' : 'Ctrl';
};
