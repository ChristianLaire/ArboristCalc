import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { SPECIES, Species, Category, getByCategory } from '@/data/species';
import { calcAnchor, DecayLevel, SafetyFactor } from '@/math/anchor';

const DECAY_OPTIONS: { label: string; value: DecayLevel }[] = [
  { label: 'None', value: 'none' },
  { label: 'Minor', value: 'minor' },
  { label: 'Significant', value: 'significant' },
];

const SF_OPTIONS: { label: string; value: SafetyFactor }[] = [
  { label: 'Rigging (3×)', value: 'rigging' },
  { label: 'Life Safety (5×)', value: 'lifeSafety' },
];

export default function AnchorScreen() {
  const [load, setLoad] = useState('');
  const [momentArm, setMomentArm] = useState('1.0');
  const [actualDiameter, setActualDiameter] = useState('');
  const [category, setCategory] = useState<Category>('Hardwood');
  const [species, setSpecies] = useState<Species>(SPECIES[0]);
  const [decay, setDecay] = useState<DecayLevel>('none');
  const [sf, setSf] = useState<SafetyFactor>('rigging');
  const [imported, setImported] = useState(false);

  const filteredSpecies = getByCategory(category);
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSpecies(getByCategory(cat)[0]);
  };

  useEffect(() => {
    AsyncStorage.getItem('crossModule_riggingLoadLbs').then(val => {
      if (val) { setLoad(val); setImported(true); }
    });
  }, []);

  const result = (() => {
    try {
      const l = parseFloat(load);
      const arm = parseFloat(momentArm);
      const dia = parseFloat(actualDiameter);
      if (!l || !arm || !dia) return null;
      return calcAnchor({
        loadLbs: l, momentArmFt: arm, actualDiameterIn: dia,
        morPsi: species.morPsi, decay, safetyFactor: sf,
      });
    } catch { return null; }
  })();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imported && (
        <View style={styles.importBanner}>
          <Text style={styles.importText}>⬆ Load imported from Rigging Calculator</Text>
        </View>
      )}

      <NumericInput label="Applied Load" unit="lbs" value={load} onChangeText={setLoad} />
      <NumericInput label="Moment Arm" unit="ft" value={momentArm} onChangeText={setMomentArm} placeholder="1.0" />
      <NumericInput label="Actual Stem Diameter" unit="in" value={actualDiameter} onChangeText={setActualDiameter} />

      <Text style={styles.sectionLabel}>Species (for MOR)</Text>
      <SegmentedButtons
        value={category}
        onValueChange={v => handleCategoryChange(v as Category)}
        buttons={[{ value: 'Hardwood', label: 'Hardwood' }, { value: 'Softwood', label: 'Softwood' }]}
        style={styles.segment}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {filteredSpecies.map(s => (
          <TouchableOpacity
            key={s.name}
            style={[styles.chip, species.name === s.name && styles.chipActive]}
            onPress={() => setSpecies(s)}
          >
            <Text style={[styles.chipText, species.name === s.name && styles.chipTextActive]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {species.notes && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{species.notes}</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Decay</Text>
      <SegmentedButtons
        value={decay}
        onValueChange={v => setDecay(v as DecayLevel)}
        buttons={DECAY_OPTIONS.map(d => ({ value: d.value, label: d.label }))}
        style={styles.segment}
      />

      <Text style={styles.sectionLabel}>Safety Factor</Text>
      <SegmentedButtons
        value={sf}
        onValueChange={v => setSf(v as SafetyFactor)}
        buttons={SF_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
        style={styles.segment}
      />

      {result && (
        <>
          <ResultCard
            title="Anchor Rating"
            rows={[
              { label: 'Required Diameter', value: `${result.requiredDiameterIn.toFixed(2)} in` },
              { label: 'Effective Diameter', value: `${result.effectiveDiameterIn.toFixed(2)} in` },
              { label: 'Ratio (actual/required)', value: `${result.ratio.toFixed(2)}×` },
              { label: 'Species MOR (green)', value: `${species.morPsi.toLocaleString()} psi` },
              { label: 'Safety Factor', value: sf === 'rigging' ? '3.0×' : '5.0×' },
            ]}
          />
          <SafetyBadge level={result.level} message={result.message} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 16, marginBottom: 6 },
  segment: { marginBottom: 8 },
  chipRow: { flexDirection: 'row', marginBottom: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8,
  },
  chipActive: { backgroundColor: '#2e7d32' },
  chipText: { fontSize: 13, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  importBanner: {
    backgroundColor: '#e3f2fd', borderRadius: 8, padding: 10,
    marginBottom: 12, borderWidth: 1, borderColor: '#90caf9',
  },
  importText: { fontSize: 13, color: '#1565c0', fontWeight: '600' },
  noteBox: {
    backgroundColor: '#f1f8e9', borderRadius: 8, padding: 10,
    marginBottom: 4, borderLeftWidth: 3, borderLeftColor: '#2e7d32',
  },
  noteText: { fontSize: 12, color: '#33691e', lineHeight: 18 },
});
