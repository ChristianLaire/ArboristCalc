import { useState, useEffect, useMemo } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { calcSlingTension, calcMechanicalAdvantage, MaSystem } from '@/math/tension';
import { FF, T, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';
import { useAutosave, loadAutosaved } from '@/hooks/useAutosave';

type TensionSave = { subMode: 'sling' | 'ma'; load: string; angle: string; maLoad: string; maSystem: MaSystem; efficiency: string };

const MA_SYSTEMS: MaSystem[] = ['2:1', '3:1', '4:1'];

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    screen:       { backgroundColor: C.bg },
    container:    { padding: 16, paddingBottom: 56 },
    sectionLabel: { fontSize: T.base, fontFamily: FF.bold, color: C.green900, marginTop: 20, marginBottom: 8 },
    segment:      { marginBottom: 8 },
  });
}

export default function TensionScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [subMode, setSubMode] = useState<'sling' | 'ma'>('sling');
  const [load, setLoad]   = useState('');
  const [angle, setAngle] = useState('');
  const [maLoad, setMaLoad]         = useState('');
  const [maSystem, setMaSystem]     = useState<MaSystem>('3:1');
  const [efficiency, setEfficiency] = useState('85');

  useEffect(() => {
    loadAutosaved<TensionSave>('autosave_tension').then(saved => {
      if (!saved) return;
      setSubMode(saved.subMode);
      if (saved.load)       setLoad(saved.load);
      if (saved.angle)      setAngle(saved.angle);
      if (saved.maLoad)     setMaLoad(saved.maLoad);
      if (saved.maSystem)   setMaSystem(saved.maSystem);
      if (saved.efficiency) setEfficiency(saved.efficiency);
    });
  }, []);

  useAutosave('autosave_tension', {
    subMode, load, angle, maLoad, maSystem, efficiency,
  } satisfies TensionSave);

  const slingResult = (() => {
    try {
      const l = parseFloat(load);
      const a = parseFloat(angle);
      if (!l || isNaN(a)) return null;
      return calcSlingTension({ loadLbs: l, includedAngleDeg: a });
    } catch { return null; }
  })();

  const maResult = (() => {
    try {
      const l   = parseFloat(maLoad);
      const eff = parseFloat(efficiency) / 100;
      if (!l || isNaN(eff)) return null;
      return calcMechanicalAdvantage({ loadLbs: l, system: maSystem, sheaveEfficiency: eff });
    } catch { return null; }
  })();

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>
      <Text style={styles.sectionLabel}>Calculator Type</Text>
      <SegmentedButtons
        value={subMode}
        onValueChange={v => setSubMode(v as 'sling' | 'ma')}
        buttons={[{ value: 'sling', label: 'Sling Angle' }, { value: 'ma', label: 'Mech. Advantage' }]}
        style={styles.segment}
      />

      {subMode === 'sling' ? (
        <>
          <NumericInput label="Total Load" unit="lbs" value={load} onChangeText={setLoad} />
          <NumericInput label="Included Angle" unit="°" value={angle} onChangeText={setAngle} />
          {slingResult && (
            <>
              <ResultCard
                title="Sling Tension"
                rows={[
                  { label: 'Tension per Leg', value: `${slingResult.tensionPerLegLbs.toFixed(0)} lbs` },
                  { label: 'Included Angle',  value: `${angle}°` },
                ]}
              />
              <SafetyBadge level={slingResult.level} message={slingResult.message} />
            </>
          )}
        </>
      ) : (
        <>
          <NumericInput label="Load to Move" unit="lbs" value={maLoad} onChangeText={setMaLoad} />
          <Text style={styles.sectionLabel}>MA System</Text>
          <SegmentedButtons
            value={maSystem}
            onValueChange={v => setMaSystem(v as MaSystem)}
            buttons={MA_SYSTEMS.map(s => ({ value: s, label: s }))}
            style={styles.segment}
          />
          <NumericInput label="Sheave Efficiency" unit="%" value={efficiency} onChangeText={setEfficiency} placeholder="85" />
          {maResult && (
            <>
              <ResultCard
                title="Mechanical Advantage"
                rows={[
                  { label: 'System',       value: maSystem },
                  { label: 'Actual MA',    value: `${maResult.actualMa.toFixed(2)}:1` },
                  { label: 'Hauling Force', value: `${maResult.haulingForceLbs.toFixed(0)} lbs` },
                ]}
              />
              <SafetyBadge level={maResult.level} message={maResult.message} />
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}
