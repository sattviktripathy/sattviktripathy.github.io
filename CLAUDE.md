# Sattvik Tripathy portfolio

## Build rules

- Use `pnpm`. Node 24 comes from `.npmrc`, plain `node` is too old for Astro.
- Run `pnpm check:contrast` after touching any palette.
- The page must stay complete with no JS and under reduced motion. Scroll stages are sticky, gated by `html.motion`, which is also off below 500px tall so a phone on its side gets the plain page. The head script and `gsap.matchMedia()` in `motion.js` hold the same condition.
- Animate only transform, opacity and clip-path. Everything goes inside `gsap.matchMedia()`.
- Sticky stages use CSS `position: sticky` and `svh`, never GSAP pin. Each stage stays under about 3 screens.
- A sticky grid item runs the whole grid, not just its row. Wrap it with its neighbour, as `.s-main` does.
- The plan SVG and the render share one mapping: `X = 10.8 - x`, `Y = 8.4 - y`, viewBox span 14.2. Change one and frame 0 stops landing on the walls.
- `.ghost` percentages are measured against the 3:4 `.cam-frame`, so they hold at any screen shape.

## Claims

- Every number and client name goes in `src/data/work.js` with its source. Read the source before writing the sentence.
- The site is Sattvik's spotlight, so no collaborator gets named on it. TruSpace was a joint build, so it never says "I built" or "built alone" either. It describes the product.
- Lead names and the sample call are invented and must stay that way. Nothing from real CRM data goes on the page.
- The salary floor in `~/Jobs/GOAL.md` never goes on the site. No PosePal star rating. No dates on roles.

## Banned, because it reads as AI-generated

- Type: Inter, Space Grotesk, Geist, gradient text, tracked all-caps eyebrows, monospace labels, 01/02/03 numbering.
- Surfaces: purple gradients, glassmorphism, radial glows, identical card grids, nested cards, one radius and shadow on everything, icon above heading, hero stat rows, thick coloured side borders, giant radii, pulsing Live badges.
- Motion: auto-scrolling marquees, custom cursors, bounce or elastic easing, fade-up on every section, uniform hover-zoom, pulsing dots.
- Copy: em dashes, `→`, "A · B · C" strings, forced "Not X. Y." contrast, "elevate", "world-class".

Each chapter gets one bespoke scroll moment tied to its content, or none.
