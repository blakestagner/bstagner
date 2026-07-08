// Procedural 3D version of the ScrollRocket SVG (viewBox 44x80, nose down).
// Built in SVG pixel units, local Y up: nose at y=-36, tail at y=+36.

export function buildShip(THREE) {
  const group = new THREE.Group();

  // Body: lathe of the SVG body path's half-profile (r, localY), nose -> tail.
  const profile = [
    [0.01, -36], [4.5, -31], [7.5, -25], [9, -18], [9, 12],
    [7.5, 20], [5, 28], [2.5, 33], [0.01, 36],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xdfe6f5,
    roughness: 0.32,
    metalness: 0.5,
    emissive: 0x4fc3f7,
    emissiveIntensity: 0.07,
  });
  group.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 40), bodyMat));

  // Fins: the SVG fin quad, extruded thin, three around the tail.
  const finShape = new THREE.Shape();
  finShape.moveTo(8, 20);
  finShape.lineTo(18, 28);
  finShape.lineTo(16, 4);
  finShape.lineTo(8, 8);
  finShape.closePath();
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 1.4, bevelEnabled: false });
  finGeo.translate(0, 0, -0.7);
  const finColors = [0x4fc3f7, 0x7c4dff, 0x6a7cff];
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(
      finGeo,
      new THREE.MeshStandardMaterial({
        color: finColors[i],
        roughness: 0.4,
        metalness: 0.3,
        emissive: finColors[i],
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
      })
    );
    fin.rotation.y = (i * Math.PI * 2) / 3;
    group.add(fin);
  }

  // Portholes on both sides (ship somersaults about X, so both faces show).
  const windowY = 12;
  const rimGeo = new THREE.TorusGeometry(5, 1.1, 10, 28);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x4fc3f7,
    emissive: 0x4fc3f7,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.4,
  });
  const glassGeo = new THREE.CircleGeometry(4.6, 24);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x10101e,
    emissive: 0x4fc3f7,
    emissiveIntensity: 0.18,
    roughness: 0.15,
    metalness: 0.2,
  });
  for (const side of [1, -1]) {
    const porthole = new THREE.Group();
    porthole.add(new THREE.Mesh(rimGeo, rimMat));
    porthole.add(new THREE.Mesh(glassGeo, glassMat));
    porthole.position.set(0, windowY, side * 8.6);
    if (side < 0) porthole.rotation.y = Math.PI;
    group.add(porthole);
  }

  // Exhaust: additive cones anchored at the tail nozzle, scaling upward.
  const flameGroup = new THREE.Group();
  flameGroup.position.y = 33;
  const outerFlame = new THREE.Mesh(
    new THREE.ConeGeometry(5.5, 22, 20, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xff9a4c,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  outerFlame.position.y = 11;
  const innerFlame = new THREE.Mesh(
    new THREE.ConeGeometry(2.8, 14, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffe9b8,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  innerFlame.position.y = 7;
  flameGroup.add(outerFlame, innerFlame);
  group.add(flameGroup);

  // v = flame strength (0.45..2.4 range, same as the old CSS scaleY)
  const setFlame = (v, nowMs) => {
    const flicker = 0.9 + 0.1 * Math.sin(nowMs * 0.055) + 0.04 * Math.sin(nowMs * 0.021);
    flameGroup.scale.set(
      0.95 + 0.08 * Math.sin(nowMs * 0.047),
      v * flicker,
      0.95 + 0.08 * Math.cos(nowMs * 0.043)
    );
  };
  setFlame(0.45, 0);

  return { group, setFlame };
}
