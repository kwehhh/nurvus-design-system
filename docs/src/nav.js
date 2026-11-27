import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from './router';

/**
 * The sidebar. People using the library first (Get started, Foundations,
 * Themes, Components); people building it last (Contributing).
 * A section without an href is a plain heading. `divider` draws a hairline
 * above an item (Themes: the guides, then the themes themselves).
 */
export const sections = [
  {
    name: 'Get started',
    href: href(),
    items: [{ name: 'Without React (Respawn)', href: href('Guides', 'Respawn'), hint: 'The components as plain DOM, no React' }],
  },
  {
    name: 'Foundations',
    items: [
      { name: 'Spacing', href: href('Foundations', 'Spacing'), hint: '4px base, 8px rhythm' },
      { name: 'Typography', href: href('Foundations', 'Typography'), hint: 'Inter, the type scale, Text and Title' },
    ],
  },
  {
    name: 'Themes',
    href: href('Themes'),
    items: [
      { name: 'Applying a theme', href: href('Themes', 'Applying a theme'), hint: 'Default, switching, loading, nesting' },
      { name: 'Theme Studio', href: href('Themes', 'Theme Studio'), hint: 'Make a theme from your brand colors' },
      { name: 'Accessibility report', href: href('Themes', 'Accessibility report'), hint: 'Every contrast pair, every theme' },
      ...themes.map((t, i) => ({ name: t.name, href: href('Themes', t.name), hint: t.keywords, divider: i === 0 })),
    ],
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
