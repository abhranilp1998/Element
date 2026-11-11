# ICARUS / Element — Alpha 0.1.0-alpha.1

First alpha of the redesigned artist website, built with plain HTML, CSS, and
JavaScript. The original versions and both repositories' histories are preserved.

## Included

- Responsive artist homepage with performance photography and a visible featured
  SoundCloud player.
- Dedicated listening room with six native embeds, collection filters, shared
  volume and mute, Pause all, and coordinated playback.
- Photo carousel and keyboard-accessible lightbox; optimized web photographs
  retain the untouched originals.
- Bookings, collaborations, and general contact routes with validation, copy
  actions, and prefilled email drafts.
- Contact address: abhranilpaul00@gmail.com, currently handled by Abhranil Paul,
  website developer and maintainer.
- Staggered page transitions, mobile navigation, and reduced-motion support.
- Website design and development credit to Abhranil Paul. Music and photographs
  remain attributed to their respective owners.

## Run locally

Requires Node.js 18 or newer. No package installation or build step:

```sh
node serve.mjs
```

Open http://127.0.0.1:5501/. Set PORT to another value if that port is occupied.
Use versions.html to browse the preserved original pages and experiments.

## Alpha limitations

- SoundCloud requires internet access. The two untitled original-player tracks
  are currently unavailable upstream and remain in the labeled archive.
- Contact actions open the visitor's email app; this static site does not send
  or store messages. The configured contact address is the maintainer's address.
- Audio stops during full-page navigation.
- Artist biography, definitive artist branding, and final booking details still
  need owner review before a production release.
- Preserved legacy pages intentionally retain their original prototype behavior.

## Verification

Local browser checks covered desktop and mobile layouts, playback coordination,
volume restoration, filters, gallery controls, contact-route switching, copying
drafts, page transitions, and browser history navigation. All local pages and
new assets were served successfully; preserved page hashes were verified.
