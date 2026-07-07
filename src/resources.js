// vercel-mcp resources · read-only URIs re-exposing foldkit's constant surface
import {
  SPINE, SPINE_GLYPHS, SPINE_NAMES, SPINE_ISA95,
  KAPPA_BANDS, OP_META,
  PHI, KAPPA, OMEGA, THETA_DEG, THETA_STEP, BASELINE
} from '@ai-native-solutions/vercel-sdk';

export const RESOURCES = [
  {
    uri: 'foldkit://spine',
    name: 'foldkit spine',
    description: '7-prime spine [2,3,5,7,11,13,17] with glyphs · names · ISA-95 layer mapping',
    mimeType: 'application/json'
  },
  {
    uri: 'foldkit://kappa-bands',
    name: 'foldkit kappa bands',
    description: 'The 7 κ-bands: collapse · recognition · naming · heart · gate · perception · ground',
    mimeType: 'application/json'
  },
  {
    uri: 'foldkit://ops',
    name: 'foldkit operations',
    description: 'The 6 fold operations with kanji · verb · probe metadata (fire · water · void · thunder · echo · flower)',
    mimeType: 'application/json'
  },
  {
    uri: 'foldkit://constants',
    name: 'foldkit constants',
    description: 'Framework constants: φ · κ · Ω · θ · θ_step · BASELINE',
    mimeType: 'application/json'
  }
];

const BODIES = {
  'foldkit://spine': () =>
    SPINE.map((prime, i) => ({
      ring: i,
      prime,
      glyph: SPINE_GLYPHS[i],
      name: SPINE_NAMES[i],
      isa95_layer: SPINE_ISA95[i]
    })),
  'foldkit://kappa-bands': () =>
    KAPPA_BANDS.map(b => ({
      name: b.name,
      glyph: b.glyph,
      ring: b.ring,
      min: b.min === -Infinity ? '-inf' : b.min,
      max: b.max === Infinity ? 'inf' : b.max,
      warn: !!b.warn,
      orphan: !!b.orphan
    })),
  'foldkit://ops': () =>
    Object.entries(OP_META).map(([name, meta]) => ({
      name,
      kanji: meta.kanji,
      arrow: meta.arrow,
      verb: meta.verb,
      probe: meta.probe
    })),
  'foldkit://constants': () => ({
    PHI, KAPPA, OMEGA,
    THETA_DEG, THETA_STEP,
    BASELINE
  })
};

export async function readResource(uri) {
  const fn = BODIES[uri];
  if (!fn) throw new Error(`unknown resource: ${uri}`);
  return fn();
}
