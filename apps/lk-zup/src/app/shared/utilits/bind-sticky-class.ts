/**
 * Binds/unbinds a CSS class when a sticky element becomes stuck.
 *
 * @param {HTMLElement} el      - The sticky element
 * @param {string}      cls     - Class to toggle (default: 'is-stuck')
 * @param {Element}     root    - IntersectionObserver root (default: null = viewport)
 */
export function bindStickyClass(el, cls = 'is-stuck', root = null) {
  // A sentinel is placed just above the sticky element.
  // When it scrolls out of view — the sticky element is stuck.
  const sentinel = document.createElement('div');
  sentinel.style.cssText =
    'position:absolute;height:1px;width:1px;visibility:hidden;pointer-events:none;';

  el.parentElement.insertBefore(sentinel, el);

  const observer = new IntersectionObserver(
    ([entry]) => {
      el.classList.toggle(cls, !entry.isIntersecting);
    },
    {
      root,
      // threshold: 0 fires as soon as sentinel pixel leaves viewport
      threshold: 0,
    },
  );

  observer.observe(sentinel);

  // Return a cleanup function
  return () => {
    observer.disconnect();
    sentinel.remove();
  };
}
