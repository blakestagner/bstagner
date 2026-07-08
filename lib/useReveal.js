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
