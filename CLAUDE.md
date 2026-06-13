# bstagner Portfolio — Claude Context

Blake Stagner's personal portfolio. Next.js 16, React 19, SCSS Modules, deployed on Netlify.

## Commands
```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
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
