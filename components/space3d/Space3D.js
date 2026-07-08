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
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 6000);
      camera.position.z = 2500;

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

      // Earth: born as the blue planet in the hero solar system, it flies to
      // the bottom-right corner over the first quarter of scroll and keeps
      // growing the whole way down; at the corner only its top-left quadrant
      // shows (center pinned at the viewport corner, the rest offscreen)
      let earth = null;
      let earthLoadStarted = false;
      const placeEarth = (pe) => {
        const anchored = intro.earthR > 0.5;
        const sx = anchored ? intro.earthX : w;
        const sy = anchored ? intro.earthY : h;
        // easeOut: Earth starts pulling away the instant scrolling begins
        const flyOut = easeOut(clamp(pe / 0.35, 0, 1));
        const cx = sx + (w - sx) * flyOut;
        const cy = sy + (h - sy) * flyOut;
        const rStart = anchored ? intro.earthR : 24;
        // grows to half the short side of the viewport (capped under SHIP_Z)
        const rEnd = Math.min(Math.min(w, h) * 0.5, 1900);
        const r = rStart + (rEnd - rStart) * Math.pow(pe, 1.35);
        // while still riding its orbit, defer to the canvas scene when the
        // planet passes behind the sun
        earth.group.visible = !(anchored && flyOut < 0.05 && intro.earthDepth < 0);
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
              intro.earthClaimed = true; // canvas stand-in retires
              if (reduceMotion) renderStatic();
            })
            .catch(() => {}); // decorative: missing textures just means no Earth
        };
        // timeout: a starved idle queue (low-power GPUs) would otherwise never fire
        if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 2000 });
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
      let nameEl = null; // the "Blake Stagner" h1 the ship orbits while at the top
      let expCards = null; // mission cards: the ship keeps to the empty side
      let lastOrbitRot = 0;
      let oCx = null; // smoothed orbit center/size — raw rects jitter while the
      let oCy = 0; //   heading animates in and fonts swap
      let oA = 0;
      let smX = null; // speed-limited ship position: long hops become real flights
      let smY = 0;
      let prevRenderX = null; // last rendered pos, for velocity-based nose steering
      let prevRenderY = 0;
      let lastZTop = false; // canvas hoisted above the text on the orbit's near side
      let sProg = 0; // smoothed scroll progress, shared by Earth and ship approach
      // 0 = intro escape flight (path from the bang), 1 = scroll companion
      let blend = intro.active ? 0 : 1;
      const SHIP_Z = 2000; // keep the ship in front of Earth's sphere at max size

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
          const placed = placeEarth(sProg);
          earthCx = placed.cx;
          earthCy = placed.cy;
          earthR = placed.r;
          earth.update(delta);
        }

        const targetY = vh * 0.14 + vh * 0.66 * progress;
        let targetX = Math.sin(progress * Math.PI * 4) * 26;

        // experience section: cards alternate sides of the timeline — the ship
        // flies in the empty half opposite whichever card is nearest center,
        // hopping sides as each one scrolls through
        if (!expCards || !expCards.length) {
          expCards = document.querySelectorAll('#experience .mission-card');
        }
        let bestRect = null;
        let bestDist = Infinity;
        for (const c of expCards) {
          const r = c.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) continue;
          const d = Math.abs(r.top + r.height / 2 - vh / 2);
          if (d < bestDist) {
            bestDist = d;
            bestRect = r;
          }
        }
        if (bestRect) {
          const cardOnRight = bestRect.left + bestRect.width / 2 > w / 2;
          const sideX = cardOnRight ? w * 0.25 : w * 0.75;
          const k = clamp(1 - bestDist / (vh * 0.6), 0, 1);
          targetX += (sideX - (w * 0.96 - 22 * shipScale)) * k;
        }

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

        // while near the top, the ship orbits the hero name on a 45deg-tilted
        // ellipse; scrolling melts it back into the scroll-companion lane
        if (!nameEl) nameEl = document.querySelector('.blake-stagner h1');
        const orbitMix = 1 - easeInOut(clamp(sProg / 0.07, 0, 1));
        let orbitZTop = false;
        if (orbitMix > 0.001) {
          // orbit the name's spot even before the text has faded in
          const rect = nameEl ? nameEl.getBoundingClientRect() : null;
          const hasRect = rect && rect.width > 10;
          const mCx = hasRect ? rect.left + rect.width / 2 : w * 0.34;
          const mCy = hasRect ? rect.top + rect.height / 2 : h * 0.44;
          const mA = Math.max((hasRect ? rect.width : w * 0.27) * 0.68, 160);
          if (oCx === null) {
            oCx = mCx;
            oCy = mCy;
            oA = mA;
          } else {
            oCx += (mCx - oCx) * 0.05;
            oCy += (mCy - oCy) * 0.05;
            oA += (mA - oA) * 0.05;
          }
          const ocx = oCx;
          const ocy = oCy;
          const a = oA;
          const b = a * 0.35; // foreshortened minor axis reads as an inclined plane
          const phi = -now * 0.0007; // reversed: matches the arrival direction from the bang
          const depth = Math.sin(phi); // >0 = near side of the tilted orbit plane
          const C = Math.SQRT1_2; // rotate the ellipse 45deg
          const ex = Math.cos(phi) * a;
          const ey = depth * b;
          const ox = ocx + (ex - ey) * C;
          const oy = ocy + (ex + ey) * C;
          // phi runs backwards, so velocity is the NEGATIVE d/dphi of the path
          const tx = (Math.sin(phi) * a + Math.cos(phi) * b) * C;
          const ty = (Math.sin(phi) * a - Math.cos(phi) * b) * C;
          // nose along the orbit tangent (css angle atan2(-dx,dy); three z = -css)
          let orotZ = Math.atan2(tx, ty);
          // unwrap so the angle never jumps 2π mid-orbit
          while (orotZ - lastOrbitRot > Math.PI) orotZ -= 2 * Math.PI;
          while (orotZ - lastOrbitRot < -Math.PI) orotZ += 2 * Math.PI;
          if (Math.abs(orotZ) > 2 * Math.PI) orotZ -= Math.sign(orotZ) * 2 * Math.PI;
          lastOrbitRot = orotZ;

          px = ox + (px - ox) * (1 - orbitMix);
          py = oy + (py - oy) * (1 - orbitMix);
          rotZ = orotZ * orbitMix + rotZ * (1 - orbitMix);
          rotX *= 1 - orbitMix;
          // bank into the turn and swell/shrink with orbit depth — reads as
          // actually flying the ring, not sliding along it
          rotY = rotY * (1 - orbitMix) + 0.45 * depth * orbitMix;
          scale *= 1 + 0.22 * depth * orbitMix;
          flame = 0.9 * orbitMix + flame * (1 - orbitMix);
          // near side passes OVER the name, far side passes UNDER it
          orbitZTop = blend === 1 && orbitMix > 0.5 && depth > 0;
        }
        if (orbitZTop !== lastZTop) {
          canvas.style.zIndex = orbitZTop ? '5' : '0';
          lastZTop = orbitZTop;
        }

        // intro escape: ship bursts out of the bang along an arc, nose along
        // velocity, then blends into wherever it should be (orbit or lane)
        if (blend < 1) {
          const arriveT = T.HS_END + 400;
          const introDone = !intro.active || intro.t >= arriveT;
          blend += ((introDone ? 1 : 0) - blend) * 0.1;
          if (blend > 0.995) blend = 1;

          const e = easeInOut(clamp((intro.t - T.HS_START) / (arriveT - T.HS_START), 0, 1));
          const rx = px;
          const ry = py;
          const cxp = intro.cx + (rx - intro.cx) * 0.25;
          const cyp = Math.min(intro.cy, ry) - vh * 0.3;
          const u = 1 - e;
          const ix = u * u * intro.cx + 2 * u * e * cxp + e * e * rx;
          const iy = u * u * intro.cy + 2 * u * e * cyp + e * e * ry;
          const dx = 2 * u * (cxp - intro.cx) + 2 * e * (rx - cxp);
          const dy = 2 * u * (cyp - intro.cy) + 2 * e * (ry - cyp);
          const introRotZ = Math.atan2(dx, dy); // nose along velocity (0 = nose down)
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
          // hover just off the visible rim along the corner diagonal
          const hoverX = earthCx - earthR * 0.82;
          const hoverY = earthCy - earthR * 0.82;
          px += (hoverX - px) * a;
          py += (hoverY - py) * a;
          const noseToEarth = Math.atan2(earthCx - px, earthCy - py);
          rotZ += (noseToEarth - rotZ) * a;
          rotX *= 1 - a; // no scroll-flip while approaching
        }

        // speed-limit the final pose: any large target change (orbit -> lane,
        // lane -> Earth approach) becomes a nose-first flight, not a teleport
        if (blend === 1) {
          if (smX === null) {
            smX = px;
            smY = py;
          }
          const mx = px - smX;
          const my = py - smY;
          const d = Math.hypot(mx, my);
          const maxStep = Math.max(10, delta * 1.1); // ~1100 px/s cruise
          if (d > maxStep) {
            smX += (mx / d) * maxStep;
            smY += (my / d) * maxStep;
            let glideRot = Math.atan2(mx, my); // nose along the transit
            while (glideRot - rotZ > Math.PI) glideRot -= 2 * Math.PI;
            while (glideRot - rotZ < -Math.PI) glideRot += 2 * Math.PI;
            const gm = clamp((d - maxStep) / 160, 0, 1) * 0.85;
            rotZ = glideRot * gm + rotZ * (1 - gm);
            flame = Math.max(flame, 0.9 + 1.3 * gm);
          } else {
            smX = px;
            smY = py;
          }
          px = smX;
          py = smY;
        }

        // nose follows the real direction of travel: the faster and more
        // sideways the motion, the more the ship points where it's going
        // (vertical travel stays with the pitch-flip system)
        if (blend === 1) {
          if (prevRenderX === null) {
            prevRenderX = px;
            prevRenderY = py;
          }
          const vx = px - prevRenderX;
          const vy = py - prevRenderY;
          const spd = Math.hypot(vx, vy);
          if (spd > 0.8) {
            const flipped = curFlip > 90; // nose-up pitch reverses the Z sense
            let velRot = flipped ? Math.atan2(vx, -vy) : Math.atan2(vx, vy);
            while (velRot - rotZ > Math.PI) velRot -= 2 * Math.PI;
            while (velRot - rotZ < -Math.PI) velRot += 2 * Math.PI;
            const wDir =
              clamp((spd - 0.8) / 5, 0, 1) * (Math.abs(vx) / (spd + 1e-4)) * (1 - orbitMix);
            rotZ = velRot * wDir + rotZ * (1 - wDir);
          }
          prevRenderX = px;
          prevRenderY = py;
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
