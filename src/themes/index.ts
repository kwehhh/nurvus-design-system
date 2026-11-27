// The NURVUS themes. Each one is a complete, standalone palette: every role
// token has a value, and no theme inherits from another. Add a theme by adding
// a JSON file here (see roles.json for what each token is for) and listing it
// below; tools/build-tokens.js turns them into [data-theme="<id>"] CSS.
import apolloWhite from './apollo-white.json';
import dopamine from './dopamine.json';
import tokyoNeon from './tokyo-neon.json';
import nether from './nether.json';
import netherNeon from './nether-neon.json';
import outworld from './outworld.json';
import arcane from './arcane.json';
import rolesJson from './roles.json';

/** One of the 27 color roles every theme defines, e.g. 'bg', 'text', 'accent'. */
export type ThemeRole =
  | 'bg' | 'bg-alt' | 'bg-deep' | 'surface' | 'surface-hover' | 'border' | 'border-strong'
  | 'text' | 'text-muted' | 'text-subtle' | 'accent' | 'accent-fill' | 'accent-soft' | 'on-accent'
  | 'success' | 'warning' | 'danger' | 'info' | 'cursor' | 'selection'
  | 'syntax-keyword' | 'syntax-string' | 'syntax-function' | 'syntax-number' | 'syntax-comment'
  | 'syntax-tag' | 'syntax-attr';

/** A theme, as in src/themes/<id>.json. */
export interface Theme {
  /** Used in data-theme and setTheme, e.g. 'tokyo-neon'. */
  id: string;
  /** Display name, e.g. 'Tokyo Neon'. */
  name: string;
  mode: 'light' | 'dark';
  /** 'demo' themes warn on a contrast failure; 'stable' ones fail the build. */
  status: 'demo' | 'stable';
  /** Position in menus (light themes first). */
  order: number;
  keywords: string;
  summary: string;
  description: string;
  bestFor: string;
  /** Which roles the theme's showcase card uses. */
  showcase: { label: string; title: string; tagline: string; swatches: string[] };
  /** Every role's color (hex). */
  colors: Record<ThemeRole, string>;
}

/** What a role is for, and which roles it must contrast with. */
export interface ThemeRoleInfo {
  /** Which group the role belongs to, e.g. "Text". */
  group: string;
  /** What the role is for. */
  use: string;
  /** Contrast it must meet against other roles. */
  check?: { against: ThemeRole[]; min: number };
}

/** All themes, in display order (light first). */
export const themes: Theme[] = ([apolloWhite, dopamine, tokyoNeon, nether, netherNeon, outworld, arcane] as Theme[])
  .sort((a, b) => a.order - b.order);

/** The theme a page gets with no data-theme attribute at all. */
export const DEFAULT_THEME = 'apollo-white';

/** What each role token is for, and the contrast it must meet. */
export const roles: Record<ThemeRole, ThemeRoleInfo> = rolesJson as Record<ThemeRole, ThemeRoleInfo>;
