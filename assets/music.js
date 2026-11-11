(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const entries = [...document.querySelectorAll('[data-music-collection]')];
  const archive = document.querySelector('#archive-tracks');
  const influences = document.querySelector('#on-repeat');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => { item.setAttribute('aria-pressed', String(item === button)); item.classList.toggle('active', item === button); });
    entries.forEach(entry => { entry.hidden = filter !== 'all' && entry.dataset.musicCollection !== filter; });
    influences.hidden = filter === 'originals';
    archive.hidden = filter === 'influences';
    if (filter === 'originals') archive.open = true;
    document.querySelector('#filter-count').textContent = filter === 'all' ? '09 tracks / 02 collections' : filter === 'originals' ? '06 tracks / 01 collection' : '03 tracks / 01 collection';
    document.dispatchEvent(new Event('musicfilterchange'));
  }));
  document.querySelector('.room-filters').hidden = false;
  // A cover link can point directly to a track inside the native archive disclosure.
  function revealHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.closest('#archive-tracks')) archive.open = true;
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
})();
