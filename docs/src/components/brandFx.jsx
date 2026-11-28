import React from 'react';

/** No motion for people who asked for less, or who pressed Pause motion. */
const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || document.documentElement.getAttribute('data-motion') === 'paused';

// The running CSS animations the effects speed up: the rings turning and the
// wordmark's rainbow flowing. Each keeps its place when its rate changes.
const SPEEDS = { 'nv-current': 1, 'nv-flow': 0.4 }; // the colors speed up less than the rings

/**
 * Hover and click effects for the logo and wordmark (the header brand, the
 * hero title). Spread the returned props on the element that holds them.
 *  - Hover or focus: the rings spin up (about 6x, easing in) and the colors
 *    flow faster; they ease back down after.
 *  - Click: a flare. The mark dips and springs back, two shock rings spread
 *    from it like a shield recharging, a light sweeps across the letters and
 *    the rings whip round once.
 * Nothing moves under reduced motion or Pause motion (the CSS stops it too).
 */
export function useBrandFx() {
  const ref = React.useRef(null);
  const rate = React.useRef(1);
  const frame = React.useRef(0);
  const timer = React.useRef(0);
  React.useEffect(() => () => { cancelAnimationFrame(frame.current); clearTimeout(timer.current); }, []);

  /** Eases every turning/flowing animation inside to `target` times its speed over `ms`. */
  const rampTo = (target, ms, then) => {
    const el = ref.current;
    cancelAnimationFrame(frame.current);
    if (!el || !el.getAnimations) return;
    const anims = el.getAnimations({ subtree: true }).filter((a) => a.animationName in SPEEDS);
    const from = rate.current;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms);
      const eased = 1 - (1 - k) ** 3;
      rate.current = from + (target - from) * eased;
      anims.forEach((a) => { a.playbackRate = 1 + (rate.current - 1) * SPEEDS[a.animationName]; });
      if (k < 1) frame.current = requestAnimationFrame(step);
      else if (then) then();
    };
    frame.current = requestAnimationFrame(step);
  };

  const hovering = React.useRef(false);
  const enter = () => { hovering.current = true; if (!still()) rampTo(6, 700); };
  const leave = () => { hovering.current = false; if (!still()) rampTo(1, 1200); };
  const flare = () => {
    const el = ref.current;
    if (!el || still()) return;
    // Restart the flare if it is already playing.
    el.removeAttribute('data-fx');
    void el.offsetWidth; // eslint-disable-line no-void
    el.setAttribute('data-fx', 'flare');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => el.removeAttribute('data-fx'), 1100);
    rampTo(24, 180, () => rampTo(hovering.current ? 6 : 1, 1400));
  };

  return {
    ref,
    onMouseEnter: enter,
    onMouseLeave: leave,
    onFocus: enter,
    onBlur: leave,
    onClick: flare,
  };
}

/** The flare's two shock rings, laid over the mark. */
export function Burst() {
  return <span className="nv-burst" aria-hidden="true"><span /><span /></span>;
}
