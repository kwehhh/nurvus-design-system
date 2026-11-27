import React from 'react';
import Example from '../examples/Example';
import MotionToggle from '../components/MotionToggle';
import { href } from '../router';
import './Guides.scss';
import './AnimatedType.scss';

/**
 * Letters as separate spans, for animations that move them one by one.
 * Screen readers would spell the spans out letter by letter, so the spans are
 * hidden from them, and the whole text is there once for them, visually hidden.
 */
function Letters({ text, className }) {
  return (
    <span className={ className }>
      <span className="at-sr-only">{ text }</span>
      { Array.from(text).map((ch, i) => (
        // eslint-disable-next-line react/no-array-index-key -- letters repeat; their place is their identity
        <span key={ i } aria-hidden="true" style={ { '--i': i } }>{ ch === ' ' ? ' ' : ch }</span>
      )) }
    </span>
  );
}

/** One demo: a live preview, what it is, and the CSS behind it. */
function Demo({ id, title, children, about, css, replay }) {
  const [run, setRun] = React.useState(0);
  return (
    <section className="at-demo" data-demo={ id }>
      <div className="at-demo-head">
        <h3 className="gd-h3">{ title }</h3>
        { replay && <button type="button" className="at-replay" onClick={ () => setRun((n) => n + 1) }>Replay</button> }
      </div>
      <div className="at-stage" key={ run }>{ children }</div>
      <p className="gd-p">{ about }</p>
      <Example owner="Guide" code={ css } mode="static" lang="text" />
    </section>
  );
}

const WEIGHT_CSS = `/* One variable font file holds every weight, so weight can glide. */
@import '@fontsource-variable/inter';   /* font-family: 'Inter Variable' */

.breathe { animation: breathe 2.4s ease-in-out infinite alternate; }
@keyframes breathe {
  from { font-weight: 300; }
  to   { font-weight: 800; }
}

.link { transition: font-weight 0.3s ease; }
.link:hover { font-weight: 700; }`;

const LETTERS_CSS = `/* Each letter is a span with its place in --i, hidden from screen readers
   (aria-hidden); the whole text is there once more, visually hidden, for
   them. The delay staggers the letters. */
.reveal span {
  display: inline-block;
  animation: rise 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i) * 28ms);
}
@keyframes rise { from { opacity: 0; transform: translateY(0.4em); } }

.wave span {
  display: inline-block;
  animation: wave 1.6s ease-in-out infinite;
  animation-delay: calc(var(--i) * 90ms);
}
@keyframes wave { 50% { transform: translateY(-0.18em); } }`;

const SHINE_CSS = `/* A bright band slides across the letters: a gradient clipped to the text. */
.shine {
  background: linear-gradient(100deg, var(--nv-text) 40%, var(--nv-accent) 50%, var(--nv-text) 60%)
              0 0 / 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
}
@keyframes shine { from { background-position: 100% 0; } to { background-position: 0% 0; } }

/* The rainbow on the home page: the theme's accent, info, success, warning
   and danger, each already checked for 4.5:1 contrast on the page. */
.rainbow {
  background: linear-gradient(90deg, var(--nv-accent), var(--nv-info), var(--nv-success),
              var(--nv-warning), var(--nv-danger), var(--nv-accent)) 0 0 / 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: flow 8s linear infinite;
}
@keyframes flow { to { background-position: 200% 0; } }`;

const NEON_CSS = `/* A glow that breathes slowly. No flicker: anything that flashes more than
   three times a second can trigger seizures (WCAG 2.3.1). */
.neon {
  color: var(--nv-text);
  text-shadow: 0 0 2px var(--nv-accent), 0 0 10px var(--nv-accent), 0 0 24px var(--nv-accent);
  animation: glow 3s ease-in-out infinite alternate;
}
@keyframes glow {
  from { text-shadow: 0 0 1px var(--nv-accent), 0 0 4px var(--nv-accent), 0 0 10px transparent; }
}`;

const SPACING_CSS = `/* Letter spacing, size and opacity all transition smoothly in any font. */
.track { transition: letter-spacing 0.4s ease; }
.track:hover { letter-spacing: 0.2em; }

.fade { animation: fade 2.4s ease-in-out infinite alternate; }
@keyframes fade { from { opacity: 0.55; } }`;

const REDUCED_CSS = `/* For people who ask their system for less motion: stop it. */
@media (prefers-reduced-motion: reduce) {
  .breathe, .reveal span, .wave span, .shine, .rainbow, .neon, .fade { animation: none; }
  .link, .track { transition: none; }
}`;

/** Type that moves: variable weight, letter by letter, shine and rainbow, neon, spacing. */
export default function AnimatedType() {
  const [weight, setWeight] = React.useState(400);
  return (
    <div className="dx-page gd at">
      <h1 className="dx-page-title">Animated type</h1>
      <p className="dx-lede">
        Type can move. Five ways that work in every browser, in plain CSS and the theme's own colors, so they follow
        the theme like everything else. Each one stops for people who ask their system for less motion.
      </p>
      <div className="at-controls">
        <MotionToggle />
        <span className="gd-note">Anything here that moves for more than five seconds can be paused (WCAG 2.2.2).</span>
      </div>

      <h2 className="gd-h2">1. Weight that glides</h2>
      <p className="gd-p">
        This site loads Inter as a variable font: one 48 KB file with every weight from 100 to 900 (the four fixed
        weights it replaced were 96 KB). With a variable font, weight is a number that can animate smoothly, not a
        jump between files.
      </p>
      <Demo id="weight" title="Breathe, hover and a slider" about="The word breathes between light and extra bold. Hover the links: their weight glides. The slider sets any weight in between." css={ WEIGHT_CSS }>
        <div className="at-row">
          <span className="at-big at-breathe">Pulse</span>
          <span className="at-links">
            <a href="#/Foundations/Animated%20type" className="at-weight-link" onClick={ (e) => e.preventDefault() }>Components</a>
            <a href="#/Foundations/Animated%20type" className="at-weight-link" onClick={ (e) => e.preventDefault() }>Themes</a>
          </span>
        </div>
        <label className="at-slider">
          <span>Weight <output>{ weight }</output></span>
          <input type="range" min="100" max="900" step="1" value={ weight } onChange={ (e) => setWeight(Number(e.target.value)) } />
        </label>
        <p className="at-big at-weight-sample" style={ { fontWeight: weight } }>Every pixel has a pulse.</p>
      </Demo>

      <h2 className="gd-h2">2. Letter by letter</h2>
      <Demo id="letters" title="Reveal and wave" replay about="Each letter is its own span with its place in a CSS variable, and the delay grows with it. The spans are hidden from screen readers, and the whole text is there once for them (visually hidden), so it is read as words, not spelled out." css={ LETTERS_CSS }>
        <p className="at-big"><Letters className="at-reveal" text="Every pixel has a pulse." /></p>
        <p className="at-big"><Letters className="at-wave" text="NURVUS" /></p>
      </Demo>

      <h2 className="gd-h2">3. Shine and rainbow</h2>
      <Demo id="shine" title="A band of light, and the rainbow" about="A gradient clipped to the letters, moving behind them. The rainbow is the one on the home page: the theme's status colors, so it changes with the theme." css={ SHINE_CSS }>
        <p className="at-big at-shine">The Highway of the Electronic Butterfly</p>
        <p className="at-big at-rainbow">NURVUS UI</p>
      </Demo>

      <h2 className="gd-h2">4. Neon</h2>
      <Demo id="neon" title="A glow that breathes" about="Layered text shadows in the accent, breathing slowly. Keep glows slow: flashing more than three times a second can trigger seizures (WCAG 2.3.1)." css={ NEON_CSS }>
        <p className="at-big at-neon">Every pixel has a pulse.</p>
      </Demo>

      <h2 className="gd-h2">5. Spacing, size and opacity</h2>
      <Demo id="spacing" title="Tracking and fade" about="Hover the first line: its letters spread apart. The second fades in and out. Both work in any font, variable or not." css={ SPACING_CSS }>
        <p className="at-big at-track">Hover to spread the letters</p>
        <p className="at-big at-fade">A quiet fade</p>
      </Demo>

      <h2 className="gd-h2">Less motion</h2>
      <p className="gd-p">
        Every animation on this page stops when the reader's system asks for less motion (WCAG 2.3.3), and the Pause
        motion button stops them all for everyone else. Add the same rule to your own:
      </p>
      <Example owner="Guide" code={ REDUCED_CSS } mode="static" lang="text" />
      <p className="gd-note">
        Want keyframes of your own, made visually? The <a href="https://animated.nurvus.ai/" target="_blank" rel="noopener noreferrer">CSS Animation Factory</a> builds
        them with a timeline and exports the CSS. Type sizes and roles are on <a href={ href('Foundations', 'Typography') }>Typography</a>.
      </p>
    </div>
  );
}
