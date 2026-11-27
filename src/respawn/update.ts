// How a component element updates, in Respawn's style (explicit re-creation):
//
//   let tag = Tag({ tone: 'neutral', children: 'Draft' });
//   tag = tag.update({ tone: 'success', children: 'Saved' });
//
// update(changes) merges the changes into the props the element was made
// with, builds a new element, swaps it in with replaceWith (what Respawn() does)
// and returns it. Keep the returned element. An older reference still works:
// its update() goes to the element that is on the page now.

/** An element a component returned: the DOM element itself, plus update(). */
export type NurvusElement<E extends HTMLElement, P> = E & {
  /** Rebuilds it with `changes` merged into its props, swaps the new one into the page, and returns it. */
  update(changes: Partial<P>): NurvusElement<E, P>;
};

/** Lets a render function save props without rebuilding (e.g. Menu's row click). */
export type Keep<P> = (changes: Partial<P>) => void;

interface Box<E extends HTMLElement, P> {
  props: P;
  el: NurvusElement<E, P> | null;
}

/**
 * Wraps a render function so its element gets update(). A `mountEl` prop
 * (as in Respawn's Spawn) appends the first element to it; updates replace it
 * in place instead.
 */
export function updatable<E extends HTMLElement, P extends object>(render: (props: P, keep: Keep<P>) => E, initial: P): NurvusElement<E, P> {
  const { mountEl, ...props } = initial as P & { mountEl?: Element };
  const box: Box<E, P> = { props: props as P, el: null };
  const keep: Keep<P> = (changes) => { box.props = { ...box.props, ...changes }; };
  const build = (): NurvusElement<E, P> => {
    const el = render(box.props, keep) as NurvusElement<E, P>;
    el.update = (changes) => {
      keep(changes);
      const previous = box.el;
      const next = build();
      if (previous && previous !== next) previous.replaceWith(next);
      return next;
    };
    box.el = el;
    return el;
  };
  const el = build();
  if (mountEl) mountEl.appendChild(el);
  return el;
}
