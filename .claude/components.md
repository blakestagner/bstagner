# Components

## Organization
Components live in `components/` grouped by feature/concern:

| Folder | Contents |
|--------|----------|
| `ui/` | Generic primitives — buttons only currently |
| `shared/` | Cross-feature reusables — `Loading`, `SectionTitle` |
| `portfolio/` | `Portfolio`, `PortfolioImg`, `PortfolioItems` |
| `hero/` | Landing/hero section |
| `about/` | About section |
| `sections/` | Page section wrappers |
| `toolbar/` | Site navigation / toolbar |
| `footer/` | Footer |
| `interactive/` | Dynamic / client-interactive components |

## UI Primitives (`components/ui/`)
Available button variants:
- `ButtonFooter` — footer context
- `ButtonIcon` / `ButtonIconMd` — icon buttons (two sizes)
- `ButtonSecondary` — secondary action
- `ButtonSm` — small button
- `ButtonWhite` — white/light variant

All share `button.scss` for base styles.

## Shared Components (`components/shared/`)
- `Loading` — loading state indicator (has `loading.scss`)
- `SectionTitle` — consistent section heading

## Conventions
- Each component is a named `.js` file (no index files)
- SCSS module co-located in the same folder as the component
- Client components must include `'use client'` directive at top
- `react-device-detect` available for responsive/device-specific logic

## Adding New Components
1. Create folder under appropriate `components/` subfolder
2. Create `ComponentName.js` — add `'use client'` if needed
3. Create `componentName.scss` in the same folder
4. Import SCSS directly in the component file
