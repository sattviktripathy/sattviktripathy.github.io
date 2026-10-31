# sattviktripathy.github.io

Sattvik Tripathy's portfolio. Astro, GSAP ScrollTrigger and Lenis, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```sh
pnpm install
pnpm dev
pnpm build
pnpm check:contrast
```

Every public claim lives in `src/data/work.js`, with where it was checked. `scripts/render-dollhouse.mjs` and `scripts/assets.mjs` are one-off generators for `public/seq/` and `src/assets/`, and their outputs are committed.

The resume PDF comes from `~/Jobs/resume`. Its URL has to stay `/Sattvik_Tripathy_Resume.pdf`, because job applications link to it.
