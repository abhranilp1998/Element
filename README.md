# ICARUS / Element

A local artist website in plain HTML, CSS, and JavaScript. The redesign lives on
`codex/icarus-redesign`; `master` retains the consolidated original website.

## Redesigned experience

- `index.html`: a single, responsive journey through music, artist, live photos,
  and the existing SoundCloud contact route.
- `assets/site.css`: shared visual language, mobile navigation, reduced-motion
  support, and keyboard focus styles. No Bootstrap, framework, or web fonts.
- `assets/site.js`: six unique tracks from the original versions, two music
  collections, one lazy-loaded SoundCloud widget, volume/mute restoration,
  unavailable-track fallbacks, photo carousel, and native-dialog lightbox.
- `assets/photos/`: optimized photographs and small thumbnails; original files
  in `images/` remain unchanged. All optimized photos total about 2 MB.
- `index-legacy.html`: exact pre-redesign homepage, alongside every previously
  preserved page listed in `versions.html`.

The main page works without third-party CSS or JavaScript. SoundCloud loads only
after a visitor selects a track. Play requires an explicit click. Closing the
player removes the iframe and stops audio. Untitled tracks retain their original
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
