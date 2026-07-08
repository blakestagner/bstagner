// Photoreal Earth: texture-mapped globe + cloud shell + fresnel atmosphere rim.
// Built at radius 1; the caller scales to pixels.

const TEX_BASE = '/textures/earth/';

export function loadEarthTextures(THREE, quality) {
  const size = quality === 'low' ? 1024 : 2048;
  const loader = new THREE.TextureLoader();
  const load = (file) =>
    new Promise((resolve, reject) => loader.load(TEX_BASE + file, resolve, undefined, reject));

  return Promise.all([
    load(`earth_atmos_${size}.jpg`),
    load(`earth_normal_${size}.jpg`),
    load(`earth_specular_${size}.jpg`),
    load(`earth_lights_${size}.png`),
    load('earth_clouds_1024.png'), // clouds ship at 1K for both tiers
  ]).then(([map, normal, specular, lights, clouds]) => {
    map.colorSpace = THREE.SRGBColorSpace;
    lights.colorSpace = THREE.SRGBColorSpace;
    clouds.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return { map, normal, specular, lights, clouds };
  });
}

export function buildEarth(THREE, tex, quality) {
  const seg = quality === 'low' ? 32 : 64;
  const group = new THREE.Group();
  // axial tilt, tipped toward the camera's key light
  group.rotation.z = -0.41;

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, seg, seg),
    new THREE.MeshPhongMaterial({
      map: tex.map,
      normalMap: tex.normal,
      normalScale: new THREE.Vector2(0.85, 0.85),
      specularMap: tex.specular,
      specular: new THREE.Color(0x444444),
      shininess: 18,
      // city lights; the map is near-black outside cities so the day side is unaffected
      emissive: new THREE.Color(0xffdd99),
      emissiveMap: tex.lights,
      emissiveIntensity: 0.85,
    })
  );
  group.add(globe);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.012, seg, seg),
    new THREE.MeshLambertMaterial({
      map: tex.clouds,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );
  group.add(clouds);

  // fresnel rim glow: BackSide shell, brightest at the globe's limb, fading out
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.07, seg, seg),
    new THREE.ShaderMaterial({
      uniforms: { tint: { value: new THREE.Color(0x4fc3f7) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 tint;
        varying vec3 vNormal;
        void main() {
          float rim = pow(clamp(-vNormal.z * 3.0, 0.0, 1.0), 1.6);
          gl_FragColor = vec4(tint, rim * 0.85);
        }`,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })
  );
  group.add(atmosphere);

  // dtMs: continuous spin, clouds drifting slightly faster
  const update = (dtMs) => {
    globe.rotation.y += 0.000052 * dtMs;
    clouds.rotation.y += 0.000068 * dtMs;
  };

  return { group, update };
}
