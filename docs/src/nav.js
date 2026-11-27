import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from './router';

/**
 * The sidebar. People using the library first (Get started, Foundations,
 * Themes, Components); people building it last (Contributing).
 * A section without an href is a plain heading.
 */
export const sections = [
  {
    name: 'Get started',
    href: href(),
    items: [{ name: 'Applying a theme', href: href('Guides', 'Applying a theme'), hint: 'Default, switching, saving, nesting' }],
  },
  {
    name: 'Foundations',
    items: [{ name: 'Spacing', href: href('Foundations', 'Spacing'), hint: '4px base, 8px rhythm' }],
  },
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
  {
    name: 'Contributing',
    items: [{ name: 'Add a component', href: href('Contributing', 'Add a component'), hint: 'For people building the library' }],
  },
];
