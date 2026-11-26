import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from './router';

/** The sidebar: Themes (overview + one page per theme), then Components. */
export const sections = [
  {
    name: 'Themes',
    href: href('Themes'),
    items: themes.map((t) => ({ name: t.name, href: href('Themes', t.name), hint: t.keywords })),
  },
  {
    name: 'Components',
    href: href('Components'),
    items: components.map((c) => ({ name: c.name, href: href('Components', c.name), hint: c.description })),
  },
];
