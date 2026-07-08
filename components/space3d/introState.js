// Shared between the Canvas-2D intro (CosmicBirth writes each frame) and the
// WebGL layer (Space3D reads each frame). Both tick at rAF cadence, so polling
// this object is as fresh as events, with zero plumbing.

// Phase timing in ms from the animation clock start.
export const T = {
  FLASH: 240,       // the big bang flash
  HS_START: 120,    // escape/warp travel begins
  HS_END: 2800,     // streaks resolve into stars, we "arrive"
  SUN_BORN: 2500,   // protostar core appears and starts igniting
  SUN_IGNITE: 3250, // sun finishes flaring into a star
  DISK: 3150,       // protoplanetary dust disk forms around the sun
  PLANETS: 4000,    // planets condense out of the disk
  DISK_FADE: 1300,  // ms over which the disk is swept up after PLANETS
  GALAXIES: 2600,   // early galaxies form during the journey
  CAMERA: 3100,     // camera finishes pulling back to rest
  INTRO_END: 6600,  // fully settled into the living state
};

export const intro = {
  t: 0,           // current intro clock (ms), written by CosmicBirth
  cx: 0,          // big-bang center in viewport CSS px
  cy: 0,
  active: true,   // true while the intro timeline is still playing
  skipRequested: false,
};

export const INTRO_SEEN_KEY = 'bs-intro-seen';

export const introSeen = () => {
  try {
    return !!sessionStorage.getItem(INTRO_SEEN_KEY);
  } catch {
    return false;
  }
};

export const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {}
};
