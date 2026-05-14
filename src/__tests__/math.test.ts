import { calcLogWeight } from '../math/weight';
import { calcHeatIndex, assessHeat, frozenWoodFactor, leafWeightLbs, calcDaylight, dayOfYear } from '../math/environmental';
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

// --- Environmental ---
describe('environmental', () => {
  test('heat index < 80°F returns raw temp', () => {
    expect(calcHeatIndex(75, 50)).toBe(75);
  });
  test('heat index at 90°F / 90% RH exceeds 100°F', () => {
    expect(calcHeatIndex(90, 90)).toBeGreaterThan(100);
  });
  test('assessHeat level = red at HI > 103', () => {
    const r = assessHeat(100, 95);
    expect(r.level).toBe('red');
  });
  test('frozen wood factor above 33°F = 1.0', () => {
    expect(frozenWoodFactor(50)).toBe(1.0);
  });
  test('frozen wood factor at 0°F = 1.4', () => {
    expect(frozenWoodFactor(0)).toBe(1.40);
  });
  test('frozen wood factor at -30°F = 1.8', () => {
    expect(frozenWoodFactor(-30)).toBe(1.80);
  });
  test('leaf weight ~1.3% of tree weight for deciduous in leaf', () => {
    const lw = leafWeightLbs(10000, true, true);
    expect(lw).toBeCloseTo(130, 0);
  });
  test('leaf weight = 0 when dormant', () => {
    expect(leafWeightLbs(10000, true, false)).toBe(0);
  });
  test('daylight hours at equator on equinox ≈ 12', () => {
    const r = calcDaylight(0, dayOfYear(3, 21));
    expect(r.daylightHours).toBeCloseTo(12, 0);
  });
  test('Seattle in June has more daylight than December', () => {
    const june = calcDaylight(47.6, dayOfYear(6, 21));
    const dec  = calcDaylight(47.6, dayOfYear(12, 21));
    expect(june.daylightHours).toBeGreaterThan(dec.daylightHours);
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
