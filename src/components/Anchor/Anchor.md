Use it beside a long page, at the top right. Rows are links (`<nav>`, "On this page"), so Tab reaches each one and Enter goes there: the page scrolls to the section and focus moves to it. The row being read carries `aria-current="location"`, and the highlight slides to it as you scroll (instantly when the system asks for less motion). Long labels end in "…": the full label is the row's tooltip.

Scroll the box on the left: the highlight follows, bending in and out with the levels. Click a row to jump.
```jsx
import { Anchor, Text, Title } from '@nurvus/ui';

const SECTIONS = [
  { id: 'demo-preview', label: 'Preview', level: 1 },
  { id: 'demo-install', label: 'Installation', level: 1 },
  { id: 'demo-usage', label: 'Usage', level: 1 },
  { id: 'demo-anatomy', label: 'Anatomy', level: 2 },
  { id: 'demo-examples', label: 'Examples', level: 1 },
  { id: 'demo-basic', label: 'Basic', level: 2 },
  { id: 'demo-rail', label: 'Icon rail', level: 2 },
  { id: 'demo-phone', label: 'On a phone', level: 3 },
  { id: 'demo-api', label: 'API reference', level: 1 },
];

<div style={ { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 12rem', gap: 24 } }>
  <div id="anchor-demo-box" style={ { height: 280, overflow: 'auto', padding: '0 16px', border: '1px solid var(--nv-border)', borderRadius: 12 } }>
    { SECTIONS.map((s) => (
      <section key={ s.id } style={ { minHeight: 160, paddingTop: 12 } }>
        <Title level={ s.level + 2 } id={ s.id } style={ { scrollMarginTop: 8 } }>{ s.label }</Title>
        <Text tone="muted">The { s.label.toLowerCase() } section.</Text>
      </section>
    )) }
  </div>
  <Anchor
    id="anchor-demo"
    scrollRoot="#anchor-demo-box"
    offset={ 24 }
    updateHash={ false }
    items={ SECTIONS.map((s) => ({ href: `#${s.id}`, label: s.label, level: s.level })) }
  />
</div>
```

Set the section yourself with `current` (for a page that tracks it already, or a demo).
```jsx
import { Anchor, Button, Layout } from '@nurvus/ui';

const ITEMS = [
  { href: '#a', label: 'Overview' },
  { href: '#b', label: 'Install', level: 2 },
  { href: '#c', label: 'Configure', level: 2 },
  { href: '#d', label: 'Deploy' },
];

const Controlled = () => {
  const [at, setAt] = React.useState(0);
  return (
    <Layout display="flex" itemSpacing={ 32 } alignItems="flex-start">
      <Anchor id="anchor-set" current={ ITEMS[at].href } items={ ITEMS } onNavigate={ (href, event) => { event.preventDefault(); setAt(ITEMS.findIndex((i) => i.href === href)); } } />
      <Button size="small" type="secondary" onClick={ () => setAt((at + 1) % ITEMS.length) }>Next section</Button>
    </Layout>
  );
};
<Controlled />
```
