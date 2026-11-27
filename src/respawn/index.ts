// @nurvus/ui/respawn: the NURVUS components as plain DOM, for Respawn and any
// page without React. Each component is a function that takes the same props
// as the React one and returns a real element with the same markup, so the
// same CSS and themes style it:
//
//   import { Button, setTheme } from '@nurvus/ui/respawn';
//   document.body.append(Button({ children: 'Save', onClick: () => save() }));
//
// Every element has update(changes): it rebuilds the element with the changes,
// swaps it into the page and returns it (see ./update.ts).
//
// Core CSS: the primitives, the type roles and the default theme (Apollo
// White), then every component's styles, injected once, in the same order as
// the React entry (src/index.ts). Other themes are opt-in files:
//   import '@nurvus/ui/themes/tokyo-neon.css';   (or themes/all.css)
import '../styles/theme.scss';

export {
  themes, DEFAULT_THEME, THEME_STORAGE_KEY, THEME_CHANGE_EVENT,
  getTheme, currentTheme, setTheme, initTheme,
} from '../theme';
export type { SetThemeOptions } from '../theme';
export { roles as themeRoles } from '../themes';
export type { Theme, ThemeRole, ThemeRoleInfo } from '../themes';

// Building blocks: Respawn-style element building, and the update() contract.
export { spawn } from './spawn';
export type { Child, ElementProps, Events, Listener, SpawnProps, Style } from './spawn';
export type { NurvusElement } from './update';

// Components, and the types of their props (same order as src/index.ts, so the CSS lands in the same order).
export { default as Button } from './Button';
export type { ButtonProps, ButtonSize, ButtonType } from './Button';
export { default as ButtonGroup } from './ButtonGroup';
export type { ButtonGroupProps } from './ButtonGroup';
export { default as Link } from './Link';
export type { LinkProps } from './Link';
export { default as Progress } from './Progress';
export type { ProgressProps, ProgressSize, ProgressStatus } from './Progress';
export { default as Layout } from './Layout';
export type { LayoutProps, Spacing, LegacySpacing } from './Layout';
export { default as Menu } from './Menu';
export type { MenuProps, MenuItem } from './Menu';
export { default as NavList } from './NavList';
export type { NavListProps, NavListItem, NavListSection } from './NavList';
export { default as FullPageModal } from './FullPageModal';
export type { FullPageModalProps } from './FullPageModal';
export { default as HistoryList } from './HistoryList';
export type { HistoryListProps, HistoryStep } from './HistoryList';
export { default as Panel } from './Panel';
export type { PanelProps, PanelPadding } from './Panel';
export { default as Table } from './Table';
export type { TableProps, TableColumn, TableRow } from './Table';
export { default as Tag } from './Tag';
export type { TagProps, TagTone } from './Tag';
export { default as Text } from './Text';
export type { TextProps, TextVariant, TextTone, TextWeight } from './Text';
export { default as Title } from './Title';
export type { TitleProps, TitleLevel, TitleType } from './Title';
