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
