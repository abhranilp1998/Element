(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  let leaving = false;
  let navigationTimer;
  function clearTransition() {
    clearTimeout(navigationTimer);
    root.classList.remove('is-entering', 'is-leaving');
    leaving = false;
  }
  function enter() {
    clearTransition();
    if (reducedMotion.matches) return;
    root.classList.add('is-entering');
    setTimeout(() => root.classList.remove('is-entering'), 1150);
  }
  function closeMenu(restoreFocus = false) {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menu?.focus();
  }
  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  const canonical = pathname => pathname.replace(/\/$/, '/index.html');
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (canonical(url.pathname) === canonical(location.pathname)) {
      closeMenu();
      if (url.hash) {
        const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        section?.setAttribute('tabindex', '-1');
        section?.focus({ preventScroll: true });
      }
      return;
    }
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) return;
    closeMenu();
    if (reducedMotion.matches) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    root.classList.remove('is-entering');
    root.classList.add('is-leaving');
    // Matches the final curtain's exit duration, with a small coverage margin.
    navigationTimer = setTimeout(() => location.assign(url.href), 620);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) closeMenu(true);
  });
  window.addEventListener('pageshow', event => {
    // Back/forward cache must never restore a closed curtain or pending navigation.
    if (event.persisted) { clearTransition(); closeMenu(); }
  });
  reducedMotion.addEventListener('change', () => {
    // Keep an already-requested navigation alive when the preference changes.
    if (!leaving && reducedMotion.matches) clearTransition();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        nav?.querySelectorAll('a').forEach(link => {
          const active = canonical(link.pathname) === canonical(location.pathname) && link.hash === '#' + entry.target.id;
          if (link.pathname.endsWith('/music.html') && !link.hash) return;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  }
  enter();
})();
