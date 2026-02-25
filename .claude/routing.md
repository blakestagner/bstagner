# Routing

## App Router Structure
Next.js 15 App Router — no `pages/` directory.

```
app/
├── layout.js           # Root layout — loads Google Fonts, globals.scss
├── page.js             # Homepage (/)
├── (auth)/
│   └── login/          # /login
├── (portfolio)/
│   ├── apps/           # /apps
│   ├── calendar/       # /calendar
│   └── todos/          # /todos
└── api/
    └── auth/           # NextAuth.js v5 catch-all route
```

## Route Groups
- `(auth)` and `(portfolio)` are organizational only — no URL impact
- Route groups can have their own `layout.js` if needed

## Homepage Layout (`app/page.js`)
- Marked `'use client'` (uses state + IntersectionObserver)
- Single page with scroll-snap sections: `hero → about → portfolio → components → footer`
- Active section tracked via `IntersectionObserver` on `#sections` container (threshold: 0.4)
- `section` state passed as prop to `Toolbar`, `About`, `Portfolio`, `Components`
- Section IDs used for detection: `#hero`, `#about`, `#portfolio`, `#components`

## Root Layout (`app/layout.js`)
- Loads `Montserrat` and `Teko` from `next/font/google` as CSS variables
- Font variables: `--font-montserrat`, `--font-teko`
- Both fonts applied to `<html>` element as class variables

## Auth
- NextAuth.js v5 (beta) — `next-auth@^5.0.0-beta.30`
- API route at `app/api/auth/`
- Auth pages in `app/(auth)/login/`

## Adding New Routes
1. Create folder under `app/(portfolio)/` for portfolio-related pages
2. Add `page.js` (and optionally `layout.js`) inside
3. For client interactivity, add `'use client'` at top of `page.js`
4. No config needed — file-based routing handles it automatically
