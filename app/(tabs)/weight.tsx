import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { SPECIES, Species, Condition, Category, getByCategory } from '@/data/species';
import { calcLogWeight } from '@/math/weight';

const CONDITIONS: { label: string; value: Condition }[] = [
  { label: 'Green', value: 'green' },
  { label: 'Air-dry', value: 'airDry' },
  { label: 'Kiln-dry', value: 'kilnDry' },
];

export default function WeightScreen() {
  const [mode, setMode] = useState<'log' | 'tree'>('log');
  const [category, setCategory] = useState<Category>('Hardwood');
  const [species, setSpecies] = useState<Species>(SPECIES[0]);
  const [condition, setCondition] = useState<Condition>('green');

  // log mode
  const [dSmall, setDSmall] = useState('');
  const [dLarge, setDLarge] = useState('');
  const [length, setLength] = useState('');

  // tree mode
  const [dbh, setDbh] = useState('');
  const [height, setHeight] = useState('');

  const filteredSpecies = getByCategory(category);

  const result = (() => {
    try {
      if (mode === 'log') {
        const s = parseFloat(dSmall);
        const l = parseFloat(dLarge);
        const n = parseFloat(length);
        if (!s || !l || !n) return null;
        return calcLogWeight({ mode, species, condition, diameterSmallIn: s, diameterLargeIn: l, lengthFt: n });
      } else {
        const d = parseFloat(dbh);
        const h = parseFloat(height);
        if (!d || !h) return null;
        return calcLogWeight({ mode, species, condition, dbhIn: d, heightFt: h });
      }
    } catch { return null; }
  })();

  const sendToRigging = async () => {
    if (!result) return;
    await AsyncStorage.setItem('crossModule_weightLbs', result.weightLbs.toFixed(0));
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSpecies(getByCategory(cat)[0]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionLabel}>Mode</Text>
      <SegmentedButtons
        value={mode}
        onValueChange={v => setMode(v as 'log' | 'tree')}
        buttons={[{ value: 'log', label: 'Log Section' }, { value: 'tree', label: 'Whole Tree' }]}
        style={styles.segment}
      />

      <Text style={styles.sectionLabel}>Category</Text>
      <SegmentedButtons
        value={category}
        onValueChange={v => handleCategoryChange(v as Category)}
        buttons={[{ value: 'Hardwood', label: 'Hardwood' }, { value: 'Softwood', label: 'Softwood' }]}
        style={styles.segment}
      />

      <Text style={styles.sectionLabel}>Species</Text>
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

      <Text style={styles.sectionLabel}>Condition</Text>
      <SegmentedButtons
        value={condition}
        onValueChange={v => setCondition(v as Condition)}
        buttons={CONDITIONS.map(c => ({ value: c.value, label: c.label }))}
        style={styles.segment}
      />

      {mode === 'log' ? (
        <>
          <NumericInput label="Small-end Diameter" unit="in" value={dSmall} onChangeText={setDSmall} />
          <NumericInput label="Large-end Diameter" unit="in" value={dLarge} onChangeText={setDLarge} />
          <NumericInput label="Length" unit="ft" value={length} onChangeText={setLength} />
        </>
      ) : (
        <>
          <NumericInput label="DBH (Diameter at Breast Height)" unit="in" value={dbh} onChangeText={setDbh} />
          <NumericInput label="Tree Height" unit="ft" value={height} onChangeText={setHeight} />
        </>
      )}

      {result && (
        <>
          <ResultCard
            title="Weight Estimate"
            rows={[
              { label: 'Volume', value: `${result.volumeFt3.toFixed(2)} ft³` },
              { label: 'Estimated Weight', value: `${result.weightLbs.toFixed(0)} lbs` },
              { label: 'Species', value: species.name },
              { label: 'Density', value: `${species.greenLbsPerFt3} lbs/ft³ (green)` },
              { label: 'Condition', value: CONDITIONS.find(c => c.value === condition)?.label ?? '' },
            ]}
          />
          <SafetyBadge level="green" message={`${result.weightLbs.toFixed(0)} lbs estimated — tap below to send to Rigging`} />
          <TouchableOpacity style={styles.sendBtn} onPress={sendToRigging}>
            <Text style={styles.sendBtnText}>→ Use in Rigging Calculator</Text>
          </TouchableOpacity>
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
  noteBox: {
    backgroundColor: '#f1f8e9', borderRadius: 8, padding: 10,
    marginBottom: 4, borderLeftWidth: 3, borderLeftColor: '#2e7d32',
  },
  noteText: { fontSize: 12, color: '#33691e', lineHeight: 18 },
  sendBtn: {
    marginTop: 12, backgroundColor: '#1565c0', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
