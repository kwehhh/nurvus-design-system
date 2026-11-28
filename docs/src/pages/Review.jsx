import React from 'react';
import { Tag } from '@nurvus/ui';
import MenuToggle, { MENU_MORPHS } from '../components/MenuToggle';
import SidebarToggle from '../components/SidebarToggle';
import LogoVariant from '../components/LogoVariant';
import { Wordmark } from '../components/Logo';
import './Guides.scss';
import './Review.scss';

// Choices to review (rounds 8-9, 2026-11-28): Foundations > Review, #/Review.

const LOGOS = [
  { id: 'today', name: 'Today', about: 'The logo as drawn. On white, the top-right arc starts almost white (1.05:1) and the mint ends are under 2:1; on dark, the two navy pieces vanish; at 28px three pieces are specks.', light: {}, dark: {} },
  { id: 'deep', name: 'Deeper colors', about: 'Same shapes. Every gradient end is at least 3:1 against the background: darker on white, the navy pieces lifted on dark. Hue kept.', light: { tone: 'light' }, dark: { tone: 'dark' } },
  { id: 'small', name: 'Small-size cut', about: 'Same colors. The three specks left out, and every piece a little bolder (a thin outline in its own color), as icon sets do for small sizes.', light: { simple: true, weight: 20 }, dark: { simple: true, weight: 20 } },
  { id: 'both', name: 'Deeper + small-size cut', about: 'Both: the colors hold up on white and on dark, and the shape reads at 16 to 32 pixels. Big sizes keep the full drawing.', light: { tone: 'light', simple: true, weight: 20 }, dark: { tone: 'dark', simple: true, weight: 20 }, pick: true },
  { id: 'inner', name: 'Thicker inside', about: 'Deeper colors and the small-size cut, with the inner ring much bolder than the outer: the ring reads as one solid band at 16 to 28 pixels.', light: { tone: 'light', simple: true, weight: 16, innerWeight: 44 }, dark: { tone: 'dark', simple: true, weight: 16, innerWeight: 44 } },
  { id: 'inner-today', name: 'Thicker inside, today\'s colors', about: 'Only the inner ring bolder; the colors and every piece as drawn.', light: { innerWeight: 40 }, dark: { innerWeight: 40 } },
  { id: 'tile', name: 'On a tile', about: 'The logo exactly as drawn, on a dark navy rounded square (like an app icon or the favicon). Same look on every background.', light: { tile: true }, dark: { tile: true } },
  { id: 'mono', name: 'One gradient', about: 'At small sizes, one blue-to-violet gradient over the whole mark instead of 18: calm and crisp, like a monogram.', light: { tone: 'mono', simple: true, weight: 16 }, dark: { tone: 'mono', simple: true, weight: 16 } },
];

const SIZES = [16, 28, 48];

function MorphDemo({ morph }) {
  const [open, setOpen] = React.useState(true);
  return (
    <figure className="rv-card">
      <div className="rv-stage">
        <MenuToggle open={ open } morph={ morph.id } onClick={ () => setOpen(!open) } controls="rv-none" />
      </div>
      <figcaption>
        <strong>{ morph.name }</strong>{ morph.id === 'slide' && <Tag tone="accent">Phones now</Tag> }
        <span>{ morph.about }</span>
      </figcaption>
    </figure>
  );
}

/** Things to choose between, drawn live: the menu button's shapes and the logo at small sizes. */
export default function Review() {
  const [sideOpen, setSideOpen] = React.useState(true);
  return (
    <div className="dx-page gd rv">
      <h1 className="dx-page-title">Review</h1>
      <p className="dx-lede">Choices for round 8, live. Click the buttons; switch the theme at the top right to see the header column change.</p>

      <h2 className="gd-h2">The menu button</h2>
      <p className="gd-p">
        The header uses the sidebar icon on a desktop (the sidebar sits beside the page) and the hamburger on a phone
        (the menu covers the page), sliding into a cross. Click each one to open and close it.
      </p>
      <div className="rv-morphs">
        { MENU_MORPHS.map((m) => <MorphDemo key={ m.id } morph={ m } />) }
        <figure className="rv-card">
          <div className="rv-stage"><SidebarToggle open={ sideOpen } onClick={ () => setSideOpen(!sideOpen) } controls="rv-none" /></div>
          <figcaption><strong>Sidebar toggle</strong><Tag tone="accent">Desktop now</Tag><span>The window-with-a-pane icon, its pane filling while the panel shows (SidebarToggle; the static one is the panel-left icon). VS Code, shadcn/ui and Keyframery use it for a docked sidebar.</span></figcaption>
        </figure>
      </div>

      <h2 className="gd-h2">The logo at small sizes</h2>
      <p className="gd-p">Each row at 16, 28 (the header) and 48 pixels, on white and on the dark navy, then in this site&apos;s header in the current theme.</p>
      <div className="rv-logos" role="table" aria-label="Logo options">
        <div className="rv-row rv-head" role="row">
          <span role="columnheader">Option</span>
          <span role="columnheader">On white</span>
          <span role="columnheader">On dark</span>
          <span role="columnheader">In the header</span>
        </div>
        { LOGOS.map((v) => (
          <div key={ v.id } className="rv-row" role="row" data-pick={ v.pick || undefined }>
            <span className="rv-name" role="cell"><strong>{ v.name }</strong>{ v.pick && <Tag tone="success">My pick</Tag> }<span>{ v.about }</span></span>
            <span className="rv-swatch rv-white" role="cell">{ SIZES.map((s) => <LogoVariant key={ s } id={ `rv-${v.id}-w${s}` } size={ s } { ...v.light } />) }</span>
            <span className="rv-swatch rv-dark" role="cell">{ SIZES.map((s) => <LogoVariant key={ s } id={ `rv-${v.id}-d${s}` } size={ s } { ...v.dark } />) }</span>
            <span className="rv-swatch rv-header" role="cell">
              <span className="rv-lockup"><LogoVariant id={ `rv-${v.id}-h` } size={ 28 } { ...v.light } /><Wordmark /></span>
            </span>
          </div>
        )) }
      </div>
      <p className="gd-note">
        The header column uses the on-white settings; on a dark theme the site would switch to the on-dark ones. Logos are
        exempt from WCAG contrast, so 3:1 here is a readability target, not a rule.
      </p>
    </div>
  );
}
