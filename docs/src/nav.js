import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from './router';

/**
 * The sidebar. People using the library first (Get started, Foundations,
 * Themes, then the components for React and for Respawn); people building it
 * last (Contributing). A section without an href is a plain heading.
 * `divider` draws a hairline above an item.
 */
export const sections = [
  {
    id: 'get-started',
    name: 'Get started',
    href: href(),
    items: [{ name: 'Supported libraries', href: href('Guides', 'Supported libraries'), hint: 'React 16.8 to 19, Respawn, plain HTML, any stack' }],
  },
  {
    id: 'foundations',
    name: 'Foundations',
    items: [
      { name: 'Spacing', href: href('Foundations', 'Spacing'), hint: '4px base, 8px rhythm' },
      { name: 'Typography', href: href('Foundations', 'Typography'), hint: 'Inter, the type scale, Text and Title' },
    ],
  },
  {
    id: 'themes',
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
    id: 'react',
    name: 'React',
    href: href('Components'),
    items: components.map((c) => ({ name: c.name, href: href('Components', c.name), hint: c.description })),
  },
  {
    id: 'respawn',
    name: 'Respawn',
    href: href('Respawn'),
    items: components.map((c) => ({ name: c.name, href: href('Respawn', c.name), hint: `${c.name} as plain DOM, no React` })),
  },
  {
    id: 'contributing',
    name: 'Contributing',
    items: [{ name: 'Add a component', href: href('Contributing', 'Add a component'), hint: 'For people building the library' }],
  },
];
