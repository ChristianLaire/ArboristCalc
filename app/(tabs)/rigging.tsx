import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { DEFAULT_ROPES, Rope } from '@/data/ropes';
import { calcRigging } from '@/math/rigging';

export default function RiggingScreen() {
  const [staticLoad, setStaticLoad] = useState('');
  const [impactFactor, setImpactFactor] = useState('2.0');
  const [ropeAngle, setRopeAngle] = useState('90');
  const [selectedRope, setSelectedRope] = useState<Rope>(DEFAULT_ROPES[4]);
  const [imported, setImported] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('crossModule_weightLbs').then(val => {
      if (val) { setStaticLoad(val); setImported(true); }
    });
  }, []);

  const result = (() => {
    try {
      const load = parseFloat(staticLoad);
      const impact = parseFloat(impactFactor);
      const angle = parseFloat(ropeAngle);
      if (!load || !impact || isNaN(angle)) return null;
      return calcRigging({ staticLoadLbs: load, impactFactor: impact, ropeAngleDeg: angle, wllLbs: selectedRope.wllLbs });
    } catch { return null; }
  })();

  const sendToAnchor = async () => {
    if (!result) return;
    await AsyncStorage.setItem('crossModule_riggingLoadLbs', result.dynamicLoadLbs.toFixed(0));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imported && (
        <View style={styles.importBanner}>
          <Text style={styles.importText}>⬆ Load imported from Weight Calculator</Text>
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
          <Text style={[styles.ropeWll, selectedRope.id === r.id && styles.ropeWllActive]}>WLL {r.wllLbs} lbs</Text>
        </TouchableOpacity>
      ))}

      {result && (
        <>
          <ResultCard
            title="Rigging Loads"
            rows={[
              { label: 'Dynamic Load', value: `${result.dynamicLoadLbs.toFixed(0)} lbs` },
              { label: 'Block Force', value: `${result.blockForceLbs.toFixed(0)} lbs` },
              { label: 'Total Spar Load', value: `${result.sparLoadLbs.toFixed(0)} lbs` },
              { label: 'Rope WLL', value: `${selectedRope.wllLbs} lbs` },
              { label: '% of WLL', value: `${result.percentWll.toFixed(1)}%` },
            ]}
          />
          <SafetyBadge level={result.level} message={result.message} />
          <TouchableOpacity style={styles.sendBtn} onPress={sendToAnchor}>
            <Text style={styles.sendBtnText}>→ Use in Anchor Calculator</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 16, marginBottom: 6 },
  importBanner: {
    backgroundColor: '#e3f2fd', borderRadius: 8, padding: 10,
    marginBottom: 12, borderWidth: 1, borderColor: '#90caf9',
  },
  importText: { fontSize: 13, color: '#1565c0', fontWeight: '600' },
  ropeRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0',
    backgroundColor: '#fafafa', marginBottom: 8,
  },
  ropeRowActive: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  ropeName: { fontSize: 14, color: '#333' },
  ropeNameActive: { color: '#fff', fontWeight: '600' },
  ropeWll: { fontSize: 13, color: '#888' },
  ropeWllActive: { color: '#c8e6c9' },
  sendBtn: {
    marginTop: 12, backgroundColor: '#1565c0', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
