'use client'

import { useEffect, useRef } from 'react';
import './space3d.scss';
import { buildShip } from './ship';
import { buildEarth, loadEarthTextures } from './earth';
import { T, intro } from './introState';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

// Fixed full-viewport WebGL overlay: the 3D ship and Earth.
// Orthographic camera in pixel space: 1 world unit = 1 CSS px, origin center, Y up.
export default function Space3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    let disposed = false;
    let cleanup = null;

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
      camera.position.z = 600;

      scene.add(new THREE.AmbientLight(0x8892aa, 1.4));
      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(-260, 320, 420);
      scene.add(key);

      const ship = buildShip(THREE);
      ship.group.visible = !reduceMotion;
      scene.add(ship.group);

      let w = 0;
      let h = 0;
      let shipScale = 1;
      const small = () => Math.min(window.innerWidth, window.innerHeight) < 700;

      // CSS px -> world coords
      const wx = (x) => x - w / 2;
      const wy = (y) => h / 2 - y;

      // Earth: pinned bottom-right, approaching as you scroll — grows from 6%
      // to a 25% cap of the viewport's short side, easing into the corner
      let earth = null;
      let earthLoadStarted = false;
      const placeEarth = (pe) => {
        const r = ((0.06 + 0.19 * pe) * Math.min(w, h)) / 2;
        const push = r * 0.7 * (1 - pe);
        const cx = w - r - 18 + push;
        const cy = h - r - 18 + push;
        earth.group.position.set(wx(cx), wy(cy), 0);
        earth.group.scale.setScalar(r);
        return { cx, cy, r };
      };
      const kickEarthLoad = () => {
        if (earthLoadStarted) return;
        earthLoadStarted = true;
        const quality = small() ? 'low' : 'high';
        const go = () => {
          loadEarthTextures(THREE, quality)
            .then((tex) => {
              if (disposed) {
                Object.values(tex).forEach((tx) => tx.dispose());
                return;
              }
              earth = buildEarth(THREE, tex, quality);
              scene.add(earth.group);
              if (reduceMotion) renderStatic();
            })
            .catch(() => {}); // decorative: missing textures just means no Earth
        };
        if ('requestIdleCallback' in window) window.requestIdleCallback(go);
        else setTimeout(go, 250);
      };

      // reduced motion: no ship, Earth frozen at mid-approach, no rAF loop
      const renderStatic = () => {
        if (!earth) return;
        placeEarth(0.5);
        renderer.render(scene, camera);
      };

      const resize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small() ? 1.5 : 2));
        renderer.setSize(w, h);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
        // old SVG rendered at 40px (27px mobile) for a 44-unit-wide model
        shipScale = (small() ? 27 : 40) / 44;
        if (reduceMotion) renderStatic();
      };

      // --- motion state ported from ScrollRocket ---
      let curY = 0;
      let curX = 0;
      let prevX = 0;
      let curRot = 0;
      let curFlame = 0.4;
      let smoothVel = 0;
      let facing = 1; // 1 = travelling down (nose down), -1 = travelling up
      let curFlip = 0; // eased flip angle in degrees (0 or 180), pitch about X
      let lastScroll = window.scrollY;
      let rafId = null;
      let lastTime = 0;
      let sProg = 0; // smoothed scroll progress, shared by Earth and ship approach
      // 0 = intro escape flight (path from the bang), 1 = scroll companion
      let blend = intro.active ? 0 : 1;
      const SHIP_Z = 260; // keep the ship in front of Earth's sphere

      const tick = (now) => {
        const delta = Math.min(now - lastTime, 50) || 16;
        lastTime = now;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
        const vh = window.innerHeight;
        sProg += (progress - sProg) * 0.08;

        if (!intro.active) kickEarthLoad();

        let earthCx = 0;
        let earthCy = 0;
        let earthR = 0;
        if (earth) {
          const placed = placeEarth(easeOut(sProg));
          earthCx = placed.cx;
          earthCy = placed.cy;
          earthR = placed.r;
          earth.update(delta);
        }

        const targetY = vh * 0.14 + vh * 0.66 * progress;
        const targetX = Math.sin(progress * Math.PI * 4) * 26;

        const rawVel = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        smoothVel += (rawVel - smoothVel) * 0.12;

        prevX = curX;
        curY += (targetY - curY) * 0.12;
        curX += (targetX - curX) * 0.08;

        // flip to face travel direction (hysteresis avoids jitter near zero)
        if (smoothVel > 0.4) facing = 1;
        else if (smoothVel < -0.4) facing = -1;
        const targetFlip = facing === 1 ? 0 : 180;
        curFlip += (targetFlip - curFlip) * 0.12;

        // bank toward horizontal travel, nudged by scroll direction
        const targetRot = clamp((curX - prevX) * 3.2 + smoothVel * 0.25, -26, 26);
        curRot += (targetRot - curRot) * 0.1;

        const targetFlame = clamp(0.45 + Math.abs(smoothVel) * 0.05, 0.45, 2.4);
        curFlame += (targetFlame - curFlame) * 0.15;

        // anchor: old .scroll-rocket sat at right 4vw (5vw mobile), rocket center offset
        const anchorX = w - (small() ? 0.05 : 0.04) * w - 22 * shipScale;
        let px = anchorX + curX;
        let py = curY + 46 * shipScale;
        // CSS clockwise rotate -> negative Z in three.js; flip is a pitch about X;
        // slow Y sway makes the ship read as truly 3D
        let rotX = (curFlip * Math.PI) / 180;
        let rotY = Math.sin(now * 0.0009) * 0.3 + (curX - prevX) * 0.05;
        let rotZ = (-curRot * Math.PI) / 180;
        let scale = shipScale;
        let flame = curFlame;

        // intro escape: ship bursts out of the bang along an arc to its rest
        // pose, nose along velocity, then blends into the scroll companion
        if (blend < 1) {
          const arriveT = T.HS_END + 400;
          const introDone = !intro.active || intro.t >= arriveT;
          blend += ((introDone ? 1 : 0) - blend) * 0.06;
          if (blend > 0.995) blend = 1;

          const e = easeInOut(clamp((intro.t - T.HS_START) / (arriveT - T.HS_START), 0, 1));
          const rx = anchorX;
          const ry = vh * 0.14 + 46 * shipScale;
          const cxp = intro.cx + (rx - intro.cx) * 0.25;
          const cyp = Math.min(intro.cy, ry) - vh * 0.3;
          const u = 1 - e;
          const ix = u * u * intro.cx + 2 * u * e * cxp + e * e * rx;
          const iy = u * u * intro.cy + 2 * u * e * cyp + e * e * ry;
          const dx = 2 * u * (cxp - intro.cx) + 2 * e * (rx - cxp);
          const dy = 2 * u * (cyp - intro.cy) + 2 * e * (ry - cyp);
          const introRotZ = -Math.atan2(dx, dy); // nose along velocity (0 = nose down)
          const iScale = shipScale * (0.15 + 0.85 * e);

          px = ix + (px - ix) * blend;
          py = iy + (py - iy) * blend;
          rotZ = introRotZ * (1 - blend) + rotZ * blend;
          rotX *= blend; // no scroll-flip during the escape
          scale = iScale + (shipScale - iScale) * blend;
          flame = 2.4 * (1 - blend) + flame * blend;

          // hidden until the bang births the ship
          ship.group.visible = !(intro.active && intro.t < T.HS_START + 60);
        }

        // final approach: near the footer the ship breaks off its lane and
        // noses in toward Earth, hovering just off the rim
        if (earth && sProg > 0.85) {
          const a = easeInOut(clamp((sProg - 0.85) / 0.15, 0, 1)) * 0.9;
          const hoverX = earthCx - earthR * 1.35;
          const hoverY = earthCy - earthR * 1.05 - 40 * shipScale;
          px += (hoverX - px) * a;
          py += (hoverY - py) * a;
          const noseToEarth = -Math.atan2(earthCx - px, earthCy - py);
          rotZ += (noseToEarth - rotZ) * a;
          rotX *= 1 - a; // no scroll-flip while approaching
        }

        ship.group.position.set(wx(px), wy(py), SHIP_Z);
        ship.group.rotation.set(rotX, rotY, rotZ);
        ship.group.scale.setScalar(scale);
        ship.setFlame(flame, now);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      };

      const start = () => {
        if (rafId === null && !reduceMotion) rafId = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };
      const onVisibility = () => {
        if (document.hidden) stop();
        else start();
      };

      resize();
      if (reduceMotion) kickEarthLoad();
      else start();
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        stop();
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibility);
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              Object.values(m).forEach((v) => v && v.isTexture && v.dispose());
              m.dispose();
            });
          }
        });
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className='space3d' aria-hidden='true' />;
}
