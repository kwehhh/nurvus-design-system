// Progress rules shared by the React and the Respawn Progress (no React here).
import type { IconName } from './icons';

export type ProgressStatus = 'active' | 'success' | 'warning' | 'critical';

/** What each status means, in words and as an icon, so it never rests on color alone (WCAG 1.4.1). */
export const PROGRESS_STATUS: Record<ProgressStatus, { word: string; icon?: IconName }> = {
  active: { word: '' },
  success: { word: 'Done', icon: 'check' },
  warning: { word: 'Needs attention', icon: 'warning' },
  critical: { word: 'Failed', icon: 'error' },
};

/** 0 to 100, whole numbers; anything else (NaN, -5, 140) is pulled into range. */
export const clampPercent = (percent: number): number => (Number.isFinite(percent) ? Math.round(Math.min(100, Math.max(0, percent))) : 0);

/** What screen readers say for the value: "40%", or "100%, Done". */
export const progressValueText = (percent: number, status: ProgressStatus): string => {
  const word = (PROGRESS_STATUS[status] || PROGRESS_STATUS.active).word;
  return word ? `${clampPercent(percent)}%, ${word}` : `${clampPercent(percent)}%`;
};
