import React from 'react';
import { Table } from '@nurvus/ui';
import Logo, { Wordmark, LOGO_MOTIONS } from '../components/Logo';
import MotionToggle from '../components/MotionToggle';
import { useBrandFx, Burst } from '../components/brandFx';
import './Guides.scss';
import './AnimatedType.scss'; // .at-controls, .at-replay
import './Brand.scss';

const FILES = [
  { file: 'nurvus-logo.svg', what: 'The logo: the mark with the wordmark in light lettering (#F4F5F8), for dark backgrounds.' },
  { file: 'nurvus-logo-dark.svg', what: 'The same, with the wordmark in dark navy (#0B1326), for light backgrounds.' },
  { file: 'favicon.svg', what: 'The mark alone, cropped square: app icons, favicons, avatars.' },
  { file: 'nurvus-wordmark.svg', what: 'The wordmark alone, light lettering.' },
  { file: 'nurvus-wordmark-dark.svg', what: 'The wordmark alone, dark navy lettering.' },
];

const SPECS = [
  { property: 'Letterforms', spec: 'Drawn as vector paths: an extended (wide) geometric sans-serif. No font is needed to show it.' },
  { property: 'Weight', spec: 'Medium to semibold (about 500 to 600): strokes are 15 units on 80-unit capitals.' },
  { property: 'Letter spacing', spec: 'Wide: about 0.2em between letters.' },
  { property: 'Case', spec: 'Capitals only.' },
  { property: 'Proportions', spec: '617 by 83 units: 7.43 to 1.' },
  { property: 'Colors', spec: '#F4F5F8 on dark backgrounds; #0B1326 (dark navy) on light ones. The mark keeps its own gradients on both.' },
  { property: '"NURVUS UI"', spec: 'The same six letters, a word space, the wordmark\'s U again and an I drawn to match. On this site it is filled with the theme\'s rainbow.' },
];

/** One motion: the mark moving, its name and what it does. Assemble can replay. */
function MotionCard({ motion }) {
  const [run, setRun] = React.useState(0);
  return (
    <figure className="br-motion" data-motion={ motion.id }>
      <div className="br-stage">
        <Logo key={ run } id={ `br-${motion.id}-${run}` } motion={ motion.id } className="br-mark" />
      </div>
      <figcaption>
        <span className="br-motion-head">
          <strong>{ motion.name }</strong>
          { motion.id === 'assemble' && <button type="button" className="at-replay" onClick={ () => setRun((n) => n + 1) }>Replay</button> }
        </span>
        <span>{ motion.about }</span>
      </figcaption>
    </figure>
  );
}

const FX = {
  hover: {
    name: 'Hover: spin up',
    about: 'The rings spin up to six times their speed, easing in, and the colors flow faster; when the pointer leaves they ease back down. Keyboard focus on the header logo does the same.',
    button: 'Spin up',
  },
  click: {
    name: 'Click: flare',
    about: 'A flare, like a shield recharging: the mark dips and springs back, two rings of light spread from it, a light sweeps across the letters and the rings whip round once.',
    button: 'Flare',
  },
};

/**
 * One of the logo's answers to the pointer, live: the header's lockup (mark +
 * "NURVUS UI") on the page's own background, so it looks as it does in the
 * header in this theme. The button plays it for keyboard and touch.
 */
function FxCard({ kind }) {
  const fx = useBrandFx();
  const [spun, setSpun] = React.useState(false);
  const pointer = kind === 'hover'
    ? { onMouseEnter: fx.onMouseEnter, onMouseLeave: () => { if (!spun) fx.onMouseLeave(); } }
    : { onClick: fx.onClick };
  const press = () => {
    if (kind === 'click') { fx.onClick(); return; }
    if (spun) fx.onMouseLeave(); else fx.onMouseEnter();
    setSpun(!spun);
  };
  return (
    <figure className="br-fx" data-fx-demo={ kind }>
      <div className="br-fx-stage nv-brand-fx" ref={ fx.ref } data-hover={ spun || undefined } { ...pointer }>
        <span className="nv-brand-mark-wrap"><Logo id={ `br-fx-${kind}` } motion="current" className="br-fx-mark" /><Burst /></span>
        <Wordmark />
      </div>
      <figcaption>
        <span className="br-motion-head">
          <strong>{ FX[kind].name }</strong>
          <button type="button" className="at-replay" onClick={ press } aria-pressed={ kind === 'hover' ? spun : undefined }>{ FX[kind].button }</button>
        </span>
        <span>{ FX[kind].about }</span>
      </figcaption>
    </figure>
  );
}

/** The NURVUS logo: the files, the wordmark's letters, how it moves, and how to use it. */
export default function Brand() {
  return (
    <div className="dx-page gd br">
      <h1 className="dx-page-title">Brand</h1>
      <p className="dx-lede">
        The NURVUS logo, its letters, and how it moves. A vortex of currents: blue, cyan, violet and pink segments
        turning around an open center, over a wide, calm wordmark.
      </p>

      <h2 className="gd-h2">The logo</h2>
      <div className="br-pair">
        <div className="br-panel br-panel-dark"><Logo id="br-logo-dark" wordmark title="NURVUS" className="br-logo" /></div>
        <div className="br-panel br-panel-light"><Logo id="br-logo-light" wordmark title="NURVUS" className="br-logo" /></div>
      </div>
      <p className="gd-p">
        On a light background the wordmark is dark navy; the mark is the same on both. On this site the wordmark is
        drawn in the page's text color, so it follows every theme.
      </p>
      <h3 className="gd-h3">Files</h3>
      <ul className="br-files">
        { FILES.map((f) => (
          <li key={ f.file }>
            <a href={ f.file } download>{ f.file }</a>
            <span>{ f.what }</span>
          </li>
        )) }
      </ul>

      <h2 className="gd-h2">The wordmark</h2>
      <div className="br-panel br-panel-dark br-wordmark-panel">
        <img src="nurvus-wordmark.svg" alt="NURVUS" className="br-wordmark-img" />
      </div>
      <Table columns={ [{ dataKey: 'property', title: 'Property' }, { dataKey: 'spec', title: 'Specification' }] } data={ SPECS.map((s) => ({ ...s, key: s.property })) } />
      <p className="gd-p">The site's own name, in those letters and the theme's rainbow:</p>
      <div className="br-ui"><Wordmark /></div>

      <h2 className="gd-h2">Motion</h2>
      <p className="gd-p">
        Six ways the mark can move, each in plain CSS. The home page uses Current; the header Assembles when the site
        opens, then turns; the Loader is Pulse. All of them stop when the system asks for less motion, and under Pause
        motion (except the Loader's light: see Loader).
      </p>
      <div className="at-controls"><MotionToggle /></div>
      <div className="br-motions">
        { LOGO_MOTIONS.map((m) => <MotionCard key={ m.id } motion={ m } />) }
      </div>

      <h2 className="gd-h2">Hover and click</h2>
      <p className="gd-p">
        The logo in the header and the title on the home page answer the pointer. Point at these, click them, or use
        the buttons. Nothing moves when the system asks for less motion or under Pause motion.
      </p>
      <div className="br-fxs">
        <FxCard kind="hover" />
        <FxCard kind="click" />
      </div>

      <h2 className="gd-h2">Using it</h2>
      <ul className="gd-list">
        <li><strong>Room around it:</strong> keep clear space at least the height of the wordmark's N on every side.</li>
        <li><strong>Smallest sizes:</strong> the mark 16 pixels across (favicons); the wordmark 10 pixels tall.</li>
        <li><strong>Keep it whole:</strong> don't stretch it, rotate the wordmark, recolor single segments, or put light lettering on a light background.</li>
        <li><strong>Motion:</strong> one moving logo per screen, and never faster than these: a logo that races pulls the eye from the work.</li>
      </ul>
    </div>
  );
}
