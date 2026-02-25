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
