# Deployment

## Platform: Netlify
Deployed via `@netlify/plugin-nextjs` — handles SSR/ISR automatically.

## Config (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Build Commands
```bash
npm run build    # Production build → .next/
npm run start    # Run production build locally
```

## Environment Variables
- NextAuth.js v5 requires `AUTH_SECRET` in production
- Set env vars in Netlify dashboard, not committed to repo

## Security Headers (next.config.js)
Applied to all routes (`/:path*`):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## Image Optimization
- Formats: `avif`, `webp` (configured in `next.config.js`)
- Compression enabled (`compress: true`)

## React Strict Mode
Enabled — double-invokes effects in dev to surface side effect bugs.

## Branch / Deploy Flow
- `master` branch → production deploy on Netlify
- PRs auto-deploy as preview URLs via Netlify
