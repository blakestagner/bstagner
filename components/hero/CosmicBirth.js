'use client'

import { useEffect, useRef } from 'react';

// Phase timing in ms from the animation clock start.
const T_FLASH = 240;        // singularity flash
const HS_START = 120;       // reverse-hyperspace travel begins
const HS_END = 2350;        // streaks resolve into stars, we "arrive"
const T_SUN_BORN = 2050;    // protostar core appears and starts igniting
const T_SUN_IGNITE = 2750;  // sun finishes flaring into a star
const T_DISK = 2650;        // protoplanetary dust disk forms around the sun
const T_PLANETS = 3450;     // planets condense out of the disk
const T_DISK_FADE = 1300;   // ms over which the disk is swept up after T_PLANETS
const T_GALAXIES = 3000;    // distant spiral galaxies fade in
const T_CAMERA = 2600;      // camera finishes pulling back to rest
const T_INTRO_END = 5800;   // fully settled into the living state

// Perspective-warp depth range and top speed (z-units / second).
const Z_FAR = 5;
const Z_NEAR = 0.16;
const WARP_MAX = 5.4;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
    let maxR = 1;
    let orbitTilt = 0.38;
    let rafId = null;
    let lastTime = 0;
    let t = 0; // pausable animation clock (ms)

    let warp = [];
    let spread = 1;
    let disk = [];
    let planets = [];
    let galaxies = [];
    let dust = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    const build = () => {
      const wide = width > 900;
      cx = wide ? width * 0.66 : width * 0.5;
      cy = wide ? height * 0.52 : height * 0.4;
      unit = Math.min(Math.max(Math.min(width, height) / 900, 0.5), 1.4);
      maxR = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));
      orbitTilt = 0.38;

      // perspective-warp star field: depth-based stars that stream past the camera
      spread = maxR;
      const warpCount = width < 700 ? 170 : 320;
      warp = [];
      for (let i = 0; i < warpCount; i++) {
        const x = rand(-1, 1);
        const y = rand(-1, 1);
        const z = rand(Z_NEAR, Z_FAR);
        const sx = cx + (x * spread) / z;
        const sy = cy + (y * spread) / z;
        warp.push({ x, y, z, sx, sy, px: sx, py: sy, sizeBase: rand(0, 1.2), hue: Math.random() });
      }

      // protoplanetary dust disk (Keplerian-ish: inner orbits faster)
      const innerR = 52 * unit;
      const outerR = (96 + (width < 700 ? 2 : 4) * 60) * unit;
      const diskCount = width < 700 ? 110 : 200;
      disk = [];
      for (let i = 0; i < diskCount; i++) {
        const r = innerR + Math.pow(Math.random(), 0.7) * (outerR - innerR);
        disk.push({
          r,
          ang: rand(0, Math.PI * 2),
          speed: 0.55 * Math.sqrt((70 * unit) / r) * rand(0.9, 1.1),
          size: rand(0.5, 1.6) * unit,
          warm: Math.random() < 0.55,
          alpha: rand(0.35, 0.9),
        });
      }

      // planets condense from the disk
      const planetCount = width < 700 ? 3 : 5;
      planets = [];
      for (let i = 0; i < planetCount; i++) {
        planets.push({
          orbit: (96 + i * 60 + rand(-6, 6)) * unit,
          radius: rand(3.6, 7.4) * unit * (1 - i * 0.04),
          speed: (0.22 - i * 0.025) * rand(0.9, 1.1),
          phase: rand(0, Math.PI * 2),
          formDelay: i * 180,
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

    // Warp speed envelope: launch hard out of the bang, hold, then coast to a
    // stop as we arrive at the solar system.
    const warpSpeed = () => {
      const up = clamp01((t - HS_START) / 280);
      const down = 1 - clamp01((t - (HS_END - 700)) / 700);
      return WARP_MAX * up * (down > 0 ? down : 0);
    };

    const respawn = (s) => {
      s.x = rand(-1, 1);
      s.y = rand(-1, 1);
      s.z = rand(Z_FAR * 0.7, Z_FAR);
      s.sx = cx + (s.x * spread) / s.z;
      s.sy = cy + (s.y * spread) / s.z;
      s.px = s.sx;
      s.py = s.sy;
    };

    // Advance each star toward the camera; recycle when it streams off-screen.
    const updateWarp = (dtMs) => {
      const sp = warpSpeed();
      if (sp <= 0) return;
      const dz = sp * (dtMs / 1000);
      for (const s of warp) {
        s.px = s.sx;
        s.py = s.sy;
        s.z -= dz;
        if (s.z <= Z_NEAR) {
          respawn(s);
          continue;
        }
        s.sx = cx + (s.x * spread) / s.z;
        s.sy = cy + (s.y * spread) / s.z;
        if (Math.abs(s.sx - cx) > maxR * 1.7 || Math.abs(s.sy - cy) > maxR * 1.7) {
          respawn(s);
        }
      }
    };

    // Reverse warp: stars stream past the camera, streaking as they near us.
    const drawWarp = () => {
      const vis = clamp01((t - HS_START) / 180) * (1 - clamp01((t - HS_END) / 450));
      if (vis <= 0) return;
      ctx.globalCompositeOperation = 'lighter';

      // bright destination core we are travelling toward
      const arrive = clamp01((t - HS_START) / (HS_END - HS_START));
      const coreR = (14 + 46 * arrive) * unit;
      const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreG.addColorStop(0, `rgba(255, 255, 255, ${0.85 * vis})`);
      coreG.addColorStop(0.5, `rgba(180, 215, 255, ${0.4 * vis})`);
      coreG.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreG;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      for (const s of warp) {
        const close = clamp01((Z_FAR - s.z) / Z_FAR);
        const size = (0.5 + close * 2.4) * unit * (0.6 + s.sizeBase);
        const alpha = vis * (0.22 + 0.78 * close);
        const hue = s.hue < 0.5 ? '240, 248, 255' : '170, 205, 255';
        const dx = s.sx - s.px;
        const dy = s.sy - s.py;

        if (dx * dx + dy * dy > 4) {
          ctx.strokeStyle = `rgba(${hue}, ${alpha})`;
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(s.sx, s.sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${hue}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.sx, s.sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawFlash = () => {
      if (t > T_FLASH * 2) return;
      const p = clamp01(t / (T_FLASH * 2));
      const r = (1 - p) * Math.max(width, height) * 0.55 + 40 * unit;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(255, 255, 255, ${(1 - p) * 0.95})`);
      g.addColorStop(0.4, `rgba(190, 215, 255, ${(1 - p) * 0.45})`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawDisk = (sec) => {
      const appear = clamp01((t - T_DISK) / 700);
      const fade = 1 - clamp01((t - T_PLANETS) / T_DISK_FADE);
      const a = appear * fade;
      if (a <= 0) return;
      ctx.globalCompositeOperation = 'lighter';
      for (const d of disk) {
        const ang = d.ang + d.speed * sec;
        const x = cx + Math.cos(ang) * d.r;
        const y = cy + Math.sin(ang) * d.r * orbitTilt;
        const tint = d.warm ? '255, 184, 120' : '150, 175, 255';
        ctx.fillStyle = `rgba(${tint}, ${a * d.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawSun = (sec) => {
      const grow = easeOut(clamp01((t - T_SUN_BORN) / 1100));
      if (grow <= 0) return;
      const igniting = clamp01((t - T_SUN_BORN) / (T_SUN_IGNITE - T_SUN_BORN));
      const flicker = igniting < 1 ? 0.82 + 0.18 * Math.sin(sec * 38) : 1;
      const base = 32 * unit * (0.12 + 0.88 * grow);
      const pulse = 1 + 0.045 * Math.sin(sec * 1.6);
      const r = base * pulse * flicker;

      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4.4);
      bloom.addColorStop(0, `rgba(255, 210, 130, ${0.5 * (0.5 + 0.5 * igniting)})`);
      bloom.addColorStop(0.3, `rgba(255, 140, 70, ${0.22 * (0.4 + 0.6 * igniting)})`);
      bloom.addColorStop(0.65, 'rgba(79, 130, 220, 0.12)');
      bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 4.4, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      core.addColorStop(0, 'rgba(255, 255, 250, 1)');
      core.addColorStop(0.5, `rgba(255, 224, 168, ${0.9 + 0.1 * igniting})`);
      core.addColorStop(1, `rgba(255, 150, 80, ${0.7 + 0.15 * igniting})`);
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
        y: cy + Math.sin(ang) * pl.orbit * orbitTilt,
        depth: Math.sin(ang),
      };
    };

    const drawOrbit = (pl, form) => {
      ctx.strokeStyle = `rgba(160, 190, 255, ${0.1 * form})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, pl.orbit, pl.orbit * orbitTilt, 0, 0, Math.PI * 2);
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

    // Camera starts zoomed hard into the singularity and pulls back as we arrive.
    const cameraScale = () => {
      const p = clamp01(t / T_CAMERA);
      return 1 + 2.6 * (1 - easeInOut(p));
    };

    const draw = () => {
      const sec = t / 1000;
      ctx.clearRect(0, 0, width, height);

      const cam = cameraScale();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(cam, cam);
      ctx.translate(-cx, -cy);

      drawDust();
      drawGalaxies(sec);
      drawDisk(sec);

      const states = planets.map((pl) => {
        const form = clamp01((t - T_PLANETS - pl.formDelay) / 700);
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

      ctx.restore();

      // travel warp + flash render in screen space, undistorted by the camera
      drawWarp();
      drawFlash();
    };

    const loop = (now) => {
      const delta = Math.min(now - lastTime, 50) || 16;
      lastTime = now;
      t += delta;
      updateWarp(delta);
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
