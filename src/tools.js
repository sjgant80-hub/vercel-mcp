// vercel-mcp tools · thin wrappers over @ai-native-solutions/vercel-sdk
import {
  foldNumber, unfoldState, stateSignature,
  depthBand, classifyKappaBand,
  applyOp, OP_META,
  kawasakiSum, kawasakiFlat, maekawaValid,
  signalSurvival, unclogGain,
  probeFromKappa
} from '@ai-native-solutions/vercel-sdk';

export const TOOLS = [
  {
    name: 'foldkit_fold_number',
    description: 'Fold a 7-vector state onto its primorial fold number (2^a·3^b·5^c·7^d·11^e·13^f·17^g). Returns fold + glyph signature.',
    inputSchema: {
      type: 'object',
      properties: { state: { type: 'array', items: { type: 'number' }, description: '7-slot exponent vector over the SPINE [2,3,5,7,11,13,17]' } },
      required: ['state']
    }
  },
  {
    name: 'foldkit_unfold_state',
    description: 'Unfold a fold number back to its 7-slot state vector via prime factorisation. Returns null if the fold has factors outside the 7-prime spine.',
    inputSchema: {
      type: 'object',
      properties: { fold: { type: 'number', description: 'Positive integer fold number' } },
      required: ['fold']
    }
  },
  {
    name: 'foldkit_depth_band',
    description: 'Classify a kappa (depth-ratio) value into one of the 7 named bands: ground, perception, gate, heart, naming, recognition, collapse.',
    inputSchema: {
      type: 'object',
      properties: { kappa: { type: 'number', description: 'Depth-ratio value (κ)' } },
      required: ['kappa']
    }
  },
  {
    name: 'foldkit_classify_kappa_band',
    description: 'Classify natural-language text into a kappa band via marker phrases. Returns matched band + rough entropy estimate.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: 'Free-form utterance to classify' } },
      required: ['text']
    }
  },
  {
    name: 'foldkit_apply_op',
    description: 'Apply one of the 6 fold operations (fire=intensify · water=calm · void=transcend · thunder=manifest · echo=self-ref · flower=return) to a state vector.',
    inputSchema: {
      type: 'object',
      properties: {
        op_name: { type: 'string', enum: ['fire', 'water', 'void', 'thunder', 'echo', 'flower'] },
        state: { type: 'array', items: { type: 'number' } },
        args: { type: 'array', items: { type: 'number' }, description: 'Optional per-op args (ring indices for fire/water/void)' }
      },
      required: ['op_name', 'state']
    }
  },
  {
    name: 'foldkit_kawasaki_check',
    description: 'Kawasaki flat-foldability check: alternating-sign angle sum must be 0 for a flat fold.',
    inputSchema: {
      type: 'object',
      properties: { angles: { type: 'array', items: { type: 'number' }, description: 'Sequence of crease angles around a vertex' } },
      required: ['angles']
    }
  },
  {
    name: 'foldkit_maekawa_check',
    description: 'Maekawa flat-foldability check: |mountain − valley| must equal 2 for a flat-foldable vertex.',
    inputSchema: {
      type: 'object',
      properties: {
        mountain: { type: 'number', description: 'Count of mountain creases' },
        valley: { type: 'number', description: 'Count of valley creases' }
      },
      required: ['mountain', 'valley']
    }
  },
  {
    name: 'foldkit_signal_survival',
    description: 'Fraction of signal surviving κ-decay through N layers. Returns κ^depth and its percentage.',
    inputSchema: {
      type: 'object',
      properties: {
        depth: { type: 'number', description: 'Layer depth to traverse' },
        kappa: { type: 'number', description: 'Optional custom κ (default 1/φ ≈ 0.618)' }
      },
      required: ['depth']
    }
  },
  {
    name: 'foldkit_unclog_gain',
    description: 'Multiplicative gain from clearing N layers of a κ-attenuated stack — how much more signal reaches ground after unclog.',
    inputSchema: {
      type: 'object',
      properties: {
        depth: { type: 'number', description: 'Original depth of the stack' },
        cleared: { type: 'number', description: 'Layers removed' }
      },
      required: ['depth', 'cleared']
    }
  },
  {
    name: 'foldkit_probe_from_kappa',
    description: 'Given a κ (or a text utterance), pick the band, the routing op, and return its probe question. Core Konomi routing primitive.',
    inputSchema: {
      type: 'object',
      properties: {
        kappa: { type: 'number', description: 'κ value (used only if text is not given)' },
        text: { type: 'string', description: 'Optional utterance — if present, classifies from text' }
      },
      required: ['kappa']
    }
  }
];

const HANDLERS = {
  foldkit_fold_number: ({ state }) => {
    const fold = foldNumber(state);
    return { fold, signature: stateSignature(state) };
  },
  foldkit_unfold_state: ({ fold }) => {
    const state = unfoldState(fold);
    return { state, signature: state ? stateSignature(state) : null };
  },
  foldkit_depth_band: ({ kappa }) => {
    const b = depthBand(kappa);
    return b ? { name: b.name, glyph: b.glyph, ring: b.ring, warn: !!b.warn } : null;
  },
  foldkit_classify_kappa_band: ({ text }) => {
    const b = classifyKappaBand(text);
    return b ? { band: b.name, glyph: b.glyph, ring: b.ring, entropy_estimate: b.ring / 6 } : null;
  },
  foldkit_apply_op: ({ op_name, state, args = [] }) => {
    const next = applyOp(op_name, state, ...args);
    return { state: next, signature: stateSignature(next), op_meta: OP_META[op_name] };
  },
  foldkit_kawasaki_check: ({ angles }) => ({ sum: kawasakiSum(angles), flat: kawasakiFlat(angles) }),
  foldkit_maekawa_check: ({ mountain, valley }) => ({ valid: maekawaValid(mountain, valley) }),
  foldkit_signal_survival: ({ depth, kappa }) => {
    const survival = kappa != null ? signalSurvival(depth, kappa) : signalSurvival(depth);
    return { survival, percent: survival * 100 };
  },
  foldkit_unclog_gain: ({ depth, cleared }) => {
    const gain = unclogGain(depth, cleared);
    return {
      gain,
      from_pct: signalSurvival(depth) * 100,
      to_pct: signalSurvival(Math.max(0, depth - cleared)) * 100
    };
  },
  foldkit_probe_from_kappa: ({ kappa, text }) => {
    const r = probeFromKappa(kappa, text);
    return { band: r.band?.name, glyph: r.band?.glyph, op: r.op?.name, verb: r.op?.verb, probe: r.probe };
  }
};

export async function callTool(name, args) {
  const fn = HANDLERS[name];
  if (!fn) throw new Error(`unknown tool: ${name}`);
  return fn(args);
}
