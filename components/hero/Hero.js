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
