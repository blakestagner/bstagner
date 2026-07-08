# Architecture

## Directory Structure
```
bstagner/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group (no layout impact)
│   │   └── login/
│   ├── (portfolio)/        # Portfolio route group
│   │   ├── apps/
│   │   ├── calendar/
│   │   └── todos/
│   ├── api/
│   │   └── auth/           # NextAuth.js v5 API routes
│   ├── layout.js           # Root layout
│   ├── page.js             # Homepage
│   └── globals.scss        # Global styles (minimal — use modules)
├── components/
│   ├── about/              # About section components
│   ├── footer/
│   ├── hero/               # Hero/landing components
│   ├── interactive/        # Interactive/dynamic components
│   ├── portfolio/          # Portfolio grid components
│   ├── sections/           # Page section wrappers
│   ├── shared/             # Reusable across features (Loading, SectionTitle)
│   ├── space/              # Global Canvas 2D starfield (SpaceBackground)
│   ├── space3d/            # three.js overlay: 3D ship + Earth + introState sync singleton
│   ├── toolbar/            # Navigation/toolbar
│   └── ui/                 # Generic UI primitives (buttons, etc.)
├── hooks/                  # Custom React hooks
├── styles/
│   └── variables.scss      # SCSS variables (auto-included via sassOptions)
├── public/                 # Static assets
└── jsconfig.json           # Path aliases
```

## Path Aliases (jsconfig.json)
Check `jsconfig.json` for `@/` alias — likely maps to project root.

## Key Architectural Decisions
- **Route groups** `(auth)` and `(portfolio)` organize routes without affecting URL structure
- **No TypeScript** — all files are `.js` / `.jsx`
- **SCSS co-location** — each component folder has its own `.scss` module file
- **Auth** — NextAuth.js v5 (beta) via `next-auth@^5.0.0-beta.30`
- **Hero animation (hybrid)** — Canvas 2D intro (`hero/CosmicBirth.js`: big bang → warp → solar system, ~6.6s, skip button, no replay shortening) + one transparent WebGL canvas (`space3d/Space3D.js`: plain three.js, no R3F, dynamic-imported). Sync via the shared mutable `intro` singleton (`space3d/introState.js`) — CosmicBirth writes clock + Earth-planet position per frame, Space3D reads. Ortho camera in pixel space (1 unit = 1 CSS px). Canvas z-index 0 (below `#sections` z1) so content overlays Earth/ship; it hoists to z5 only while the ship passes in front of the hero heading mid-orbit.
- **Ship motion** — orbit around the h1 at page top, scroll lane with velocity-based nose steering, card-mirroring in `#experience`, Earth approach at page bottom; final pose is speed-limited (~1100 px/s) so target jumps become nose-first flights.
