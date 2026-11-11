/* Plain JavaScript. No dependencies beyond SoundCloud's optional widget API. */
'use strict';

const profile = 'https://soundcloud.com/aritra-sarkar-180252798';
const tracks = [
  { id: '1804249125', collection: 'originals', title: 'Kiss My Ass', artist: 'ICARUS', detail: 'FROM THE ARCHIVE', cover: 'acid', words: 'KISS MY<br>ASS.', url: profile + '/kiss-my-ass' },
  { id: '1804414713', collection: 'originals', title: 'Untitled / 02', artist: 'Original player archive', detail: 'UNTITLED CUT', cover: 'photo', image: 'assets/photos/img4.jpg', words: 'SIDE<br>02.', url: 'https://soundcloud.com/tracks/1804414713' },
  { id: '1804241277', collection: 'originals', title: 'Untitled / 03', artist: 'Original player archive', detail: 'UNTITLED CUT', cover: 'orange', words: 'AFTER<br>HOURS.', url: 'https://soundcloud.com/tracks/1804241277' },
  { id: '202962731', collection: 'influences', title: 'Raindrops · Prince Fox Remix', artist: 'SNBRN feat. Kerli / Prince Fox', detail: 'ON REPEAT', cover: 'lilac', words: 'RAIN<br>DROPS.', url: 'https://soundcloud.com/princefoxmusic/raindrops-feat-kerli-prince-fox-remix' },
  { id: '218673529', collection: 'influences', title: 'Kush · PLS&TY & Arman Cekin Remix', artist: 'Dr. Dre feat. Snoop Dogg & Akon', detail: 'ON REPEAT', cover: 'blue', words: 'KUSH<br>REMIX.', url: 'https://soundcloud.com/pls-ty-vip/dr-dre-kush-feat-snoop-dogg-akon-plsty-arman-cekin-remix' },
  { id: '1069821154', collection: 'influences', title: 'Feels', artist: 'BLACKLBEATZ', detail: 'ON REPEAT', cover: 'photo', image: 'assets/photos/img3.jpg', words: 'FEELS<br>LIKE.', url: 'https://soundcloud.com/blacklbeatz/feels' }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const grid = $('#track-grid');
let collection = 'originals';
let selectedTrack = null;

function renderTracks() {
  grid.innerHTML = tracks.filter(track => track.collection === collection).map((track, index) => `
    <article class="track">
      <div class="track-art cover-${track.cover}">
        ${track.image ? `<img src="${track.image}" alt="" loading="lazy">` : ''}
        <div class="cover-type" aria-hidden="true"><span>${track.detail}</span><strong>${track.words}</strong><span>↗ SOUND / ${String(index + 1).padStart(2, '0')}</span></div>
        <button class="track-play" data-track="${track.id}" aria-label="Listen to ${track.title.replaceAll('&', '&amp;')}" aria-pressed="${selectedTrack?.id === track.id}"><span aria-hidden="true">${selectedTrack?.id === track.id ? '≋' : '▶'}</span></button>
      </div>
      <div class="track-meta"><div><h3>${track.title.replaceAll('&', '&amp;')}</h3><p>${track.artist.replaceAll('&', '&amp;')}</p></div><span class="track-index">0${index + 1}</span></div>
    </article>`).join('');
}

$$('.collection').forEach(button => button.addEventListener('click', () => {
  collection = button.dataset.collection;
  $$('.collection').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  $('#collection-note').textContent = collection === 'originals'
    ? 'One named track, two untitled cuts from the original player. Explore the archive on SoundCloud.'
    : 'A few selections from the original music gallery. All tracks belong to their respective artists.';
  renderTracks();
}));
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-track]');
  if (button) openPlayer(tracks.find(track => track.id === button.dataset.track));
});
renderTracks();

/* A single iframe ensures different tracks never play over one another. */
let widget = null;
let playerGeneration = 0;
let apiPromise = null;
let playerTimer;
let isPlaying = false;
let currentVolume = 60;
let previousVolume = 60;
let lastTrigger = null;
const panel = $('#player-panel');
const status = $('#player-status');
const playButton = $('#toggle-play');
const muteButton = $('#toggle-mute');
const volumeSlider = $('#volume');

function loadWidgetApi() {
  if (window.SC?.Widget) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => { script.remove(); reject(new Error('SoundCloud API timeout')); }, 12000);
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = () => {
      clearTimeout(timeout);
      if (window.SC?.Widget) resolve(); else reject(new Error('SoundCloud API unavailable'));
    };
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('SoundCloud API unavailable')); };
    document.head.append(script);
  }).catch(error => { apiPromise = null; throw error; });
  return apiPromise;
}

function enableControls(enabled) {
  [playButton, muteButton, volumeSlider].forEach(control => { control.disabled = !enabled; });
}

function syncVolume() {
  volumeSlider.value = String(currentVolume);
  muteButton.textContent = currentVolume === 0 ? 'Unmute' : 'Mute';
  muteButton.setAttribute('aria-pressed', String(currentVolume === 0));
}

async function openPlayer(track) {
  if (selectedTrack?.id === track.id && !panel.hidden) {
    $('#close-player').focus({ preventScroll: true });
    return;
  }
  lastTrigger = document.activeElement;
  const generation = ++playerGeneration;
  clearTimeout(playerTimer);
  widget = null;
  isPlaying = false;
  selectedTrack = track;
  panel.hidden = false;
  $('#player-title').textContent = track.title;
  $('#player-fallback').href = track.url;
  status.textContent = 'Loading SoundCloud…';
  playButton.textContent = 'Play';
  enableControls(false);
  syncVolume();
  const iframe = document.createElement('iframe');
  const params = new URLSearchParams({ url: 'https://api.soundcloud.com/tracks/' + track.id, color: '#667d1a', auto_play: 'false', hide_related: 'true', show_comments: 'false', show_reposts: 'false', visual: 'false' });
  iframe.src = 'https://w.soundcloud.com/player/?' + params;
  iframe.title = track.title + ' — SoundCloud audio player';
  iframe.allow = 'autoplay';
  $('#widget-container').replaceChildren(iframe);
  $$('.track-play').forEach(button => {
    const active = button.dataset.track === track.id;
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('span').textContent = active ? '≋' : '▶';
  });
  $('#close-player').focus({ preventScroll: true });

  const failed = () => {
    if (generation !== playerGeneration) return;
    clearTimeout(playerTimer);
    status.textContent = 'This track could not be loaded here. Try the SoundCloud link below.';
    enableControls(false);
  };
  playerTimer = setTimeout(failed, 15000);
  try {
    await loadWidgetApi();
    if (generation !== playerGeneration) return;
    widget = window.SC.Widget(iframe);
    const activeWidget = widget;
    widget.bind(window.SC.Widget.Events.READY, () => {
      if (generation !== playerGeneration) return;
      // An unavailable embed can signal READY; inspect its actual sound as well.
      activeWidget.getCurrentSound(sound => {
        if (generation !== playerGeneration) return;
        if (!sound?.id || !sound.title || !(sound.duration > 0) || sound.streamable === false) {
          failed();
          return;
        }
        clearTimeout(playerTimer);
        activeWidget.setVolume(currentVolume);
        enableControls(true);
        status.textContent = 'Ready when you are. Press Play.';
      });
    });
    widget.bind(window.SC.Widget.Events.PLAY, () => {
      if (generation !== playerGeneration) return;
      clearTimeout(playerTimer);
      isPlaying = true;
      playButton.textContent = 'Pause';
      status.textContent = 'Now playing · ' + track.title;
    });
    widget.bind(window.SC.Widget.Events.PAUSE, () => {
      if (generation !== playerGeneration) return;
      isPlaying = false;
      playButton.textContent = 'Play';
      status.textContent = 'Paused · ' + track.title;
    });
    widget.bind(window.SC.Widget.Events.FINISH, () => {
      if (generation !== playerGeneration) return;
      isPlaying = false;
      playButton.textContent = 'Play';
      status.textContent = 'That’s the track. Play it again?';
    });
    widget.bind(window.SC.Widget.Events.ERROR, failed);
  } catch { failed(); }
}

function closePlayer() {
  ++playerGeneration;
  clearTimeout(playerTimer);
  $('#widget-container').replaceChildren();
  widget = null;
  selectedTrack = null;
  panel.hidden = true;
  enableControls(false);
  $$('.track-play').forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.querySelector('span').textContent = '▶';
  });
  if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  else $('.collection.active').focus({ preventScroll: true });
}

$('#close-player').addEventListener('click', closePlayer);
playButton.addEventListener('click', () => {
  if (!widget) return;
  if (isPlaying) widget.pause();
  else {
    widget.play();
    clearTimeout(playerTimer);
    status.textContent = 'Starting playback…';
    const generation = playerGeneration;
    playerTimer = setTimeout(() => {
      if (generation !== playerGeneration || isPlaying) return;
      status.textContent = 'Playback did not start. Try the widget’s play button or open SoundCloud below.';
    }, 8000);
  }
});
volumeSlider.addEventListener('input', () => {
  currentVolume = Number(volumeSlider.value);
  if (currentVolume > 0) previousVolume = currentVolume;
  syncVolume();
  widget?.setVolume(currentVolume);
});
muteButton.addEventListener('click', () => {
  if (currentVolume > 0) { previousVolume = currentVolume; currentVolume = 0; }
  else currentVolume = previousVolume || 60;
  syncVolume();
  widget?.setVolume(currentVolume);
});

/* Photo carousel and native, keyboard-accessible lightbox. */
const photos = [
  { file: 'img4.jpg', alt: 'A vocalist reaches toward the crowd during a live performance', caption: 'On the mic. In the moment.' },
  { file: 'img3.jpg', alt: 'Vocalists share the stage at an intimate live music venue', caption: 'A room full of sound.' },
  { file: 'img1.jpg', alt: 'A photograph from the live performance archive', caption: 'Another frame from the floor.' },
  { file: 'img2.jpg', alt: 'A photograph from the performance and community archive', caption: 'The people. The energy.' },
  { file: 'img5.jpg', alt: 'A moment from the original artist photo collection', caption: 'Between the verses.' },
  { file: 'img6.jpg', alt: 'The group photograph from the original ICARUS homepage', caption: 'More than a solo moment.' },
  { file: 'img7.jpg', alt: 'An alternate archive entry from the original photo collection', caption: 'From the original collection.' }
];
let photoIndex = 0;
const lightbox = $('#lightbox');
const thumbnails = $('#photo-thumbnails');
photos.forEach((photo, index) => {
  const button = document.createElement('button');
  button.className = 'thumbnail';
  button.setAttribute('aria-label', 'Show photograph ' + (index + 1));
  const img = document.createElement('img');
  img.src = 'assets/photos/thumb-' + photo.file;
  img.alt = '';
  img.loading = 'lazy';
  button.append(img);
  button.addEventListener('click', () => showPhoto(index));
  thumbnails.append(button);
});
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const photo = photos[photoIndex];
  const number = String(photoIndex + 1).padStart(2, '0');
  for (const image of [$('#gallery-photo'), $('#lightbox-image')]) {
    image.src = 'assets/photos/' + photo.file;
    image.alt = photo.alt;
  }
  $('#photo-number').textContent = number;
  $('#lightbox-count').textContent = number + ' / 07';
  $('#gallery-caption').textContent = photo.caption;
  $('#lightbox-caption').textContent = photo.caption;
  $('#open-photo').setAttribute('aria-label', 'Enlarge performance photo ' + (photoIndex + 1) + ' of 7');
  [...thumbnails.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === photoIndex)));
}
$('#previous-photo').addEventListener('click', () => showPhoto(photoIndex - 1));
$('#next-photo').addEventListener('click', () => showPhoto(photoIndex + 1));
$('#lightbox-previous').addEventListener('click', () => showPhoto(photoIndex - 1));
$('#lightbox-next').addEventListener('click', () => showPhoto(photoIndex + 1));
$('#open-photo').addEventListener('click', () => lightbox.showModal());
$('#close-lightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
});
showPhoto(0);

/* Navigation, section tracking, and a contact action with honest feedback. */
const menuButton = $('.menu-toggle');
const nav = $('#navigation');
function closeMenu(restoreFocus = false) {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
$$('#navigation a').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const section = $(link.getAttribute('href'));
  section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
}));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || lightbox.open) return;
  if (nav.classList.contains('open')) closeMenu(true);
  else if (!panel.hidden) closePlayer();
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      $$('#navigation a').forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  $$('main > section').forEach(section => observer.observe(section));
}
$('#copy-profile').addEventListener('click', async () => {
  const button = $('#copy-profile');
  try {
    await navigator.clipboard.writeText(profile);
    button.textContent = 'Link copied ✓';
    $('.copy-status').textContent = 'SoundCloud profile link copied to clipboard.';
  } catch {
    button.textContent = 'Use Open SoundCloud ↗';
    $('.copy-status').textContent = 'Clipboard unavailable. Use the Open SoundCloud link beside this button.';
  }
});
