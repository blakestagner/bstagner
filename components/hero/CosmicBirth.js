'use client'

import { useEffect, useRef } from 'react';

// Phase timing in ms from the animation clock start.
const T_FLASH = 280;       // singularity flash
const T_BANG = 1500;       // explosion sparks fully expanded + faded
const T_SUN_FORM = 850;    // central sun starts igniting
const T_PLANETS = 2100;    // planets begin condensing into orbits
const T_GALAXIES = 2700;   // distant spiral galaxies fade in
const T_INTRO_END = 5000;  // fully settled into the living state

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const SPARK_COLORS = [
  '255, 255, 255',
  '255, 214, 140',
  '255, 138, 60',
  '79, 195, 247',
  '124, 77, 255',
];

const PLANET_PALETTE = [
  { c1: '#9fb4d8', c2: '#586a8c' },
  { c1: '#6fd3ff', c2: '#2a6ec2' },
  { c1: '#ffb27a', c2: '#c2592a' },
  { c1: '#d8c69f', c2: '#8c7a4a', ring: true },
  { c1: '#b89fff', c2: '#6a4ac2' },
];

export default function CosmicBirth() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let unit = 1;
    let rafId = null;
    let lastTime = 0;
    let t = 0; // pausable animation clock (ms)

    let sparks = [];
    let planets = [];
    let galaxies = [];
    let dust = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    const build = () => {
      const wide = width > 900;
      cx = wide ? width * 0.66 : width * 0.5;
      cy = wide ? height * 0.52 : height * 0.4;
      unit = Math.min(Math.max(Math.min(width, height) / 900, 0.5), 1.4);

      const sparkCount = width < 700 ? 140 : 250;
      sparks = [];
      for (let i = 0; i < sparkCount; i++) {
        const speed = Math.pow(Math.random(), 0.5);
        sparks.push({
          angle: rand(0, Math.PI * 2),
          maxDist: rand(140, 560) * unit * (0.4 + speed),
          size: rand(0.6, 2.4) * unit,
          color: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
          delay: rand(0, 120),
        });
      }

      const planetCount = width < 700 ? 3 : 5;
      planets = [];
      for (let i = 0; i < planetCount; i++) {
        planets.push({
          orbit: (96 + i * 60 + rand(-6, 6)) * unit,
          radius: rand(3.6, 7.4) * unit * (1 - i * 0.04),
          speed: (0.22 - i * 0.025) * rand(0.9, 1.1),
          phase: rand(0, Math.PI * 2),
          tilt: rand(0.3, 0.44),
          formDelay: i * 170,
          ...PLANET_PALETTE[i % PLANET_PALETTE.length],
        });
      }

      const galaxyDefs = [
        { gx: width * 0.17, gy: height * 0.26, r: 95 * unit, arms: 2, tint: '124, 77, 255' },
        { gx: width * 0.84, gy: height * 0.74, r: 72 * unit, arms: 2, tint: '79, 195, 247' },
        { gx: width * 0.32, gy: height * 0.84, r: 56 * unit, arms: 3, tint: '120, 160, 255' },
      ];
      galaxies = galaxyDefs.map((g) => {
        const pts = [];
        const N = 150;
        for (let i = 0; i < N; i++) {
          const arm = i % g.arms;
          const f = i / N;
          pts.push({
            a: f * Math.PI * 3 + (arm * Math.PI * 2) / g.arms,
            rr: f * g.r + rand(-4, 4) * unit,
            size: rand(0.4, 1.4) * unit,
          });
        }
        return { ...g, pts, rot: rand(0, Math.PI * 2), spin: rand(0.02, 0.05) };
      });

      const dustCount = width < 700 ? 22 : 44;
      dust = [];
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-3, 3),
          vy: rand(-2, 2),
          r: rand(22, 72) * unit,
          alpha: rand(0.012, 0.03),
        });
      }
    };

    const drawDust = () => {
      ctx.globalCompositeOperation = 'lighter';
      for (const d of dust) {
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        g.addColorStop(0, `rgba(124, 77, 255, ${d.alpha})`);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawGalaxies = (sec) => {
      const a = clamp01((t - T_GALAXIES) / 1300) * 0.55;
      if (a <= 0) return;
      ctx.globalCompositeOperation = 'lighter';
      for (const g of galaxies) {
        const rot = g.rot + g.spin * sec;
        const core = ctx.createRadialGradient(g.gx, g.gy, 0, g.gx, g.gy, g.r * 0.6);
        core.addColorStop(0, `rgba(${g.tint}, ${0.18 * a})`);
        core.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(g.gx, g.gy, g.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        for (const p of g.pts) {
          const ang = p.a + rot;
          const x = g.gx + Math.cos(ang) * p.rr;
          const y = g.gy + Math.sin(ang) * p.rr * 0.5;
          ctx.fillStyle = `rgba(${g.tint}, ${a})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawSparks = () => {
      if (t > T_BANG) return;
      ctx.globalCompositeOperation = 'lighter';
      for (const s of sparks) {
        const p = clamp01((t - s.delay) / (T_BANG - s.delay));
        if (p <= 0) continue;
        const d = easeOut(p) * s.maxDist;
        const x = cx + Math.cos(s.angle) * d;
        const y = cy + Math.sin(s.angle) * d;
        const alpha = (1 - p) * 0.9;
        const tail = 8 * unit * (1 - p);
        ctx.strokeStyle = `rgba(${s.color}, ${alpha})`;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - Math.cos(s.angle) * tail, y - Math.sin(s.angle) * tail);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawShockwave = () => {
      if (t > T_BANG) return;
      const p = clamp01(t / T_BANG);
      ctx.globalCompositeOperation = 'lighter';
      const r = easeOut(p) * Math.max(width, height) * 0.6;
      ctx.strokeStyle = `rgba(120, 170, 255, ${(1 - p) * 0.5})`;
      ctx.lineWidth = 2 * unit * (1 - p) + 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawFlash = () => {
      if (t > T_FLASH * 2) return;
      const p = clamp01(t / (T_FLASH * 2));
      const r = (1 - p) * Math.max(width, height) * 0.5 + 40 * unit;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(255, 255, 255, ${(1 - p) * 0.9})`);
      g.addColorStop(0.4, `rgba(180, 210, 255, ${(1 - p) * 0.4})`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawSun = (sec) => {
      const grow = easeOut(clamp01((t - T_SUN_FORM) / 950));
      const base = 32 * unit * (0.14 + 0.86 * grow);
      const pulse = 1 + 0.045 * Math.sin(sec * 1.6);
      const r = base * pulse;

      // outer bloom
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4.2);
      bloom.addColorStop(0, 'rgba(255, 210, 130, 0.5)');
      bloom.addColorStop(0.3, 'rgba(255, 140, 70, 0.22)');
      bloom.addColorStop(0.65, 'rgba(79, 130, 220, 0.12)');
      bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 4.2, 0, Math.PI * 2);
      ctx.fill();

      // transient proto-suns merging in ("suns forming")
      const merge = clamp01((t - T_SUN_FORM) / (T_PLANETS - T_SUN_FORM));
      if (merge > 0 && merge < 1) {
        const fade = Math.sin(merge * Math.PI) * 0.8;
        for (const o of [[-1, -0.5], [1.1, 0.4]]) {
          const px = cx + o[0] * r * (2.2 * (1 - merge));
          const py = cy + o[1] * r * (2.2 * (1 - merge));
          const pg = ctx.createRadialGradient(px, py, 0, px, py, r * 0.9);
          pg.addColorStop(0, `rgba(255, 235, 190, ${fade})`);
          pg.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(px, py, r * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      core.addColorStop(0, 'rgba(255, 255, 250, 1)');
      core.addColorStop(0.5, 'rgba(255, 224, 168, 0.98)');
      core.addColorStop(1, 'rgba(255, 150, 80, 0.85)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const planetPos = (pl, sec) => {
      const ang = pl.phase + pl.speed * sec;
      return {
        ang,
        x: cx + Math.cos(ang) * pl.orbit,
        y: cy + Math.sin(ang) * pl.orbit * pl.tilt,
        depth: Math.sin(ang),
      };
    };

    const drawOrbit = (pl, form) => {
      ctx.strokeStyle = `rgba(160, 190, 255, ${0.1 * form})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, pl.orbit, pl.orbit * pl.tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawPlanet = (pl, pos, form) => {
      const r = pl.radius * easeOut(form);
      if (r < 0.3) return;
      if (pl.ring) {
        ctx.strokeStyle = 'rgba(216, 198, 159, 0.55)';
        ctx.lineWidth = 1.4 * unit;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, r * 2.1, r * 0.7, 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      const g = ctx.createRadialGradient(
        pos.x - r * 0.3, pos.y - r * 0.3, r * 0.1,
        pos.x, pos.y, r
      );
      g.addColorStop(0, pl.c1);
      g.addColorStop(1, pl.c2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      const sec = t / 1000;
      ctx.clearRect(0, 0, width, height);
      drawDust();
      drawGalaxies(sec);

      const states = planets.map((pl) => {
        const form = clamp01((t - T_PLANETS - pl.formDelay) / 650);
        return { pl, pos: planetPos(pl, sec), form };
      });
      for (const s of states) {
        if (s.form > 0) drawOrbit(s.pl, s.form);
      }
      for (const s of states) {
        if (s.form > 0 && s.pos.depth < 0) drawPlanet(s.pl, s.pos, s.form);
      }

      drawSun(sec);

      for (const s of states) {
        if (s.form > 0 && s.pos.depth >= 0) drawPlanet(s.pl, s.pos, s.form);
      }

      drawShockwave();
      drawSparks();
      drawFlash();
    };

    const loop = (now) => {
      const delta = Math.min(now - lastTime, 50) || 16;
      lastTime = now;
      t += delta;
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafId === null && !reduceMotion) {
        lastTime = performance.now();
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
      const host = canvas.parentElement;
      width = host ? host.clientWidth : window.innerWidth;
      height = host ? host.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion) {
        t = T_INTRO_END;
        draw();
      }
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

  return <canvas ref={canvasRef} className='cosmic-birth' aria-hidden='true' />;
}
