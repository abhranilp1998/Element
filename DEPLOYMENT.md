# GitHub Pages

Production: https://abhranilp1998.github.io/Element/

Pages publishes the root of `codex/icarus-redesign`. `.nojekyll` serves the plain
HTML/CSS/JS tree directly. No package installation or build step is required.
The main and master branches are not overwritten by deployment.

## Archive

- `archive.html`: Where we started, linked from all current-page footers.
- `versions.html`: the original experiments and alternate branches.
- `archive/pre-redesign/`: exported from the previously published main branch,
  commit `6794535d310ab306b7096b4eb643914e7c212949`.
- The snapshot excludes editor settings. Root-relative links in its HTML were
  made relative to the snapshot root for compatibility with the archive subpath.
  The original commit remains available for exact source comparison.

## Alpha 0.1.0-alpha.2

Deploy the redesign commit and publish the same commit as a GitHub prerelease.
Release notes should link to both production and the public archive page.
Check Pages build status and live HTML before reporting deployment complete.
