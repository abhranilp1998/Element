# Local redesign validation

Checked in the in-app browser on 2026-11-11.

## Artist sources and native platform hub

- Public live site, Instagram bio/post images and expanded Linktree service
  drawers inspected. Source provenance is recorded in ARTIST_SOURCES.md.
- links.html contains 37 direct destination actions and no Linktree redirect.
  Both release disclosures expand inside the website.
- Homepage catalog contains six ICARUS/archive cards; the listening room retains
  the previous six entries and adds three source-backed SoundCloud embeds.
- New local images loaded without errors. Home has no page overflow at 360,
  768, and 1440px. Illustration aspect ratio is explicitly preserved.
- External destination URLs were recovered from the source pages; playback or
  regional availability across every third-party service is not guaranteed.

## Listening room and transitions

- Home links to `music.html` through the navigation, hero, featured track, and
  individual covers. The featured SoundCloud player is visible directly on Home.
- The songs page contains six native embeds. The featured ICARUS widget appears
  in the opening desktop and mobile screens. Four available tracks loaded; both
  untitled archive entries show unavailable-track messages and external links.
- Played the featured track, then Raindrops. The featured widget paused, only
  Raindrops remained marked playing, and the shared title stayed correct.
- Pause all stopped playback. Mute set the shared volume to zero; Unmute restored
  60. The ICARUS filter hid the listening selections and opened the archive.
- The staggered curtain was observed on entrance and Home-to-Music exit. The
  reverse route works through the mobile menu. Reduced-motion CSS and the
  JavaScript bypass keep animations and navigation delays off when requested.
- Mobile player layout inspected at 390px. The native SoundCloud controls remain
  visible. Archive pages and original photographs remain preserved.

## Earlier single-page iteration

These checks describe the first redesign, before the visible-embed listening
room replaced its floating single-player interface.

- Desktop and 390px mobile layouts visually inspected. No page overflow at
  viewport widths 360, 768, and 1440px.
- Both music collections switch correctly. The initial page creates no iframe.
- Prince Fox's Raindrops remix loads and plays; custom Play/Pause reflects actual
  widget events. Mute restores both 60 and 100 volume settings after a slider change.
- Selecting a different track leaves exactly one iframe; closing the player
  removes it completely. The ICARUS featured track loads with its artist/title.
- Untitled / 02 is unavailable on SoundCloud. Its failure state is displayed and
  custom playback controls remain disabled, with an external fallback link.
- Photo next/previous, thumbnails, native lightbox, keyboard ArrowRight and
  Escape, and return focus were checked. Mobile navigation closes after selection.
- Legacy homepage matches `master:index.html`. Original pages/images and all six
  preserved alternate page blobs match their pre-redesign Git versions.

Availability of external tracks can change. Two archive cuts have no verified
titles and are explicitly labeled untitled. The supplied SoundCloud profile is
the contact destination; no booking email or message service was supplied.

The source uses plain HTML, CSS, and JavaScript. No dependency install, framework,
or build is required. SoundCloud is the only runtime third-party integration.
