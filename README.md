# ICARUS / Element

[Live website](https://abhranilp1998.github.io/Element/) ·
[Where we started](https://abhranilp1998.github.io/Element/archive.html) ·
[Previous live site](https://abhranilp1998.github.io/Element/archive/pre-redesign/index.html)

Published as Alpha `v0.1.0-alpha.2`. See `DEPLOYMENT.md` for Pages and archive details.

A local artist website in plain HTML, CSS, and JavaScript. The redesign lives on
`codex/icarus-redesign`; `master` retains the consolidated original website.

## Redesigned experience

### Artist content and native links hub

`links.html` hosts the artist's profile buttons, release-specific streaming
choices, and video links directly on the site. `assets/artist-links.json` records
the recovered destinations; `ARTIST_SOURCES.md` documents the source pages,
artist identity, three added SoundCloud tracks, Instagram images, and supplied
ICARUS illustration. The listening room now contains nine SoundCloud entries,
and the homepage includes the artist biography, alter-ego artwork, and original
Instagram post links. No new release or deployment is implied by these changes.

### Contact and maintainer credit

`contact.html` provides Book a show, Collaborate, and Say hello routes, with
relevant fields, browser validation, copy-message, direct email, and prefilled
email drafts. All routes currently use `abhranilpaul00@gmail.com`, configured in
`assets/contact-config.js`. This address belongs to Abhranil Paul, the website
developer and maintainer. The draft opens in the visitor's email app; the site
does not send or store submissions. `contact-legacy.html` preserves the previous
contact page. Modern-page footers credit Abhranil Paul for website design and
development, with music/photo ownership kept separate.

### Listening room update

`music.html` is the dedicated songs page with six native SoundCloud embeds. The
featured player is visible in the opening screen, three listening selections are
below, and two original untitled entries remain in an archive disclosure. Home
has its own visible featured player; cover links lead directly to the corresponding
song. There is no hidden popup player.

- `assets/tracks.js`: the shared homepage catalog.
- `assets/players.js`: coordinates the native widgets, pauses other tracks when
  one plays, and provides shared volume/mute and Pause all controls in the room.
- `assets/navigation.js`: shared navigation plus staggered entrance/exit curtains
  and title/image entrances. Modified clicks, external links, and anchor links
  retain normal browser behavior; reduced motion skips the animation and delay.
- `assets/room.css`: listening-room layout and transition styles.
- `assets/music.js`: collection filters and deep links into archived tracks.

Pages render their native embeds in HTML; JavaScript adds coordination, shared
controls, filtering, and transitions. If the SoundCloud API fails, native controls
and external links remain available. The two untitled archive tracks may be
unavailable upstream. Music stops when navigating between full HTML documents.

- `index.html`: a single, responsive journey through music, artist, live photos,
  and the existing SoundCloud contact route.
- `assets/site.css`: shared visual language, mobile navigation, reduced-motion
  support, and keyboard focus styles. No Bootstrap, framework, or web fonts.
- `assets/site.js`: homepage collections, photo carousel, native-dialog lightbox,
  and the profile copy action.
- `assets/photos/`: optimized photographs and small thumbnails; original files
  in `images/` remain unchanged. All optimized photos total about 2 MB.
- `index-legacy.html`: exact pre-redesign homepage, alongside every previously
  preserved page listed in `versions.html`.

The main page works without third-party CSS or JavaScript. SoundCloud players
are visible and load lazily. Play requires an explicit click. Untitled tracks retain their original
IDs without invented names or release information. The gallery supports arrow
keys inside the lightbox and Escape to close; the mobile menu also closes with
Escape. The contact section links to the supplied profile; there is no pretend
submission form or unverified booking address.

## Run locally

Requires Node.js (18 or newer). No install or build step:

```powershell
node serve.mjs
```

Open http://127.0.0.1:5501/. If the port is already in use:

```powershell
$env:PORT = '5502'
node serve.mjs
```

`versions.html` links to the old designs. Original prototype limitations documented
below apply to those archived pages, not the new player controls.


## Original project notes

For my fellow rapper Element. Remember the name.

## Local preview

Run `node serve.mjs`, then open http://127.0.0.1:5501/.
Open `versions.html` for links to every preserved page and experiment.

## Consolidation on master — 2026-11-11

`master` keeps the later Element site and merges the independent history from
Element-master's `popss` branch (including its `main` ancestor). The preservation
merge uses the later site's tree as its base; alternate pages are retained as
separate files rather than overwriting either design.

- `archive/element-master-main`: original copied repository at `27ff5e2`.
- `archive/element-master-popss`: alternate design branch at `7563238`.
- `index-popss.html` and `musixxx-popss.html`: exact copies from `popss`.
- `index-original.html`, `musixxx-original.html`, `contact-original.html`, and
  `test-responsive.html`: exact copies from the copied repository's `main`.
- All existing pages, seven photos, and VS Code settings remain in place.
- `preserved-pages.json` records source commits and Git blob IDs for the copies.

The alternate files share `images/` with the main site. Their original relative
navigation is unchanged and leads to the main site's original filenames.
Older revisions remain available in the merged Git history.

The main site retains its existing prototype behavior: contact submission is
disabled, mute does not restore volume, some metadata is placeholder content,
and SoundCloud/Bootstrap require external network access. This consolidation
preserves those implementations; it does not certify playback or release readiness.

Original remotes: Element uses `https://github.com/abhranilp1998/Element.git`;
Element-master used `https://github.com/aritrasarkar911/Element-master.git`.
The archive branches and merged commits keep the latter repository's history
locally without changing the main remote. No GitHub push is part of this merge.
