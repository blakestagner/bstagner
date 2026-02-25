# Styling

## Stack
- **SCSS** (sass ^1.97.2) — modules co-located with components
- `styles/variables.scss` — auto-included via `sassOptions.includePaths` in `next.config.js`
- `app/globals.scss` — global resets and utility classes (minimal)

## Importing Variables
Variables are available without explicit import path since `./styles` is in `includePaths`:
```scss
@import 'variables';  // works in any component SCSS file
```

## Variables (`styles/variables.scss`)
```scss
// Gradients
$gradient   // blue → cyan → green (primary brand)
$gradient-2 // blue → purple

// Colors
$color-main  // rgba(2, 119, 189, 1) — primary blue
$white       // #f0f8ff — off-white background

// Shadows
$shadow-lg   // 0 3px 6px ...
$shadow-md   // 0 1px 3px ...
```

## Global Utilities (`app/globals.scss`)
Available globally — do not redefine in modules:
- `.main-container` — max-width 1200px, centered, padded
- `.flex-center` — flexbox center both axes
- `.heading` — section heading wrapper
- `.header-title-text` + `.animate` — entrance animation (opacity + translateY)

## Layout System
- **Scroll snapping**: `#sections` uses CSS scroll snap (`y mandatory`), each child `100vh`
- First child is `125vh` (hero); last child has no padding
- Background color: `#f0f8ff` (`$white`)

## Typography
- Body font: `var(--font-montserrat)` (Next.js font variable)
- Headings (`h1`, `h2`): `var(--font-teko)` (display font)
- Base font size: `16px` (15px on ≤800px)
- `h1`: 4em / `h2`: 3em / `h3`: 1.75em — all `margin: 0`

## Breakpoints
- `≤ 800px` — body font-size reduction
- `≤ 400px` — `.main-container` reduced padding
- `≤ 320px` — `h3` size reduction

## Conventions
- Component-specific styles go in co-located `.scss` file, not globals
- Use SCSS variables for colors/shadows — avoid hardcoded values
- Use `$gradient` for brand gradient applications
