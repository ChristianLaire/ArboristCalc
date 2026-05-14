import type { SafetyLevel } from '@/components/SafetyBadge';

export type DecayLevel = 'none' | 'minor' | 'significant';
export type SafetyFactor = 'rigging' | 'lifeSafety';

const DECAY_FACTOR: Record<DecayLevel, number> = {
  none: 1.0,
  minor: 0.80,
  significant: 0.60,
};

const SF: Record<SafetyFactor, number> = {
  rigging: 3.0,
  lifeSafety: 5.0,
};

export interface AnchorInput {
  loadLbs: number;
  momentArmFt: number;    // default 1.0
  actualDiameterIn: number;
  morPsi: number;          // from species DB
  decay: DecayLevel;
  safetyFactor: SafetyFactor;
}

export interface AnchorResult {
  requiredDiameterIn: number;
  effectiveDiameterIn: number;
  ratio: number;           // actual / required
  level: SafetyLevel;
  message: string;
}

export function calcAnchor(input: AnchorInput): AnchorResult {
  const sf = SF[input.safetyFactor];
  const mor = input.morPsi * DECAY_FACTOR[input.decay];

  // Required diameter: d = cbrt((32 × load × arm × SF) / (π × MOR))
  const requiredDiameterIn = Math.cbrt(
    (32 * input.loadLbs * input.momentArmFt * sf) / (Math.PI * mor)
  );

  // Effective actual diameter after decay
  const effectiveDiameterIn = input.actualDiameterIn * DECAY_FACTOR[input.decay];
  const ratio = effectiveDiameterIn / requiredDiameterIn;

  let level: SafetyLevel;
  let message: string;
  if (ratio >= 1.5) {
    level = 'green';
    message = `Adequate anchor (${ratio.toFixed(2)}× required)`;
  } else if (ratio >= 1.0) {
    level = 'yellow';
    message = `Marginal anchor — use caution (${ratio.toFixed(2)}× required)`;
  } else {
    level = 'red';
    message = `INSUFFICIENT STEM DIAMETER (${ratio.toFixed(2)}× required)`;
  }

  return { requiredDiameterIn, effectiveDiameterIn, ratio, level, message };
}
