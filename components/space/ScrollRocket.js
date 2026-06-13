'use client'

import { useEffect, useRef } from 'react';
import './scroll-rocket.scss';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export default function ScrollRocket() {
  const rocketRef = useRef(null);
  const flameRef = useRef(null);

  useEffect(() => {
    const el = rocketRef.current;
    const flame = flameRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = null;
    let curY = 0;
    let curX = 0;
    let prevX = 0;
    let curRot = 0;
    let curFlame = 0.4;
    let smoothVel = 0;
    let lastScroll = window.scrollY;

    const tick = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      const vh = window.innerHeight;

      const targetY = vh * 0.14 + vh * 0.66 * progress;
      const targetX = Math.sin(progress * Math.PI * 4) * 26;

      const rawVel = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      smoothVel += (rawVel - smoothVel) * 0.12;

      prevX = curX;
      curY += (targetY - curY) * 0.12;
      curX += (targetX - curX) * 0.08;

      // bank toward horizontal travel, nudged by scroll direction
      const targetRot = clamp((curX - prevX) * 3.2 + smoothVel * 0.25, -26, 26);
      curRot += (targetRot - curRot) * 0.1;

      const targetFlame = clamp(0.45 + Math.abs(smoothVel) * 0.05, 0.45, 2.4);
      curFlame += (targetFlame - curFlame) * 0.15;

      el.style.transform = `translate3d(${curX}px, ${curY}px, 0) rotate(${curRot}deg)`;
      if (flame) flame.style.transform = `scaleY(${curFlame})`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className='scroll-rocket' ref={rocketRef} aria-hidden='true'>
      <span className='rocket-flame' ref={flameRef}>
        <span className='rocket-flame-inner'></span>
      </span>
      <svg className='rocket-body' viewBox='0 0 44 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <linearGradient id='rocketBody' x1='0' y1='0' x2='44' y2='0'>
            <stop offset='0' stopColor='#cfd9ee' />
            <stop offset='0.5' stopColor='#ffffff' />
            <stop offset='1' stopColor='#9fb0d0' />
          </linearGradient>
        </defs>
        {/* fins (toward the tail, up top) */}
        <path d='M13 22 L4 14 L6 38 L13 34 Z' fill='#4fc3f7' opacity='0.85' />
        <path d='M31 22 L40 14 L38 38 L31 34 Z' fill='#7c4dff' opacity='0.85' />
        {/* body, nose pointing down */}
        <path
          d='M22 78 C16 70 13 62 13 48 L13 30 C13 20 16 12 22 6 C28 12 31 20 31 30 L31 48 C31 62 28 70 22 78 Z'
          fill='url(#rocketBody)'
          stroke='rgba(79,195,247,0.5)'
          strokeWidth='1'
        />
        {/* window */}
        <circle cx='22' cy='30' r='6' fill='#10101e' stroke='#4fc3f7' strokeWidth='2' />
        <circle cx='22' cy='30' r='2.4' fill='#4fc3f7' opacity='0.9' />
      </svg>
    </div>
  );
}
