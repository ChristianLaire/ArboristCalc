import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { DEFAULT_ROPES, Rope } from '@/data/ropes';
import { calcRigging } from '@/math/rigging';
import { C, T, R } from '@/theme';
import { useAutosave, loadAutosaved } from '@/hooks/useAutosave';

type RiggingSave = { staticLoad: string; impactFactor: string; ropeAngle: string; ropeId: string };

export default function RiggingScreen() {
  const [staticLoad, setStaticLoad]     = useState('');
  const [impactFactor, setImpactFactor] = useState('2.0');
  const [ropeAngle, setRopeAngle]       = useState('90');
  const [selectedRope, setSelectedRope] = useState<Rope>(DEFAULT_ROPES[4]);
  const [imported, setImported]         = useState(false);

  useEffect(() => {
    (async () => {
      // Restore previous session first, then let cross-module import override load field
      const saved = await loadAutosaved<RiggingSave>('autosave_rigging');
      if (saved) {
        if (saved.staticLoad)  setStaticLoad(saved.staticLoad);
        if (saved.impactFactor) setImpactFactor(saved.impactFactor);
        if (saved.ropeAngle)   setRopeAngle(saved.ropeAngle);
        const rope = DEFAULT_ROPES.find(r => r.id === saved.ropeId);
        if (rope) setSelectedRope(rope);
      }
      const crossModule = await AsyncStorage.getItem('crossModule_weightLbs');
      if (crossModule) { setStaticLoad(crossModule); setImported(true); }
    })();
  }, []);

  const result = (() => {
    try {
      const load   = parseFloat(staticLoad);
      const impact = parseFloat(impactFactor);
      const angle  = parseFloat(ropeAngle);
      if (!load || !impact || isNaN(angle)) return null;
      return calcRigging({ staticLoadLbs: load, impactFactor: impact, ropeAngleDeg: angle, wllLbs: selectedRope.wllLbs });
    } catch { return null; }
  })();

  useAutosave('autosave_rigging', {
    staticLoad, impactFactor, ropeAngle, ropeId: selectedRope.id,
  } satisfies RiggingSave);

  const sendToAnchor = async () => {
    if (!result) return;
    await AsyncStorage.setItem('crossModule_riggingLoadLbs', result.dynamicLoadLbs.toFixed(0));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>
      {imported && (
        <View style={styles.importBanner}>
          <Text style={styles.importText}>⬆  Load imported from Weight Calculator</Text>
        </View>
      )}

      <NumericInput label="Static Load" unit="lbs" value={staticLoad} onChangeText={setStaticLoad} />
      <NumericInput label="Impact Factor" value={impactFactor} onChangeText={setImpactFactor} placeholder="2.0" />
      <NumericInput label="Block Included Angle" unit="°" value={ropeAngle} onChangeText={setRopeAngle} placeholder="90" />

      <Text style={styles.sectionLabel}>Rope / Line</Text>
      {DEFAULT_ROPES.filter(r => r.type === 'Rigging').map(r => (
        <TouchableOpacity
          key={r.id}
          style={[styles.ropeRow, selectedRope.id === r.id && styles.ropeRowActive]}
          onPress={() => setSelectedRope(r)}
        >
          <Text style={[styles.ropeName, selectedRope.id === r.id && styles.ropeNameActive]}>{r.name}</Text>
          <View style={[styles.wllBadge, selectedRope.id === r.id && styles.wllBadgeActive]}>
            <Text style={[styles.ropeWll, selectedRope.id === r.id && styles.ropeWllActive]}>
              WLL {r.wllLbs.toLocaleString()} lbs
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {result && (
        <>
          <ResultCard
            title="Rigging Loads"
            rows={[
              { label: 'Dynamic Load',    value: `${result.dynamicLoadLbs.toFixed(0)} lbs` },
              { label: 'Block Force',     value: `${result.blockForceLbs.toFixed(0)} lbs` },
              { label: 'Total Spar Load', value: `${result.sparLoadLbs.toFixed(0)} lbs` },
              { label: 'Rope WLL',        value: `${selectedRope.wllLbs.toLocaleString()} lbs` },
              { label: '% of WLL',        value: `${result.percentWll.toFixed(1)}%` },
            ]}
          />
          <SafetyBadge level={result.level} message={result.message} />
          <TouchableOpacity style={styles.sendBtn} onPress={sendToAnchor}>
            <Text style={styles.sendBtnText}>→  Use in Anchor Calculator</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { backgroundColor: C.bg },
  container:    { padding: 16, paddingBottom: 48 },
  sectionLabel: { fontSize: T.base, fontWeight: T.bold, color: C.green900, marginTop: 20, marginBottom: 8 },

  importBanner: {
    backgroundColor: C.importBg, borderRadius: R.md, padding: 12,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: C.importBorder,
  },
  importText: { fontSize: T.base, color: C.importText, fontWeight: T.semibold },

  ropeRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 14,
    borderRadius: R.md, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.card, marginBottom: 8,
  },
  ropeRowActive: { backgroundColor: C.green900, borderColor: C.green900 },
  ropeName:      { fontSize: T.base, color: C.text, fontWeight: T.semibold },
  ropeNameActive: { color: '#fff', fontWeight: T.bold },

  wllBadge: {
    backgroundColor: C.bg, borderRadius: R.xl, paddingHorizontal: 10, paddingVertical: 4,
  },
  wllBadgeActive: { backgroundColor: C.green800 },
  ropeWll:        { fontSize: T.sm, color: C.textMid, fontWeight: T.semibold },
  ropeWllActive:  { color: C.green100 },

  sendBtn: {
    marginTop: 14, backgroundColor: C.green900, borderRadius: R.md,
    paddingVertical: 14, alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  sendBtnText: { color: '#fff', fontWeight: T.bold, fontSize: T.base, letterSpacing: 0.3 },
});
