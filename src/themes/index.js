// The NURVUS themes. Each one is a complete, standalone palette: every role
// token has a value, and no theme inherits from another. Add a theme by adding
// a JSON file here (see roles.json for what each token is for) and listing it
// below; tools/build-tokens.js turns them into [data-theme="<id>"] CSS blocks.
import apolloWhite from './apollo-white.json';
import dopamine from './dopamine.json';
import tokyoNeon from './tokyo-neon.json';
import nether from './nether.json';
import netherNeon from './nether-neon.json';
import outworld from './outworld.json';
import arcane from './arcane.json';
import roles from './roles.json';

/** All themes, in display order (light first). */
export const themes = [apolloWhite, dopamine, tokyoNeon, nether, netherNeon, outworld, arcane]
  .sort((a, b) => a.order - b.order);

/** The theme a page gets with no data-theme attribute at all. */
export const DEFAULT_THEME = 'apollo-white';

/** What each role token is for, and the contrast it must meet. */
export { roles };
