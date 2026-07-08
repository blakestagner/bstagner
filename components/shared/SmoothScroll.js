'use client'

import { useEffect } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/lib/animation';

// Inertial scrolling: wheel/touch input becomes a target the page glides
// toward, so jumpy scroll deltas read as one smooth motion. Lenis drives the
// real window scroll, so everything polling window.scrollY (Space3D,
// SpaceBackground, ScrollTrigger) inherits the smoothness for free.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
