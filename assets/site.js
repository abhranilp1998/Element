/* Plain JavaScript. No dependencies beyond SoundCloud's optional widget API. */
'use strict';

const profile = 'https://soundcloud.com/aritra-sarkar-180252798';
const tracks = window.ICARUS_TRACKS;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const grid = $('#track-grid');
let collection = 'originals';


function renderTracks() {
  grid.innerHTML = tracks.filter(track => track.collection === collection).map((track, index) => `
    <article class="track">
      <div class="track-art cover-${track.cover}">
        ${track.image ? `<img src="${track.image}" alt="" loading="lazy">` : ''}
        <div class="cover-type" aria-hidden="true"><span>${track.detail}</span><strong>${track.words}</strong><span>↗ SOUND / ${String(index + 1).padStart(2, '0')}</span></div>
        <a class="track-play" href="music.html#track-${track.id}" aria-label="Listen to ${track.title.replaceAll('&', '&amp;')}"><span aria-hidden="true">↗</span></a>
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
    ? 'Open any cover to find its embedded player in the listening room.'
    : 'A few selections from the original music gallery. All tracks belong to their respective artists.';
  renderTracks();
}));
renderTracks();

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
