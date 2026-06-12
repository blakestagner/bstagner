# Space-Themed Portfolio Redesign — Design Spec

**Date:** 2026-06-12
**Status:** Approved by Blake

## Goal

Redesign the single-page portfolio into a premium, cinematic, space-themed experience with continuous scroll-based animation. The page should feel like one connected space journey, not stacked blocks. Layout, presentation, and motion only — no content rewrites, no invented experience.

## Current State (before)

- Next.js 16 App Router, plain JS, per-component global SCSS. No animation library.
- `app/page.js` renders Toolbar + `#sections` scroll container with: Hero → About (About Me / Skills tabs) → Portfolio → Components (demos) → Footer.
- `#sections` uses `scroll-snap-type: y mandatory` and `overflow-y: scroll`; toolbar tracking via IntersectionObserver rooted on `#sections`.
- Hero: static one-shot canvas starfield (`Stars.js`), Sun, PurpleGalaxy, GreenGalaxy (CSS keyframes), gated by `react-device-detect`.
- No `prefers-reduced-motion` support. No Experience section or content.

## Decisions

| Decision | Choice |
|---|---|
| Scroll model | Free document scrolling. Remove scroll-snap and the `#sections` inner scroll container. |
| Animation tech | GSAP + ScrollTrigger (only new dependency, ~45kb gzip) + one custom rAF canvas for the starfield. CSS for hover/micro-interactions. |
| Experience content | Build fully styled timeline with 3 clearly marked TODO placeholder entries. |
| Demos section | Keep, restyle to match the new theme. |
| Hero centerpiece | Enhance existing Sun/galaxies, do not replace (standing user preference). |

## Architecture

### 1. Persistent space background — the continuity backbone

New `components/space/SpaceBackground.js` + `space.scss`:

- Single `position: fixed` canvas behind the whole page (z-index below content), one rAF loop.
- Three parallax star layers at different depths/speeds + drifting cosmic dust particles.
- Star drift velocity subtly reacts to scroll velocity (streak on fast scroll, settle at rest).
- Slow-moving nebula gradient blobs whose hue/position shift with page scroll progress: blue (hero) → purple (mid-page) → deep cyan (contact). Sections share one continuous sky.
- Pauses the rAF loop when tab is hidden (`visibilitychange`).
- Under `prefers-reduced-motion: reduce`: renders a single static starfield frame, no loop.
- Canvas sized via `devicePixelRatio` (capped at 2), resize-handled.

### 2. Scroll model

- Delete `#sections` scroll-snap/overflow rules from `app/globals.scss`; document (body) scrolls naturally.
- Keep section `id`s (`hero`, `about`, `skills`, `portfolio`, `components`, `experience`, `contact`) for toolbar anchor links.
- Toolbar active-section tracking moves from IntersectionObserver to ScrollTrigger callbacks in `page.js`.
- Footer "scroll to top" targets `window`, not `#sections`.

### 3. Sections (new order in `app/page.js`)

1. **Hero** — Keep Sun, PurpleGalaxy, GreenGalaxy (enhanced). Add: orbital rings with small orbiting bodies, desktop mouse-tilt parallax on layered elements, and a scrubbed ScrollTrigger scroll-out where hero elements scale/drift/fade as the user scrolls away, handing off to the persistent starfield. Replace static `Stars.js` canvas (hero relies on the shared SpaceBackground). Text stays high-contrast and readable.
2. **About** — Standalone section (tabs removed). Existing bio copy + photo presented as a floating console-panel card; scroll reveal (fade/slide via ScrollTrigger). No copy changes.
3. **Skills** — New standalone section. Data: the existing `skillCategories` array moved out of `About.js` (e.g. to a shared data module). Four constellation-style clusters; skill tags as glowing nodes connected by faint SVG/CSS lines; staggered scroll reveal; AI cluster keeps its highlight treatment. Easy to scan.
4. **Projects** — Existing Portfolio items restyled as space-panel cards: hover lift + accent glow, alternating slide-in reveals. Content unchanged.
5. **Demos** — Existing interactive components kept; pill menu and panels restyled to match the dark/glow theme.
6. **Experience** — New `components/experience/` section: vertical mission-log timeline along a glowing orbit path. Three placeholder entries, each clearly marked `TODO: replace with real role/company/dates`. No invented experience presented as real.
7. **Contact** — Footer rebuilt as a full final section: stronger heading/CTA, existing social links (LinkedIn, GitHub), scroll-to-top, copyright. Ending beat: starfield gently condenses toward a horizon glow near the bottom of the page.

### 4. Motion system

- GSAP `ScrollTrigger` for: hero scroll-out (scrubbed), section reveals (enter-once), toolbar section tracking, background scroll-progress value.
- A small shared helper (e.g. `lib/animation.js` or `components/space/useGsap.js`) registers the plugin once and exposes a reveal convention so sections don't duplicate boilerplate.
- `gsap.matchMedia('(prefers-reduced-motion: reduce)')`: all scroll choreography and reveals disabled or reduced to instant/simple fades; content always visible without scrolling tricks.
- Only `transform` and `opacity` animated. No layout-affecting properties. `will-change` used sparingly.
- Mobile: reduced particle counts, no mouse-tilt, simplified hero ornaments; aim to drop `react-device-detect` conditional rendering in Hero in favor of CSS breakpoints where feasible.

### 5. Visual language

- Existing token system stays: `#080810` base, `#10101e` surface, `#4fc3f7` electric blue, `#7c4dff` purple, cyan/white accents; Teko / DM Serif Display / DM Sans fonts.
- Glowing edges used sparingly (cards, timeline path, footer border). Subtle gradients, clean spacing, high contrast text.

### 6. Cleanup

- Remove: About tab system (state + styles), `components/hero/Stars.js`, `MobileGalaxy.js`/`BlackHole.js` if confirmed unused, scroll-snap CSS, orphaned SCSS from restructure.
- Do not touch: `app/admin/`, `app/api/`, `lib/firebase/`, SEO metadata in `app/layout.js`, Netlify deploy config, existing routes.

## Error handling / edge cases

- Canvas unsupported or JS disabled: page content fully readable on the dark base background (canvas is decorative only).
- SSR: all canvas/GSAP work inside `useEffect`; components remain `'use client'` where they already are.
- Resize/orientation change: starfield re-seeds; ScrollTriggers refresh (`ScrollTrigger.refresh()`).

## Testing / verification

- `npm run build` and `npm run lint` pass.
- Manual checks: all 7 sections render and reveal; toolbar links + active state work; reduced-motion (emulated) shows static, fully readable site; mobile viewport (375px) layout and performance; no console errors; admin routes untouched.

## Out of scope

- Content/copy changes, real experience data, auth wiring, admin/blog redesign, image asset replacement.
