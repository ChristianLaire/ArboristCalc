import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import LegalBanner from '@/components/LegalBanner';
import PressableFeedback from '@/components/PressableFeedback';
import { DEFAULT_ROPES, Rope } from '@/data/ropes';
import { calcRigging } from '@/math/rigging';
import { FF, T, R, TOUCH_TARGET, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';
import { useAutosave, loadAutosaved } from '@/hooks/useAutosave';
import type { SafetyLevel } from '@/components/SafetyBadge';

type RiggingSave = { staticLoad: string; impactFactor: string; ropeAngle: string; ropeId: string };

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    screen:       { backgroundColor: C.bg },
    container:    { padding: 16, paddingBottom: 56 },
    sectionLabel: { fontSize: T.base, fontFamily: FF.bold, color: C.green900, marginTop: 20, marginBottom: 8 },

    importBanner: { backgroundColor: C.importBg, borderRadius: R.md, padding: 13, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: C.importBorder },
    importText:   { fontSize: T.sm, fontFamily: FF.semibold, color: C.importText },

    ropeRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, minHeight: TOUCH_TARGET, borderRadius: R.md, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card, marginBottom: 10 },
    ropeRowActive: { backgroundColor: C.green900, borderColor: C.green900 },
    ropeName:      { fontSize: T.base, fontFamily: FF.semibold, color: C.text },
    ropeNameActive: { color: '#fff', fontFamily: FF.bold },
    wllBadge:      { backgroundColor: C.bg, borderRadius: R.pill, paddingHorizontal: 12, paddingVertical: 5 },
    wllBadgeActive: { backgroundColor: C.green800 },
    ropeWll:        { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid, fontVariant: ['tabular-nums'] },
    ropeWllActive:  { color: C.green100 },

    // Equipment WLL comparison table
    compareCard: { backgroundColor: C.card, borderRadius: R.md, marginTop: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
    compareTitle: { fontSize: T.sm, fontFamily: FF.heavy, color: C.green900, padding: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.stripe },
    compareRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 12 },
    compareRowAlt: { backgroundColor: C.stripe },
    compareRopeName: { flex: 1, fontSize: T.sm, fontFamily: FF.medium, color: C.text },
    compareWll: { fontSize: T.sm, fontFamily: FF.normal, color: C.textMid, marginRight: 12, fontVariant: ['tabular-nums'] },
    comparePass: { fontSize: T.sm, fontFamily: FF.heavy, color: C.safeGreenText },
    compareFail: { fontSize: T.sm, fontFamily: FF.heavy, color: C.safeRedText },

    sendBtn:     { marginTop: 12, backgroundColor: C.ctaOrange, borderRadius: R.pill, paddingVertical: 0, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
    sendBtnText: { color: '#fff', fontFamily: FF.bold, fontSize: T.md, letterSpacing: 0.3 },
    shareBtn:    { marginTop: 10, backgroundColor: C.card, borderRadius: R.pill, paddingVertical: 0, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.border },
    shareBtnText: { color: C.green900, fontFamily: FF.semibold, fontSize: T.base },
  });
}

export default function RiggingScreen() {
  useKeepAwake();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [staticLoad, setStaticLoad]     = useState('');
  const [impactFactor, setImpactFactor] = useState('2.0');
  const [ropeAngle, setRopeAngle]       = useState('90');
  const [selectedRope, setSelectedRope] = useState<Rope>(DEFAULT_ROPES[4]);
  const [imported, setImported]         = useState(false);
  const [detectedState, setDetectedState] = useState<string | null>(null);
  const prevLevel = useRef<SafetyLevel | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await loadAutosaved<RiggingSave>('autosave_rigging');
      if (saved) {
        if (saved.staticLoad)   setStaticLoad(saved.staticLoad);
        if (saved.impactFactor) setImpactFactor(saved.impactFactor);
        if (saved.ropeAngle)    setRopeAngle(saved.ropeAngle);
        const rope = DEFAULT_ROPES.find(r => r.id === saved.ropeId);
        if (rope) setSelectedRope(rope);
      }
      const crossModule = await AsyncStorage.getItem('crossModule_weightLbs');
      if (crossModule) { setStaticLoad(crossModule); setImported(true); }
      const state = await AsyncStorage.getItem('arborist_detected_state');
      if (state) setDetectedState(state);
    })();
  }, []);

  const result = (() => {
    try {
      const load = parseFloat(staticLoad), impact = parseFloat(impactFactor), angle = parseFloat(ropeAngle);
      if (!load || !impact || isNaN(angle)) return null;
      return calcRigging({ staticLoadLbs: load, impactFactor: impact, ropeAngleDeg: angle, wllLbs: selectedRope.wllLbs });
    } catch { return null; }
  })();

  // Warning haptic when result flips to red
  useEffect(() => {
    if (result && result.level !== prevLevel.current) {
      if (result.level === 'red') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      prevLevel.current = result.level;
    }
    if (!result) prevLevel.current = null;
  }, [result?.level]);

  useAutosave('autosave_rigging', { staticLoad, impactFactor, ropeAngle, ropeId: selectedRope.id } satisfies RiggingSave);

  const sendToAnchor = async () => {
    if (!result) return;
    await AsyncStorage.setItem('crossModule_riggingLoadLbs', result.dynamicLoadLbs.toFixed(0));
  };

  const shareResult = async () => {
    if (!result) return;
    const mult = (result.dynamicLoadLbs / parseFloat(staticLoad)).toFixed(1);
    await Share.share({ message: `ArboristCalc — Rigging Loads\nStatic Load: ${staticLoad} lbs\nDynamic Load: ${result.dynamicLoadLbs.toFixed(0)} lbs (${mult}× static)\nBlock Force: ${result.blockForceLbs.toFixed(0)} lbs\nTotal Spar Load: ${result.sparLoadLbs.toFixed(0)} lbs\nRope: ${selectedRope.name} (WLL ${selectedRope.wllLbs.toLocaleString()} lbs)\nUtilization: ${result.percentWll.toFixed(1)}% of WLL\nGenerated by ArboristCalc` });
  };

  const riggingRopes = DEFAULT_ROPES.filter(r => r.type === 'Rigging');

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>
      <LegalBanner stateCode={detectedState} />

      {imported && (
        <View style={styles.importBanner}>
          <Text style={styles.importText}>⬆  Load imported from Weight Calculator</Text>
        </View>
      )}

      <NumericInput label="Static Load" unit="lbs" value={staticLoad} onChangeText={setStaticLoad} />
      <NumericInput label="Impact Factor" value={impactFactor} onChangeText={setImpactFactor} placeholder="2.0" />
      <NumericInput label="Block Included Angle" unit="°" value={ropeAngle} onChangeText={setRopeAngle} placeholder="90" />

      <Text style={styles.sectionLabel}>Rope / Line</Text>
      {riggingRopes.map(r => (
        <PressableFeedback
          key={r.id}
          style={[styles.ropeRow, selectedRope.id === r.id && styles.ropeRowActive]}
          onPress={() => setSelectedRope(r)}
          haptic="selection"
          scaleTarget={0.97}
        >
          <Text style={[styles.ropeName, selectedRope.id === r.id && styles.ropeNameActive]}>{r.name}</Text>
          <View style={[styles.wllBadge, selectedRope.id === r.id && styles.wllBadgeActive]}>
            <Text style={[styles.ropeWll, selectedRope.id === r.id && styles.ropeWllActive]}>
              WLL {r.wllLbs.toLocaleString()} lbs
            </Text>
          </View>
        </PressableFeedback>
      ))}

      {result && (
        <>
          <ResultCard
            title="Rigging Loads"
            hero={{
              value: `${result.dynamicLoadLbs.toFixed(0)} lbs`,
              sublabel: `${(result.dynamicLoadLbs / parseFloat(staticLoad)).toFixed(1)}× static weight`,
              level: result.level,
            }}
            rows={[
              { label: 'Block Force',     value: `${result.blockForceLbs.toFixed(0)} lbs` },
              { label: 'Total Spar Load', value: `${result.sparLoadLbs.toFixed(0)} lbs` },
              { label: '% of Selected WLL', value: `${result.percentWll.toFixed(1)}%`, highlight: result.percentWll > 80 },
            ]}
          />
          <SafetyBadge level={result.level} message={result.message} />

          {/* Equipment WLL comparison table */}
          <View style={styles.compareCard}>
            <Text style={styles.compareTitle}>All Rigging Lines vs. Dynamic Load</Text>
            {riggingRopes.map((r, i) => {
              const passes = r.wllLbs >= result.dynamicLoadLbs;
              return (
                <View key={r.id} style={[styles.compareRow, i % 2 === 1 && styles.compareRowAlt]}>
                  <Text style={styles.compareRopeName}>{r.name}</Text>
                  <Text style={styles.compareWll}>WLL {r.wllLbs.toLocaleString()}</Text>
                  <Text style={passes ? styles.comparePass : styles.compareFail}>
                    {passes ? '✓ Safe' : '✕ Exceeds'}
                  </Text>
                </View>
              );
            })}
          </View>

          <PressableFeedback style={styles.sendBtn} onPress={sendToAnchor} haptic="medium">
            <Text style={styles.sendBtnText}>→  Use in Anchor Calculator</Text>
          </PressableFeedback>
          <PressableFeedback style={styles.shareBtn} onPress={shareResult} haptic="light">
            <Text style={styles.shareBtnText}>↑  Share Result</Text>
          </PressableFeedback>
        </>
      )}
    </ScrollView>
  );
}
