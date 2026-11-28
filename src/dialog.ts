// Dialog rules shared by the React and the Respawn FullPageModal (no React
// here): what can take focus inside, Tab kept inside, Esc to close.

const FOCUSABLE = [
  'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', 'iframe', '[contenteditable="true"]', '[tabindex]',
].join(',');

/** The elements Tab can reach inside `root`, in order (shown ones, not tabindex="-1"). */
export function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
    .filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);
}

/**
 * The keys of a modal dialog (the WAI-ARIA dialog pattern): Tab and
 * Shift+Tab go round the dialog's own controls and never leave it; Esc calls
 * onClose. Returns true when it used the key.
 */
export function dialogKeydown(event: KeyboardEvent, dialog: HTMLElement, onClose?: () => void): boolean {
  if (event.key === 'Escape') {
    if (!onClose) return false;
    event.preventDefault();
    onClose();
    return true;
  }
  if (event.key !== 'Tab') return false;
  const stops = focusables(dialog);
  if (!stops.length) { event.preventDefault(); dialog.focus(); return true; }
  const first = stops[0];
  const last = stops[stops.length - 1];
  const at = document.activeElement;
  if (event.shiftKey && (at === first || at === dialog)) { event.preventDefault(); last.focus(); return true; }
  if (!event.shiftKey && at === last) { event.preventDefault(); first.focus(); return true; }
  return false;
}

/** Moves focus to the dialog itself once it shows (screen readers then say its name and "dialog"). */
export function focusDialog(dialog: HTMLElement): void {
  const go = () => { if (dialog.isConnected) dialog.focus({ preventScroll: true }); };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(go); else go();
}

/** Gives focus back to what had it before the dialog opened, if it is still on the page. */
export function restoreFocus(opener: Element | null): void {
  if (opener && (opener as HTMLElement).focus && opener.isConnected) (opener as HTMLElement).focus({ preventScroll: true });
}
