# Space-Themed Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-page portfolio into a cinematic, continuously-animated space journey: persistent parallax starfield, upgraded hero with orbital rings and scrubbed scroll-out, free document scrolling, and 7 distinct sections (Hero, About, Skills, Projects, Demos, Experience, Contact) with scroll reveals and reduced-motion support.

**Architecture:** One fixed full-viewport canvas (`SpaceBackground`) renders stars/dust/nebulae behind all sections (sections become transparent so the sky is shared). GSAP + ScrollTrigger drives scroll choreography via a tiny shared lib (`lib/animation.js`) and a `useReveal` hook + `data-reveal` attribute convention. Scroll-snap is removed; the document scrolls normally.

**Tech Stack:** Next.js 16 App Router, plain JS (no TypeScript), per-component global SCSS, GSAP (only new dependency).

**Spec:** `docs/superpowers/specs/2026-06-12-space-redesign-design.md`

---

## Ground rules for every task

- Working directory: `/Users/blakestagner/Documents/GitHub/bstagner`. Plain JS only — no TypeScript syntax.
- SCSS convention: each component `.scss` declares the design-token variables it uses at the top of the file (see existing `components/about/about.scss` header). Copy needed tokens from `styles/variables.scss`. New files follow the same convention.
- Content rule: do NOT rewrite or invent professional copy. Reuse existing text verbatim. Placeholder content must literally start with `TODO:`.
- Only animate `transform` and `opacity`. Never animate layout properties.
- `git add` ONLY the files you created/modified for your task (the repo has unrelated uncommitted changes — `.gitignore`, `CLAUDE.md`, `package.json`). Never commit `.env`.
- Verification gate for every task: `npm run build` must succeed (expect "Compiled successfully"). Run `npm run lint` too; fix new warnings you introduced.
- Known mid-plan states (do not "fix" these): section titles animate only after Task 2; sections look flat-dark until Task 3; About/Portfolio/Components still receive a now-undefined `section` prop until their own tasks — harmless.

---

### Task 1: Foundation — GSAP install, free scrolling, page shell, Toolbar rewrite

**Files:**
- Modify: `package.json` / `package-lock.json` (via npm install)
- Modify: `app/globals.scss:95-124` (scroll container block) and `:169-176` (.main-container)
- Modify: `app/page.js` (full rewrite)
- Modify: `components/toolbar/Toolbar.js` (full rewrite)
- Modify: `components/toolbar/toolbar.scss` (navbar state classes)
- Modify: `components/footer/Footer.js:8-14` (scrollTop)

- [ ] **Step 1: Install GSAP**

Run: `npm install gsap`
Expected: adds `"gsap"` to dependencies, exit 0.

- [ ] **Step 2: Replace the scroll-snap container styles in `app/globals.scss`**

Delete the entire `/* Critical scroll container styles */` block (the rules for `#sections`, `#sections > div`, `#sections > div#about, ...`, `#sections > div:first-of-type`, `#sections > div:last-of-type` — currently lines 95–124). Replace with:

```scss
/* Free-flowing document scroll */
html {
  scroll-behavior: smooth;
}

#sections {
  position: relative;
  z-index: 1;
}

#sections > section,
#sections > div {
  position: relative;
  margin: 0 auto;
}
```

- [ ] **Step 3: Update `.main-container` in `app/globals.scss`**

Replace the `.main-container` rule with:

```scss
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 6em 1em 4em;
  min-height: 60vh;
  color: var(--color-text-primary);
}
```

In the `@media (max-width: 400px)` block at the bottom, replace the `.main-container` override with:

```scss
.main-container {
  text-align: center;
  padding: 4em 1em 3em;
}
```

- [ ] **Step 4: Rewrite `app/page.js`**

Full new contents (no IntersectionObserver, no `section` state/prop):

```jsx
'use client'

import Toolbar from '@/components/toolbar/Toolbar';
import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Portfolio from '@/components/portfolio/Portfolio';
import Components from '@/components/sections/Components';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <div className="app">
      <Toolbar />
      <main id="sections">
        <Hero />
        <About />
        <Portfolio />
        <Components />
        <Footer />
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Rewrite `components/toolbar/Toolbar.js`**

Window-scroll driven, all 6 anchor links, active-section highlight, white icons only (site is permanently dark). Full new contents:

```jsx
'use client'

import { useState, useEffect, useRef } from 'react';
import './toolbar.scss';

const menuIcon = '/icons/toolbar/menu-white.svg';
const closeIcon = '/icons/toolbar/close-white.svg';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'portfolio', label: 'Projects' },
  { id: 'components', label: 'Demos' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Toolbar() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState('');
  const prevScrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > prevScrollRef.current && y > 300);
      prevScrollRef.current = y;

      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          current = link.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id) => {
    setMobileNav(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`navBar ${solid ? 'navBar--solid' : ''} ${hidden && !mobileNav ? 'navBar--hidden' : ''}`}
      id='mainNav'>
      <div className='navBarContainer'>
        <p id='main-title'>
          <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BS</span>
        </p>
        <div>
          <ul id='mainMenuList'>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <p
                  className={`navList ${active === link.id ? 'active' : ''}`}
                  onClick={() => handleClick(link.id)}>
                  {link.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <img
          onClick={() => setMobileNav(!mobileNav)}
          className='menu-icon-animation'
          src={mobileNav ? closeIcon : menuIcon}
          alt='menu toggle'
        />
      </div>
      <div className={mobileNav ? 'mobile-nav open' : 'mobile-nav closed'}>
        {NAV_LINKS.map((link) => (
          <p key={link.id} onClick={() => handleClick(link.id)}>{link.label}</p>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 6: Update `components/toolbar/toolbar.scss`**

First, ensure these variables are declared at the top of the file (add any that are missing, following the file's existing variable header style):

```scss
$border-subtle: rgba(255, 255, 255, 0.07);
$color-accent: #4fc3f7;
```

Read the existing `.navBar` rule and KEEP its layout properties (width/padding/display etc.) but make it fixed and transition-enabled; then DELETE the `.scrollBar` and `.scrolled` rules entirely and add the new state classes. The `.navBar` rule must end up containing (merge with existing layout props):

```scss
.navBar {
  /* ...existing layout props stay... */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: transform 300ms ease, background 300ms ease, box-shadow 300ms ease;
}

.navBar--solid {
  background: rgba(8, 8, 16, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid $border-subtle;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.navBar--hidden {
  transform: translateY(-100%);
}

.navList.active {
  color: $color-accent;
}

#mainMenuList li p.active::after {
  width: 100%;
}
```

If `#indicator` styles exist and nothing references them, leave them (cleanup happens in Task 11).

- [ ] **Step 7: Fix Footer scroll-to-top in `components/footer/Footer.js`**

Replace the `scrollTop` function body with:

```js
const scrollTop = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 });
};
```

- [ ] **Step 8: Verify**

Run: `npm run build` → expect success. Run `npm run lint` → no new errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json app/globals.scss app/page.js components/toolbar/Toolbar.js components/toolbar/toolbar.scss components/footer/Footer.js
git commit -m "feat: free document scrolling, GSAP install, toolbar rewrite

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Animation utilities + SectionTitle

**Files:**
- Create: `lib/animation.js`
- Create: `lib/useReveal.js`
- Modify: `components/shared/SectionTitle.js` (full rewrite)
- Modify: `app/globals.scss` (section heading styles)

- [ ] **Step 1: Create `lib/animation.js`**

```js
'use client'

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
```

- [ ] **Step 2: Create `lib/useReveal.js`**

A hook a section root attaches via `ref`; every descendant with `data-reveal` animates in once when scrolled into view. `data-reveal` value picks direction: `up` (default), `left`, `right`, `scale`.

```js
'use client'

import { useEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/animation';

export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    const { gsap } = getGsap();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      targets.forEach((target, i) => {
        const direction = target.dataset.reveal || 'up';
        const from = { opacity: 0 };
        if (direction === 'up' || direction === '') from.y = 48;
        if (direction === 'left') from.x = -56;
        if (direction === 'right') from.x = 56;
        if (direction === 'scale') from.scale = 0.92;
        gsap.from(target, {
          ...from,
          duration: 0.9,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: target, start: 'top 80%', once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}
```

- [ ] **Step 3: Rewrite `components/shared/SectionTitle.js`**

```jsx
export default function SectionTitle({ title }) {
  return (
    <div className='section-title' data-reveal>
      <h1>{title}</h1>
      <span className='title-strip' aria-hidden='true'></span>
    </div>
  );
}
```

(Existing callers still pass `inView` — it is simply ignored; callers get updated in their own tasks.)

- [ ] **Step 4: Update heading styles in `app/globals.scss`**

In the `/* Section headings */` block, DELETE the `.header-title-text` and `.animate` rules. Add:

```scss
.section-title h1 {
  z-index: 2;
  color: var(--color-text-primary);
}

.title-strip {
  display: block;
  width: 72px;
  height: 3px;
  margin: 0 auto;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-purple));
  box-shadow: 0 0 12px var(--color-accent-glow);
}
```

- [ ] **Step 5: Verify**

`npm run build` → success. Load check: titles now always visible (static) — expected until sections adopt `useReveal`.

- [ ] **Step 6: Commit**

```bash
git add lib/animation.js lib/useReveal.js components/shared/SectionTitle.js app/globals.scss
git commit -m "feat: GSAP animation utils, useReveal hook, static-safe SectionTitle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Persistent SpaceBackground canvas + transparent sections

**Files:**
- Create: `components/space/SpaceBackground.js`
- Create: `components/space/space.scss`
- Modify: `app/page.js` (mount)
- Modify: `components/about/about.scss`, `components/portfolio/portfolio.scss`, `components/sections/components.scss`, `components/footer/footer.scss` (transparent section wrappers)

- [ ] **Step 1: Create `components/space/space.scss`**

```scss
.space-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
```

- [ ] **Step 2: Create `components/space/SpaceBackground.js`**

Three parallax star layers + drifting dust + scroll-progress nebula color journey (blue → purple → deep cyan) + scroll-velocity star streaks + bottom horizon glow near page end. Pauses when tab hidden; static single frame under reduced motion; DPR capped at 2; reseeds on resize.

```jsx
'use client'

import { useEffect, useRef } from 'react';
import './space.scss';

const LAYERS = [
  { count: 110, drift: 4, parallax: 0.1, size: [0.4, 1.1], alpha: 0.55 },
  { count: 70, drift: 8, parallax: 0.22, size: [0.7, 1.7], alpha: 0.8 },
  { count: 34, drift: 14, parallax: 0.4, size: [1.1, 2.2], alpha: 1 },
];
const DUST_COUNT = 22;

// Nebula color journey: electric blue (hero) -> purple (mid) -> deep cyan (contact)
const NEBULA_STOPS = [
  [79, 195, 247],
  [124, 77, 255],
  [38, 198, 218],
];

const lerp = (a, b, t) => a + (b - a) * t;

function nebulaColor(progress) {
  const scaled = progress * (NEBULA_STOPS.length - 1);
  const i = Math.min(Math.floor(scaled), NEBULA_STOPS.length - 2);
  const t = scaled - i;
  return NEBULA_STOPS[i].map((v, k) => Math.round(lerp(v, NEBULA_STOPS[i + 1][k], t)));
}

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let dust = [];
    let rafId = null;
    let lastTime = 0;
    let elapsed = 0;
    let smoothVelocity = 0;
    let lastScrollY = window.scrollY;

    const seed = () => {
      const density = width < 700 ? 0.5 : 1;
      stars = [];
      LAYERS.forEach((layer, layerIndex) => {
        for (let i = 0; i < Math.floor(layer.count * density); i++) {
          stars.push({
            layer: layerIndex,
            x: Math.random() * width,
            y: Math.random() * height,
            r: lerp(layer.size[0], layer.size[1], Math.random()),
            alpha: layer.alpha * (0.5 + Math.random() * 0.5),
            phase: Math.random() * Math.PI * 2,
            twinkle: 0.5 + Math.random() * 1.5,
          });
        }
      });
      dust = [];
      for (let i = 0; i < Math.floor(DUST_COUNT * density); i++) {
        dust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 30 + Math.random() * 80,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 3,
          alpha: 0.015 + Math.random() * 0.02,
        });
      }
    };

    const scrollProgress = () => {
      const max = document.documentElement.scrollHeight - height;
      return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };

    const drawNebulae = (progress) => {
      const [r, g, b] = nebulaColor(progress);
      const sway = Math.sin(elapsed * 0.00008);

      const x1 = width * (0.25 + 0.05 * sway);
      const y1 = height * 0.3;
      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, width * 0.5);
      grad1.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.07)`);
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const x2 = width * (0.78 - 0.05 * sway);
      const y2 = height * 0.72;
      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, width * 0.45);
      grad2.addColorStop(0, `rgba(${Math.round(r * 0.6)}, ${Math.round(g * 0.5)}, ${b}, 0.06)`);
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);
    };

    const drawHorizonGlow = (progress) => {
      if (progress < 0.85) return;
      const strength = (progress - 0.85) / 0.15;
      const grad = ctx.createLinearGradient(0, height, 0, height * 0.55);
      grad.addColorStop(0, `rgba(79, 195, 247, ${0.16 * strength})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    const drawFrame = () => {
      const scrollY = window.scrollY;
      const progress = scrollProgress();
      ctx.clearRect(0, 0, width, height);
      drawNebulae(progress);

      ctx.globalCompositeOperation = 'lighter';
      for (const mote of dust) {
        const grad = ctx.createRadialGradient(mote.x, mote.y, 0, mote.x, mote.y, mote.r);
        grad.addColorStop(0, `rgba(124, 77, 255, ${mote.alpha})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      for (const star of stars) {
        const layer = LAYERS[star.layer];
        let y = (star.y - scrollY * layer.parallax - elapsed * 0.001 * layer.drift) % height;
        if (y < 0) y += height;
        const twinkle = 0.7 + 0.3 * Math.sin(elapsed * 0.001 * star.twinkle + star.phase);
        const alpha = star.alpha * twinkle;
        const streak = Math.min(Math.abs(smoothVelocity) * layer.parallax * 0.06, 14);

        if (streak > 1.5) {
          ctx.strokeStyle = `rgba(240, 244, 255, ${alpha})`;
          ctx.lineWidth = star.r;
          ctx.beginPath();
          ctx.moveTo(star.x, y);
          ctx.lineTo(star.x, y + streak * Math.sign(smoothVelocity));
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(240, 244, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawHorizonGlow(progress);
    };

    const loop = (now) => {
      const delta = Math.min(now - lastTime, 64) || 16;
      lastTime = now;
      elapsed += delta;

      const scrollY = window.scrollY;
      const velocity = (scrollY - lastScrollY) / (delta / 16.7);
      lastScrollY = scrollY;
      smoothVelocity += (velocity - smoothVelocity) * 0.1;

      for (const mote of dust) {
        mote.x = (mote.x + (mote.vx * delta) / 1000 + width) % width;
        mote.y = (mote.y + (mote.vy * delta) / 1000 + height) % height;
      }

      drawFrame();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafId === null && !reduceMotion) {
        lastTime = performance.now();
        lastScrollY = window.scrollY;
        rafId = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduceMotion) drawFrame();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className='space-bg' aria-hidden='true' />;
}
```

- [ ] **Step 3: Mount in `app/page.js`**

Add the import and render it as the first child of `.app`:

```jsx
'use client'

import Toolbar from '@/components/toolbar/Toolbar';
import SpaceBackground from '@/components/space/SpaceBackground';
import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Portfolio from '@/components/portfolio/Portfolio';
import Components from '@/components/sections/Components';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <div className="app">
      <SpaceBackground />
      <Toolbar />
      <main id="sections">
        <Hero />
        <About />
        <Portfolio />
        <Components />
        <Footer />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Make section wrappers transparent so the shared sky shows through**

- `components/about/about.scss` — in the `#about` rule, change `background: $bg-base;` to `background: transparent;`
- `components/portfolio/portfolio.scss` — in the `#portfolio` rule, change `background: $bg-base;` to `background: transparent;`
- `components/sections/components.scss` — in the `#components` rule, change `background: $bg-base;` to `background: transparent;`
- `components/footer/footer.scss` — in the `.footer` rule, change `background: $bg-surface;` to `background: linear-gradient(180deg, rgba(16, 16, 30, 0) 0%, rgba(16, 16, 30, 0.7) 45%);` and in the `.footer-2` rule change `background-color: $bg-base;` to `background-color: rgba(8, 8, 16, 0.6);`

Cards/panels INSIDE sections keep their surface backgrounds.

- [ ] **Step 5: Verify**

`npm run build` → success. Dev-check expectation: animated stars visible behind About/Portfolio/Demos/Footer; stars streak slightly during fast scroll.

- [ ] **Step 6: Commit**

```bash
git add components/space app/page.js components/about/about.scss components/portfolio/portfolio.scss components/sections/components.scss components/footer/footer.scss
git commit -m "feat: persistent parallax space background canvas behind all sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Hero upgrade — orbital rings, mouse tilt, scrubbed scroll-out, CTAs

**Files:**
- Create: `components/hero/OrbitalRings.js`
- Modify: `components/hero/Hero.js` (full rewrite)
- Modify: `components/hero/HeroText.js` (full rewrite)
- Modify: `components/hero/hero.scss` (targeted edits + appended block)

- [ ] **Step 1: Create `components/hero/OrbitalRings.js`**

```jsx
export default function OrbitalRings() {
  return (
    <div className='orbital-rings' aria-hidden='true'>
      <div className='orbit-ring orbit-ring--1'>
        <span className='orbit-body orbit-body--cyan'></span>
      </div>
      <div className='orbit-ring orbit-ring--2'>
        <span className='orbit-body orbit-body--purple'></span>
      </div>
      <div className='orbit-ring orbit-ring--3'>
        <span className='orbit-body orbit-body--white'></span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `components/hero/Hero.js`**

No `react-device-detect`, no static `#starfield` canvas (shared SpaceBackground covers it). Decorative scene wrapped in `.hero-stage` for the scrubbed scroll-out; GSAP mouse-tilt parallax on fine pointers.

```jsx
'use client'

import { useEffect, useRef, useState } from 'react';
import './hero.scss';
import Sun from './Sun';
import PurpleGalaxy from './PurpleGalaxy';
import GreenGalaxy from './GreenGalaxy';
import OrbitalRings from './OrbitalRings';
import HeroText from './HeroText';
import { getGsap, prefersReducedMotion } from '@/lib/animation';

export default function Hero() {
  const heroRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.to('.hero-stage', {
        opacity: 0,
        scale: 0.94,
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 30%', scrub: 0.6 },
      });
      gsap.to('.hero-text', {
        xPercent: -12,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% top', scrub: 0.6 },
      });
    }, heroRef);

    let removeMove;
    if (window.matchMedia('(pointer: fine)').matches) {
      const layers = [
        { selector: '#sun', depth: 18 },
        { selector: '.galaxy-1-container', depth: 30 },
        { selector: '.galaxy-2-container', depth: 24 },
        { selector: '.orbital-rings', depth: 12 },
      ];
      const tweens = layers
        .map(({ selector, depth }) => {
          const el = heroRef.current.querySelector(selector);
          if (!el) return null;
          return {
            x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power2.out' }),
            y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power2.out' }),
            depth,
          };
        })
        .filter(Boolean);
      const onMove = (e) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        tweens.forEach((t) => {
          t.x(dx * t.depth);
          t.y(dy * t.depth);
        });
      };
      window.addEventListener('pointermove', onMove);
      removeMove = () => window.removeEventListener('pointermove', onMove);
    }

    return () => {
      ctx.revert();
      if (removeMove) removeMove();
    };
  }, []);

  return (
    <section id='hero' className='hero' ref={heroRef}>
      <span className='hero-background' aria-hidden='true'></span>
      <div className='hero-stage' aria-hidden='true'>
        <OrbitalRings />
        <Sun loading={loading} />
        <PurpleGalaxy />
        <GreenGalaxy />
      </div>
      <HeroText loading={loading} />
    </section>
  );
}
```

- [ ] **Step 3: Rewrite `components/hero/HeroText.js`**

Same headings/copy, no device-detect (CSS media queries handle mobile), no scroll listener (GSAP scrub replaced it), adds CTA buttons (navigation labels only — not biography copy).

```jsx
'use client'

export default function HeroText({ loading }) {
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className='hero-text'>
      <div className='blake-stagner'>
        <h1 id='anim1' className={loading ? 'heading-1' : 'heading-animate-1 heading-transition'}>
          BLAKE
        </h1>
        <h1 id='anim2' className={loading ? 'heading-2' : 'heading-animate-2 heading-transition'}>
          STAGNER
        </h1>
        <p id='anim3'>
          <span className={loading ? 'welcome-text' : 'welcome-text welcome-text-animation'}>Full-Stack &amp;</span>
          <span className={loading ? 'universe-text' : 'universe-text universe-text-animation'}> AI Engineer</span>
        </p>
        <div className={loading ? 'hero-cta' : 'hero-cta hero-cta--in'}>
          <button className='hero-btn hero-btn--primary' onClick={() => goTo('portfolio')}>
            View My Work
          </button>
          <button className='hero-btn hero-btn--ghost' onClick={() => goTo('contact')}>
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Edit `components/hero/hero.scss`**

Make these targeted changes (read the file first; it is ~938 lines):

1. Replace the `.hero` rule with:

```scss
.hero {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 0;
  position: relative;
  min-height: 100vh;
  background: transparent;
}
```

2. DELETE the `.hero-initial` rule (no longer referenced).
3. Replace the `.hero-background` rule (brand-colored glow, no green):

```scss
.hero-background {
  width: 100vw;
  height: 100%;
  position: absolute;
  background: radial-gradient(
      farthest-side at top left,
      rgba(124, 77, 255, 0.22),
      transparent
    ),
    radial-gradient(
      farthest-corner at top right,
      rgba(79, 195, 247, 0.12),
      transparent 800px
    );
}
```

4. DELETE the `#starfield` rule.
5. Replace the `.hero > div:first-of-type` rule with:

```scss
.hero-text {
  width: 50%;
  margin: 1em;
  position: relative;
  z-index: 2;
}
```

6. Find the device-detect mobile classes (`.blake-stagner-mobile`, `.heading-transition-mobile`, `.welcome-text-animation-mobile`, `.universe-text-animation-mobile`, `.welcome-text-mobile`): move their declarations into a `@media (max-width: 800px)` block applied to the base classes (`.blake-stagner`, `.heading-transition`, `.welcome-text-animation`, `.universe-text-animation`), then delete the `-mobile` variants. Also delete any `.mobile-galaxy` rules if present.
7. APPEND this block at the end of the file:

```scss
/* ============================================================
   Hero stage, orbital rings, CTAs (space redesign)
   ============================================================ */

.hero-stage {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
}

.orbital-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(79, 195, 247, 0.12);
  border-radius: 50%;
  animation: orbit-spin linear infinite;
}

.orbit-ring--1 {
  width: 34vw;
  height: 34vw;
  animation-duration: 36s;
}

.orbit-ring--2 {
  width: 50vw;
  height: 50vw;
  border-color: rgba(124, 77, 255, 0.1);
  animation-duration: 58s;
  animation-direction: reverse;
}

.orbit-ring--3 {
  width: 68vw;
  height: 68vw;
  border-color: rgba(255, 255, 255, 0.05);
  animation-duration: 90s;
}

@keyframes orbit-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.orbit-body {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.orbit-body--cyan {
  background: #4fc3f7;
  box-shadow: 0 0 12px rgba(79, 195, 247, 0.9);
}

.orbit-body--purple {
  width: 6px;
  height: 6px;
  background: #7c4dff;
  box-shadow: 0 0 12px rgba(124, 77, 255, 0.9);
}

.orbit-body--white {
  width: 5px;
  height: 5px;
  background: #f0f4ff;
  box-shadow: 0 0 10px rgba(240, 244, 255, 0.8);
}

.hero-cta {
  display: flex;
  gap: 1em;
  margin-top: 1.5em;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 800ms ease 1100ms, transform 800ms ease 1100ms;
}

.hero-cta--in {
  opacity: 1;
  transform: translateY(0);
}

.hero-btn {
  padding: 0.8em 1.8em;
  font-family: inherit;
  font-size: 1em;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.hero-btn--primary {
  border: none;
  color: #080810;
  background: linear-gradient(135deg, #4fc3f7 0%, #7c4dff 100%);
  box-shadow: 0 0 24px rgba(79, 195, 247, 0.25);
}

.hero-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(79, 195, 247, 0.4);
}

.hero-btn--ghost {
  border: 1px solid rgba(79, 195, 247, 0.35);
  color: #f0f4ff;
  background: transparent;
}

.hero-btn--ghost:hover {
  transform: translateY(-2px);
  background: rgba(79, 195, 247, 0.08);
}

@media (max-width: 800px) {
  .hero-text {
    width: 100%;
    margin: 0 1em;
  }

  .galaxy-1-container,
  .galaxy-2-container,
  #sun {
    display: none;
  }

  .orbit-ring--1 {
    width: 80vw;
    height: 80vw;
  }

  .orbit-ring--2 {
    width: 110vw;
    height: 110vw;
  }

  .orbit-ring--3 {
    display: none;
  }

  .hero-cta {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-ring {
    animation: none;
  }

  .hero-cta {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 5: Verify**

`npm run build` → success. Dev expectations: hero fills 100vh; rings orbit; scene drifts/fades scrolling away; headings slide out via scrub; mouse moves scene subtly on desktop; mobile shows headings + rings only.

- [ ] **Step 6: Commit**

```bash
git add components/hero/OrbitalRings.js components/hero/Hero.js components/hero/HeroText.js components/hero/hero.scss
git commit -m "feat: hero orbital rings, mouse parallax, scrubbed scroll-out, CTAs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Standalone About section (console panel, tabs removed)

**Files:**
- Create: `lib/data/skills.js`
- Modify: `components/about/About.js` (full rewrite)
- Modify: `components/about/about.scss` (remove tab + skills styles, add panel styles)

- [ ] **Step 1: Create `lib/data/skills.js`**

Move the `skillCategories` array out of `About.js` VERBATIM (same ids, titles, skills, order) and export it:

```js
export const skillCategories = [
  {
    id: 'ai',
    title: 'AI & Growth',
    skills: ['Anthropic Claude', 'OpenAI ChatGPT', 'Google Gemini', 'RAG Systems', 'A/B Testing', 'Conversion Optimization'],
  },
  {
    id: 'languages',
    title: 'Languages & Frameworks',
    skills: ['JavaScript', 'TypeScript', 'PHP', 'React', 'Next.js', 'Node.js', 'Express', 'React Native', 'WordPress'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    skills: ['Flutter', 'Dart', 'Android', 'iOS', 'React Native'],
  },
  {
    id: 'infra',
    title: 'Data & Infrastructure',
    skills: ['SQL', 'Snowflake', 'Firebase', 'Docker', 'GitHub Actions', 'Cloudflare', 'Netlify', 'Nginx'],
  },
];
```

- [ ] **Step 2: Rewrite `components/about/About.js`**

Bio copy is reused EXACTLY as it exists today (both paragraphs and the mobile intro). No tabs, no `section` prop.

```jsx
'use client'

import './about.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

const blakeImg = '/images/about/blake.webp';

export default function About() {
  const ref = useReveal();

  return (
    <section id='about' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='About' />
        </div>
        <div className='about-panel' data-reveal='scale'>
          <div className='bio'>
            <div>
              <img className='blake-img' src={blakeImg} alt='Blake Stagner' />
              <p className='mobile-intro'>
                <span>Senior Full-Stack &amp; AI Engineer</span> — 7+ years shipping production software with Claude, ChatGPT, Gemini, React, Node.js, and Flutter.
              </p>
            </div>
            <div>
              <p>
                <span>Senior Full-Stack &amp; AI Engineer</span> with 7+ years shipping production software — from React frontends and Node.js APIs to AI-powered products built with Claude, ChatGPT, and Gemini. I specialize in turning AI capabilities into real business outcomes.
              </p>
              <p>
                <span>Results?</span> Built an AI call transcript grader that improved CPAP conversions by 15% in 3 months. Delivered a ChatGPT-powered mattress recommendation widget, a RAG chatbot with Google Gemini, a self-serve A/B testing platform, and a cross-platform Flutter mobile app — all at scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `components/about/about.scss`**

- DELETE these rules: `.header-tab > h2`, `.header-tab > h2.active`, `.about-tab`, `.tab-transition`, and ALL `.skills-grid`, `.skill-card`, `.skill-card--ai`, `.skill-tags`, `.skill-tag` rules (including their hover/media-query variants — Skills gets its own section next task).
- KEEP: the variable header, `#about` (transparent from Task 3), `#about h3`, `.bio`, `.blake-img`, `.blake-img:hover`, `.mobile-intro`, `.bio > div...` rules and their media queries.
- ADD the console-panel treatment:

```scss
.about-panel {
  position: relative;
  max-width: 940px;
  margin: 2.5em auto 0;
  padding: 2.5em;
  background: rgba(16, 16, 30, 0.66);
  border: 1px solid $border-subtle;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
  text-align: left;
  overflow: hidden;
}

.about-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, $color-accent, $color-accent-purple, transparent);
  opacity: 0.7;
}

@media (max-width: 650px) {
  .about-panel {
    padding: 1.5em;
  }
}
```

(Ensure `$border-subtle` is declared in the file's variable header; add it if missing.)

- [ ] **Step 4: Verify**

`npm run build` → success. Dev expectations: About is a single glass panel that scales/fades in; no tabs anywhere.

- [ ] **Step 5: Commit**

```bash
git add lib/data/skills.js components/about/About.js components/about/about.scss
git commit -m "feat: standalone About section with console panel, tabs removed

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Skills constellation section

**Files:**
- Create: `components/skills/Skills.js`
- Create: `components/skills/skills.scss`
- Modify: `app/page.js` (add section after About)

- [ ] **Step 1: Create `components/skills/Skills.js`**

```jsx
'use client'

import './skills.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';
import { skillCategories } from '@/lib/data/skills';

export default function Skills() {
  const ref = useReveal();

  return (
    <section id='skills' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='Skills' />
        </div>
        <div className='constellation-grid'>
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className={`constellation ${cat.id === 'ai' ? 'constellation--ai' : ''}`}
              data-reveal>
              <h3>{cat.title}</h3>
              <div className='skill-nodes'>
                {cat.skills.map((skill) => (
                  <span key={skill} className='skill-node'>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/skills/skills.scss`**

```scss
$color-accent: #4fc3f7;
$color-accent-purple: #7c4dff;
$color-text-primary: #f0f4ff;
$color-text-secondary: #8892aa;
$border-subtle: rgba(255, 255, 255, 0.07);
$border-accent: rgba(79, 195, 247, 0.2);

#skills {
  position: relative;
  background: transparent;
}

.constellation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5em;
  margin-top: 2.5em;
  text-align: left;
}

.constellation {
  position: relative;
  padding: 1.75em;
  background: rgba(16, 16, 30, 0.6);
  border: 1px solid $border-subtle;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
}

.constellation:hover {
  transform: translateY(-4px);
  border-color: $border-accent;
  box-shadow: 0 0 24px rgba(79, 195, 247, 0.15);
}

/* faint constellation lines across each cluster */
.constellation::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      115deg,
      transparent 48%,
      rgba(79, 195, 247, 0.08) 49%,
      rgba(79, 195, 247, 0.08) 51%,
      transparent 52%
    ),
    linear-gradient(
      65deg,
      transparent 58%,
      rgba(124, 77, 255, 0.07) 59%,
      rgba(124, 77, 255, 0.07) 61%,
      transparent 62%
    );
  pointer-events: none;
}

.constellation h3 {
  margin-bottom: 0.75em;
  color: $color-text-primary;
}

.skill-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
}

.skill-node {
  position: relative;
  padding: 0.45em 0.9em 0.45em 1.6em;
  font-size: 0.85em;
  color: $color-text-secondary;
  border: 1px solid $border-subtle;
  border-radius: 999px;
  transition: color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}

.skill-node::before {
  content: '';
  position: absolute;
  left: 0.7em;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: $color-accent;
  box-shadow: 0 0 8px rgba(79, 195, 247, 0.8);
}

.skill-node:hover {
  color: $color-text-primary;
  border-color: $border-accent;
  box-shadow: 0 0 12px rgba(79, 195, 247, 0.2);
}

.constellation--ai {
  border-color: $border-accent;
  background: linear-gradient(135deg, rgba(79, 195, 247, 0.08), rgba(124, 77, 255, 0.08)),
    rgba(16, 16, 30, 0.6);
}

.constellation--ai .skill-node::before {
  background: $color-accent-purple;
  box-shadow: 0 0 8px rgba(124, 77, 255, 0.9);
}

@media (max-width: 750px) {
  .constellation-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Add to `app/page.js`**

Add `import Skills from '@/components/skills/Skills';` and render `<Skills />` between `<About />` and `<Portfolio />`.

- [ ] **Step 4: Verify**

`npm run build` → success. Dev expectations: 4 constellation cards stagger in; `#skills` toolbar link now lands on a real section.

- [ ] **Step 5: Commit**

```bash
git add components/skills app/page.js
git commit -m "feat: standalone Skills constellation section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Projects (Portfolio) restyle + reveals

**Files:**
- Modify: `components/portfolio/Portfolio.js` (full rewrite)
- Modify: `components/portfolio/PortfolioItems.js` (add data-reveal)
- Modify: `components/portfolio/portfolio.scss` (card glass + glow, dead style removal)

- [ ] **Step 1: Rewrite `components/portfolio/Portfolio.js`**

```jsx
'use client'

import './portfolio.scss';
import PortfolioItems from './PortfolioItems';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

export default function Portfolio() {
  const ref = useReveal();

  return (
    <section id='portfolio' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='Projects' />
        </div>
        <PortfolioItems />
      </div>
    </section>
  );
}
```

(Section heading text changes from "Portfolio" to "Projects" to match nav — content data unchanged.)

- [ ] **Step 2: Add alternating reveals in `components/portfolio/PortfolioItems.js`**

Change the card map to include an index and a `data-reveal` attribute (everything else identical):

```jsx
{portfolioDetails.map((project, i) => (
  <div
    key={project.name}
    className={`project-card ${project.isAI ? 'project-card--ai' : ''}`}
    data-reveal={i % 2 ? 'right' : 'left'}
  >
```

- [ ] **Step 3: Update `components/portfolio/portfolio.scss`**

- DELETE the `#blue-animation3` and `.blue-strip3` rules (dead since SectionTitle rewrite).
- In `.project-card`, change `background: $bg-surface;` to `background: rgba(16, 16, 30, 0.7);` and add `backdrop-filter: blur(10px);` and `-webkit-backdrop-filter: blur(10px);`.
- Replace the `.project-card:hover` rule with:

```scss
.project-card:hover {
  transform: translateY(-6px);
  border-color: $border-accent;
  box-shadow: 0 0 28px rgba(79, 195, 247, 0.18), 0 12px 32px rgba(0, 0, 0, 0.5);
}
```

(Keep any existing `transition` on `.project-card`; if it doesn't include `transform`, `border-color`, and `box-shadow`, extend it: `transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;`. Ensure `$border-accent` is declared in the variable header.)

- [ ] **Step 4: Verify**

`npm run build` → success. Dev expectations: project cards alternate sliding in from left/right; hover lifts with cyan glow.

- [ ] **Step 5: Commit**

```bash
git add components/portfolio
git commit -m "feat: Projects section reveals and space-panel card styling

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Demos restyle

**Files:**
- Modify: `components/sections/Components.js` (remove section prop, add reveals)
- Modify: `components/sections/components.scss` (pill menu glass, dead style removal)

- [ ] **Step 1: Update `components/sections/Components.js`**

Only the outer component changes; `ComponentsMenu` and the interactive demo components stay as they are. New outer component:

```jsx
function Components() {
    const [displayComponent, setDisplayComponent] = useState(0);
    const ref = useReveal();

    return (
        <section id="components" ref={ref}>
            <div className="main-container">
                <div className="heading">
                    <SectionTitle title="Demos" />
                </div>
                <div data-reveal>
                    <ComponentsMenu
                        component={(state) => setDisplayComponent(state)} />
                    {displayComponent === 0 ?
                        <Calendar /> : ''}
                    {displayComponent === 1 ?
                        <Todo /> : ''}
                    {displayComponent === 2 ?
                        <MeasurementConverter /> : ''}
                    {displayComponent === 3 ?
                        <TicTacToe /> : ''}
                </div>
            </div>
        </section>
    )
}
```

Update imports at the top: add `import useReveal from '@/lib/useReveal';` and remove the now-unused `useEffect` import if nothing else in the file uses it (`ComponentsMenu` still uses `useEffect` — keep it in that case).

- [ ] **Step 2: Update `components/sections/components.scss`**

- DELETE the `.blue-animation` and `.blue-strip` rules (dead since SectionTitle rewrite).
- In the `.components-menu-inner` rule, change `background: $bg-surface;` to `background: rgba(16, 16, 30, 0.6);` and add:

```scss
border: 1px solid $border-subtle;
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```

(Ensure `$border-subtle` is in the variable header.)
- In the `.components-menu-inner div.selected` rule, add `box-shadow: 0 0 16px rgba(79, 195, 247, 0.3);` (keep its existing gradient background).

- [ ] **Step 3: Verify**

`npm run build` → success. Dev expectations: demos section reveals as a block; pill menu is glassy with a glowing selected pill; all four demos still work.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Components.js components/sections/components.scss
git commit -m "feat: Demos section reveal and glass pill menu

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Experience mission-log section (TODO placeholders)

**Files:**
- Create: `components/experience/Experience.js`
- Create: `components/experience/experience.scss`
- Modify: `app/page.js` (add section after Components)

- [ ] **Step 1: Create `components/experience/Experience.js`**

Placeholder entries are deliberate and must remain literal `TODO:` strings — the user fills in real roles.

```jsx
'use client'

import './experience.scss';
import SectionTitle from '@/components/shared/SectionTitle';
import useReveal from '@/lib/useReveal';

// TODO: Replace these placeholder missions with real roles, companies, and dates.
const missions = [
  {
    id: 'mission-3',
    period: 'TODO: Start – End',
    role: 'TODO: Most recent role title',
    org: 'TODO: Company',
    summary: 'TODO: One or two sentences about what you built in this role and the impact it had.',
  },
  {
    id: 'mission-2',
    period: 'TODO: Start – End',
    role: 'TODO: Previous role title',
    org: 'TODO: Company',
    summary: 'TODO: One or two sentences about what you built in this role and the impact it had.',
  },
  {
    id: 'mission-1',
    period: 'TODO: Start – End',
    role: 'TODO: Earlier role title',
    org: 'TODO: Company',
    summary: 'TODO: One or two sentences about what you built in this role and the impact it had.',
  },
];

export default function Experience() {
  const ref = useReveal();

  return (
    <section id='experience' ref={ref}>
      <div className='main-container'>
        <div className='heading'>
          <SectionTitle title='Experience' />
        </div>
        <div className='mission-log'>
          <span className='mission-path' aria-hidden='true'></span>
          {missions.map((mission, i) => (
            <article key={mission.id} className='mission' data-reveal={i % 2 ? 'right' : 'left'}>
              <span className='mission-node' aria-hidden='true'></span>
              <div className='mission-card'>
                <p className='mission-period'>{mission.period}</p>
                <h3>{mission.role}</h3>
                <p className='mission-org'>{mission.org}</p>
                <p className='mission-summary'>{mission.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/experience/experience.scss`**

```scss
$color-accent: #4fc3f7;
$color-accent-purple: #7c4dff;
$color-text-primary: #f0f4ff;
$color-text-secondary: #8892aa;
$border-subtle: rgba(255, 255, 255, 0.07);
$border-accent: rgba(79, 195, 247, 0.2);

#experience {
  position: relative;
  background: transparent;
}

.mission-log {
  position: relative;
  max-width: 860px;
  margin: 3em auto 0;
  padding: 1em 0;
}

/* glowing orbit path down the middle */
.mission-path {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    transparent,
    rgba(79, 195, 247, 0.5) 12%,
    rgba(124, 77, 255, 0.5) 88%,
    transparent
  );
  box-shadow: 0 0 12px rgba(79, 195, 247, 0.25);
}

.mission {
  position: relative;
  width: 50%;
  padding: 0 2.5em 2.5em;
  box-sizing: border-box;
  text-align: left;
}

.mission:nth-child(odd) {
  left: 0;
}

.mission:nth-child(even) {
  left: 50%;
}

.mission-node {
  position: absolute;
  top: 0.4em;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: $color-accent;
  box-shadow: 0 0 14px rgba(79, 195, 247, 0.9), 0 0 4px rgba(255, 255, 255, 0.8) inset;
}

.mission:nth-child(odd) .mission-node {
  right: -6px;
}

.mission:nth-child(even) .mission-node {
  left: -6px;
}

.mission-card {
  padding: 1.5em;
  background: rgba(16, 16, 30, 0.66);
  border: 1px solid $border-subtle;
  border-radius: 12px;
  transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
}

.mission-card:hover {
  transform: translateY(-3px);
  border-color: $border-accent;
  box-shadow: 0 0 20px rgba(79, 195, 247, 0.12);
}

.mission-period {
  margin: 0 0 0.4em;
  font-size: 0.8em;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $color-accent;
}

.mission-card h3 {
  color: $color-text-primary;
}

.mission-org {
  margin: 0.3em 0 0.6em;
  color: $color-text-secondary;
  font-weight: 600;
}

.mission-summary {
  margin: 0;
  color: $color-text-secondary;
}

@media (max-width: 750px) {
  .mission-path {
    left: 8px;
    transform: none;
  }

  .mission,
  .mission:nth-child(even) {
    width: 100%;
    left: 0;
    padding: 0 0 2em 2.2em;
  }

  .mission:nth-child(odd) .mission-node,
  .mission:nth-child(even) .mission-node {
    left: 2px;
    right: auto;
  }
}
```

- [ ] **Step 3: Add to `app/page.js`**

Add `import Experience from '@/components/experience/Experience';` and render `<Experience />` between `<Components />` and `<Footer />`.

- [ ] **Step 4: Verify**

`npm run build` → success. Dev expectations: glowing timeline, alternating cards, obvious TODO placeholders; stacks to a left-rail timeline on mobile.

- [ ] **Step 5: Commit**

```bash
git add components/experience app/page.js
git commit -m "feat: Experience mission-log timeline with TODO placeholders

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Contact section rebuild

**Files:**
- Modify: `components/footer/Footer.js` (full rewrite)
- Modify: `components/footer/footer.scss` (full-section layout)

- [ ] **Step 1: Rewrite `components/footer/Footer.js`**

Keeps the existing "Around the Web" copy and existing social links (copy the GitHub `<svg>` from the current file verbatim). Adds a stronger heading and reveal animations. `ButtonFooter` is replaced by a plain button (the component gets removed in Task 11 if then-unused).

```jsx
'use client'

import './footer.scss';
import moment from 'moment';
import useReveal from '@/lib/useReveal';

export default function Footer() {
  const ref = useReveal();

  const scrollTop = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  };

  return (
    <section className='footer' id='contact' ref={ref}>
      <div className='contact-main'>
        <h2 data-reveal>Get in Touch</h2>
        <p className='contact-sub' data-reveal>Around the Web</p>
        <div className='contact-links' data-reveal>
          <a rel='noopener' href='https://www.linkedin.com/in/blakestagner/' target='_blank' aria-label='Linkedin Link'>
            <img className='social-icon' src='/images/social/In-White.png' alt='linkedin' />
          </a>
          <a href='https://www.github.com/blakestagner' target='_blank' rel='noopener' aria-label='GitHub Link'>
            {/* GitHub SVG: copy the existing <svg viewBox='0 0 128 128' ...> block verbatim from the current Footer.js */}
          </a>
        </div>
        <button className='to-top' onClick={scrollTop} aria-label='scroll to top' data-reveal>
          <img src='/icons/components/arrow_upward.svg' alt='' />
        </button>
      </div>
      <div className='footer-2'>
        <p>Copyright© BlakeStagner.com {moment().year()}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `components/footer/footer.scss`**

Keep the existing variable header and the `.footer::before` glow-border rule; replace the layout rules so contact is a tall final section:

```scss
.footer {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 70vh;
  background: linear-gradient(180deg, rgba(16, 16, 30, 0) 0%, rgba(16, 16, 30, 0.7) 45%);
}

/* keep the existing .footer::before accent line rule */

.contact-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4em 1em;
}

.contact-main h2 {
  color: $color-text-primary;
  font-size: 3.5em;
}

.contact-sub {
  margin: 0.25em 0 1.5em;
  color: $color-text-secondary;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.85em;
}

.contact-links {
  display: flex;
  gap: 1.5em;
  align-items: center;
}

.to-top {
  margin-top: 2.5em;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid $border-accent;
  background: rgba(16, 16, 30, 0.6);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(79, 195, 247, 0.3);
}

.to-top img {
  width: 22px;
}

.footer-2 {
  padding: 1.25em;
  background-color: rgba(8, 8, 16, 0.6);
}

.footer-2 p {
  margin: 0;
  color: $color-text-secondary;
  font-size: 0.85em;
}
```

Keep the existing `.social-icon` rules (and `.social-icon svg` sizing) so the icons render at their current size. Ensure `$border-accent` is in the variable header. Delete the old `.footer-1` rules.

- [ ] **Step 3: Verify**

`npm run build` → success. Dev expectations: tall ending section, "Get in Touch" reveal, social icons work, horizon glow from SpaceBackground intensifies at the bottom.

- [ ] **Step 4: Commit**

```bash
git add components/footer
git commit -m "feat: Contact section rebuild as full ending beat

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Reduced-motion sweep, cleanup, final verification

**Files:**
- Modify: `app/globals.scss` (reduced-motion master block)
- Delete: `components/hero/BlackHole.js`, `components/hero/MobileGalaxy.js`
- Maybe delete: `components/ui/ButtonFooter.js` (if unused)
- Modify: `package.json` (uninstall react-device-detect)

- [ ] **Step 1: Add the reduced-motion master block to the END of `app/globals.scss`**

```scss
/* ============================================================
   Reduced motion: kill all CSS animation/transitions site-wide
   (JS animations are independently gated in lib/animation.js)
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Remove dead components and dependency**

```bash
grep -rn "MobileGalaxy\|BlackHole\|react-device-detect\|ButtonFooter" app components lib --include="*.js"
```

Expected: no matches outside the dead files themselves. Then:

```bash
rm components/hero/BlackHole.js components/hero/MobileGalaxy.js
npm uninstall react-device-detect
```

If `ButtonFooter` has no remaining imports: `rm components/ui/ButtonFooter.js`.
NOTE: `components/hero/Stars.js` STAYS — PurpleGalaxy/GreenGalaxy still use it for their inner galaxy star canvases.

- [ ] **Step 3: Dead style scan**

```bash
grep -rn "hero-initial\|starfield\|header-tab\|about-tab\|tab-transition\|blue-strip\|blue-animation\|scrollBar\|mobile-galaxy\|black-hole\|blackhole" components app --include="*.scss"
```

Delete any rule blocks this surfaces that previous tasks missed (e.g. `.black-hole`/`.mobile-galaxy` keyframes in `hero.scss`). Re-grep until clean (the `#blue-animation3` style names should be gone after Task 7).

- [ ] **Step 4: Full verification**

```bash
npm run lint
npm run build
```

Expected: both succeed with no new warnings. Then `npm run dev` and verify the manual checklist:

1. All 7 sections render in order: Hero, About, Skills, Projects, Demos, Experience, Contact.
2. Toolbar: all 6 links scroll to their sections; active link highlights; bar hides scrolling down, returns scrolling up; goes glassy after 40px.
3. Starfield: animates everywhere, streaks on fast scroll, nebula hue shifts down the page, horizon glow at the bottom.
4. Hero: rings orbit, mouse parallax (desktop), scene fades/scales out on scroll, CTAs scroll to Projects/Contact.
5. Reduced motion (DevTools → Rendering → emulate `prefers-reduced-motion`): static starfield frame, all content visible without animation, no scroll hijacking.
6. Mobile (375px viewport): no horizontal scroll, hero readable, timeline stacks left, constellation grid single-column.
7. All four demos (Calendar, Todo, Measurement, TicTacToe) still function.
8. `/admin` routes unaffected (`npm run build` output still lists them).

- [ ] **Step 5: Commit**

```bash
git add -A app components lib package.json package-lock.json
git commit -m "chore: reduced-motion support, dead code cleanup

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Plan self-review notes

- Spec coverage: persistent background (T3), scroll model (T1), hero (T4), About split (T5), Skills (T6), Projects (T7), Demos (T8), Experience+TODO (T9), Contact (T10), reduced motion (T1 CSS scroll-behavior + T2/T4 JS gates + T11 master block), cleanup (T7/T8/T11), perf constraints (transform/opacity only, DPR cap, visibility pause), responsiveness (per-task media queries).
- `Stars.js` is intentionally retained (galaxy components depend on it); only the hero's full-screen static canvas is removed.
- Heading text "Portfolio"→"Projects" and footer heading "Get in Touch" are presentational labels, not biography content.
