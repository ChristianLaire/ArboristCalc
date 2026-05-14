import { calcLogWeight } from '../math/weight';
import { calcRigging } from '../math/rigging';
import { calcSlingTension, calcMechanicalAdvantage } from '../math/tension';
import { calcAnchor } from '../math/anchor';
import { SPECIES, getByCategory } from '../data/species';

const redOak = SPECIES.find(s => s.name === 'Northern Red Oak')!;

// --- Species DB ---
describe('species database', () => {
  test('has 30+ species', () => expect(SPECIES.length).toBeGreaterThanOrEqual(30));
  test('all species have positive MOR', () => SPECIES.forEach(s => expect(s.morPsi).toBeGreaterThan(0)));
  test('Osage Orange has highest MOR (16,700 psi)', () => {
    const max = Math.max(...SPECIES.map(s => s.morPsi));
    const oo = SPECIES.find(s => s.name === 'Osage Orange')!;
    expect(oo.morPsi).toBe(max);
  });
  test('getByCategory returns only hardwoods', () => {
    const hw = getByCategory('Hardwood');
    expect(hw.every(s => s.category === 'Hardwood')).toBe(true);
  });
  test('getByCategory returns only softwoods', () => {
    const sw = getByCategory('Softwood');
    expect(sw.every(s => s.category === 'Softwood')).toBe(true);
  });
});

// --- Weight ---
describe('calcLogWeight', () => {
  test('log section — Smalian formula produces positive volume', () => {
    const r = calcLogWeight({
      mode: 'log', species: redOak, condition: 'green',
      diameterSmallIn: 10, diameterLargeIn: 14, lengthFt: 16,
    });
    expect(r.volumeFt3).toBeGreaterThan(0);
    expect(r.weightLbs).toBeGreaterThan(0);
  });

  test('whole tree 24" DBH Red Oak 40ft green ≈ 4200 lbs', () => {
    const r = calcLogWeight({
      mode: 'tree', species: redOak, condition: 'green',
      dbhIn: 24, heightFt: 40,
    });
    expect(r.weightLbs).toBeGreaterThan(3000);
    expect(r.weightLbs).toBeLessThan(6000);
  });

  test('sling angle 120° tension equals full load weight', () => {
    // At 120°: T = load / (2 × cos(60°)) = load / (2 × 0.5) = load
    const r = calcSlingTension({ loadLbs: 1000, includedAngleDeg: 120 });
    expect(r.tensionPerLegLbs).toBeCloseTo(1000, 0);
  });
});

// --- Rigging ---
describe('calcRigging', () => {
  test('dynamic load = static × impact factor', () => {
    const r = calcRigging({ staticLoadLbs: 500, impactFactor: 2, ropeAngleDeg: 90, wllLbs: 900 });
    expect(r.dynamicLoadLbs).toBeCloseTo(1000, 1);
  });

  test('< 50% WLL → green', () => {
    const r = calcRigging({ staticLoadLbs: 100, impactFactor: 2, ropeAngleDeg: 90, wllLbs: 900 });
    expect(r.level).toBe('green');
  });

  test('> 80% WLL → red', () => {
    const r = calcRigging({ staticLoadLbs: 400, impactFactor: 2, ropeAngleDeg: 90, wllLbs: 900 });
    expect(r.level).toBe('red');
  });
});

// --- Tension ---
describe('calcSlingTension', () => {
  test('0° angle → half load per leg', () => {
    const r = calcSlingTension({ loadLbs: 1000, includedAngleDeg: 0 });
    expect(r.tensionPerLegLbs).toBeCloseTo(500, 0);
  });

  test('angle < 90° → green', () => {
    const r = calcSlingTension({ loadLbs: 1000, includedAngleDeg: 60 });
    expect(r.level).toBe('green');
  });

  test('angle > 120° → red', () => {
    const r = calcSlingTension({ loadLbs: 1000, includedAngleDeg: 135 });
    expect(r.level).toBe('red');
  });
});

describe('calcMechanicalAdvantage', () => {
  test('3:1 system reduces hauling force', () => {
    const r = calcMechanicalAdvantage({ loadLbs: 900, system: '3:1', sheaveEfficiency: 1.0 });
    expect(r.haulingForceLbs).toBeCloseTo(300, 0);
  });

  test('actual MA < theoretical due to friction', () => {
    const r = calcMechanicalAdvantage({ loadLbs: 900, system: '3:1', sheaveEfficiency: 0.85 });
    expect(r.actualMa).toBeLessThan(3);
  });
});

// --- Anchor ---
describe('calcAnchor', () => {
  test('large stem → green', () => {
    const r = calcAnchor({
      loadLbs: 500, momentArmFt: 1, actualDiameterIn: 24,
      morPsi: redOak.morPsi, decay: 'none', safetyFactor: 'rigging',
    });
    expect(r.level).toBe('green');
    expect(r.ratio).toBeGreaterThan(1.5);
  });

  test('small stem → red', () => {
    const r = calcAnchor({
      loadLbs: 5000, momentArmFt: 2, actualDiameterIn: 4,
      morPsi: redOak.morPsi, decay: 'significant', safetyFactor: 'lifeSafety',
    });
    expect(r.level).toBe('red');
  });

  test('minor decay reduces effective diameter by 20%', () => {
    const r = calcAnchor({
      loadLbs: 100, momentArmFt: 1, actualDiameterIn: 10,
      morPsi: 8000, decay: 'minor', safetyFactor: 'rigging',
    });
    expect(r.effectiveDiameterIn).toBeCloseTo(8, 1);
  });
});
