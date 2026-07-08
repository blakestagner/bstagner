# bstagner Portfolio — Claude Context

Blake Stagner's personal portfolio. Next.js 16, React 19, SCSS Modules, three.js (WebGL hero layer), deployed on Netlify (Node 22 via netlify.toml + .nvmrc).

## Commands
```bash
npm run dev      # Dev server (localhost:3000; may fall back to 3001 if occupied)
npm run build    # Production build
# npm run lint is broken — Next 16 removed `next lint`
```

## Context Files
Load these when relevant to your task:

| Task | File |
|------|------|
| Project structure / routing | [.claude/architecture.md](.claude/architecture.md) |
| Building components | [.claude/components.md](.claude/components.md) |
| Styles / SCSS | [.claude/styling.md](.claude/styling.md) |
| App Router / pages | [.claude/routing.md](.claude/routing.md) |
| Build / deploy | [.claude/deployment.md](.claude/deployment.md) |

## Key Rules
- No TypeScript — plain JS with JSConfig path aliases
- SCSS modules co-located with components (not global)
- App Router only — no `pages/` directory
- `next-auth@5` is a dependency but not yet wired — `app/(auth)` and `app/api` are empty scaffolding
- Hero animation: Canvas 2D intro (`components/hero/CosmicBirth.js`) + WebGL ship/Earth (`components/space3d/`), synced via the `intro` singleton in `components/space3d/introState.js`. Nose-toward-(dx,dy) in CSS coords is `rotation.z = +Math.atan2(dx, dy)` — a `-atan2` reads ~90° mirrored on angled paths.
- Earth textures live in `public/textures/earth/` (2K desktop / 1K mobile), lazy-loaded post-intro via `requestIdleCallback` with `{ timeout: 2000 }` (never omit the timeout)
