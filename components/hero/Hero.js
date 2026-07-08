'use client'

import { useEffect, useRef, useState } from 'react';
import './hero.scss';
import CosmicBirth from './CosmicBirth';
import HeroText from './HeroText';
import { getGsap, prefersReducedMotion } from '@/lib/animation';
import { intro } from '@/components/space3d/introState';

export default function Hero() {
  const heroRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    setLoading(false);
    if (prefersReducedMotion()) return;
    setShowSkip(true);
    // hide when the intro actually ends — covers full, replay, and skip paths
    const id = setInterval(() => {
      if (!intro.active) {
        setShowSkip(false);
        clearInterval(id);
      }
    }, 250);
    return () => clearInterval(id);
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
        { selector: '.cosmic-birth', depth: 16 },
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
        <CosmicBirth />
      </div>
      <HeroText loading={loading} />
      {showSkip && (
        <button
          className='intro-skip'
          aria-label='Skip intro'
          onClick={() => {
            intro.skipRequested = true;
            setShowSkip(false);
          }}
        >
          Skip intro
        </button>
      )}
    </section>
  );
}
