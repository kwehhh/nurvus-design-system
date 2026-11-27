import { themes } from '@nurvus/ui';
import { components } from 'virtual:nurvus-docs';
import { href } from './router';
import { componentHref } from './framework';

/**
 * The sidebar. People using the library first (Get started, Foundations,
 * Themes, Components); people building it last (Contributing). A section
 * without an href is a plain heading. `divider` draws a hairline above an item.
 * Components are listed once; each links to its React or Respawn page,
 * whichever the reader last chose (`framework`).
 */
export function navSections(framework = 'react') {
  return [
    {
      id: 'get-started',
      name: 'Get started',
      href: href(),
      items: [
        { name: 'Supported libraries', href: href('Guides', 'Supported libraries'), hint: 'React 16.8 to 19, Respawn, plain HTML, any stack' },
        { name: 'Respawn', href: href('Respawn'), hint: 'Every component as plain DOM, no React' },
      ],
    },
    {
      id: 'foundations',
      name: 'Foundations',
      items: [
        { name: 'Spacing', href: href('Foundations', 'Spacing'), hint: '4px base, 8px rhythm' },
        { name: 'Typography', href: href('Foundations', 'Typography'), hint: 'Inter, the type scale, Text and Title' },
        { name: 'Animated type', href: href('Foundations', 'Animated type'), hint: 'Variable weight, letter by letter, shine, neon' },
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
      id: 'components',
      name: 'Components',
      href: href('Components'),
      items: components.map((c) => ({ name: c.name, href: componentHref(c.name, framework), hint: c.description })),
    },
    {
      id: 'contributing',
      name: 'Contributing',
      items: [{ name: 'Add a component', href: href('Contributing', 'Add a component'), hint: 'For people building the library' }],
    },
  ];
}
