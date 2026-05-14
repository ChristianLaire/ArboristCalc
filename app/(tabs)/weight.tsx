import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { SPECIES, Species, Condition, Category, getByCategory } from '@/data/species';
import { calcLogWeight } from '@/math/weight';
import { leafWeightLbs } from '@/math/environmental';
import { STATE_TO_REGION, SPECIES_REGIONS, REGION_LABELS, Region } from '@/data/speciesRanges';
import { C, T, R } from '@/theme';

const CONDITIONS: { label: string; value: Condition }[] = [
  { label: 'Green', value: 'green' },
  { label: 'Air-dry', value: 'airDry' },
  { label: 'Kiln-dry', value: 'kilnDry' },
];

const CUSTOM_KEY = 'arborist_custom_species';

interface CustomSpecies extends Species { isCustom: true; }

export default function WeightScreen() {
  const [mode, setMode]           = useState<'log' | 'tree'>('log');
  const [category, setCategory]   = useState<Category>('Hardwood');
  const [species, setSpecies]     = useState<Species>(SPECIES[0]);
  const [condition, setCondition] = useState<Condition>('green');

  const [dSmall, setDSmall] = useState('');
  const [dLarge, setDLarge] = useState('');
  const [length, setLength] = useState('');

  const [dbh, setDbh]       = useState('');
  const [height, setHeight] = useState('');
  const [inLeaf, setInLeaf] = useState(true);

  const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);
  const [showAll, setShowAll]               = useState(false);
  const [customSpecies, setCustomSpecies]   = useState<CustomSpecies[]>([]);
  const [modalVisible, setModalVisible]     = useState(false);
  const [newName, setNewName]               = useState('');
  const [newCategory, setNewCategory]       = useState<Category>('Hardwood');
  const [newGreenDensity, setNewGreenDensity] = useState('');
  const [newMor, setNewMor]                 = useState('');
  const [newNotes, setNewNotes]             = useState('');

  useEffect(() => { loadRegionAndCustom(); }, []);

  async function loadRegionAndCustom() {
    const state = await AsyncStorage.getItem('arborist_detected_state');
    if (state && STATE_TO_REGION[state]) setDetectedRegion(STATE_TO_REGION[state] as Region);
    const raw = await AsyncStorage.getItem(CUSTOM_KEY);
    if (raw) { try { setCustomSpecies(JSON.parse(raw)); } catch {} }
  }

  async function saveCustomSpecies(updated: CustomSpecies[]) {
    setCustomSpecies(updated);
    await AsyncStorage.setItem(CUSTOM_KEY, JSON.stringify(updated));
  }

  function addCustomSpecies() {
    const density = parseFloat(newGreenDensity);
    const mor     = parseFloat(newMor);
    if (!newName.trim())              { Alert.alert('Name required'); return; }
    if (isNaN(density) || density <= 0) { Alert.alert('Enter a valid green density (lbs/ft³)'); return; }
    if (isNaN(mor) || mor <= 0)       { Alert.alert('Enter a valid MOR (psi)'); return; }
    const entry: CustomSpecies = {
      name: newName.trim(), category: newCategory,
      greenLbsPerFt3: density,
      airDryLbsPerFt3: Math.round(density * 0.65),
      kilnDryLbsPerFt3: Math.round(density * 0.60),
      morPsi: mor,
      notes: newNotes.trim() || undefined,
      isCustom: true,
    };
    saveCustomSpecies([...customSpecies, entry]);
    setNewName(''); setNewGreenDensity(''); setNewMor(''); setNewNotes('');
    setModalVisible(false);
  }

  function removeCustomSpecies(name: string) {
    Alert.alert('Remove Species', `Remove "${name}" from custom list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        const updated = customSpecies.filter(s => s.name !== name);
        if (species.name === name) setSpecies(SPECIES[0]);
        saveCustomSpecies(updated);
      }},
    ]);
  }

  const baseFiltered     = getByCategory(category);
  const regionFiltered   = (detectedRegion && !showAll)
    ? baseFiltered.filter(s => {
        const regions = SPECIES_REGIONS[s.name];
        return regions ? regions.includes(detectedRegion) : true;
      })
    : baseFiltered;
  const customFiltered   = customSpecies.filter(s => s.category === category);
  const displaySpecies: Species[] = [...regionFiltered, ...customFiltered];

  const result = (() => {
    try {
      if (mode === 'log') {
        const s = parseFloat(dSmall), l = parseFloat(dLarge), n = parseFloat(length);
        if (!s || !l || !n) return null;
        return calcLogWeight({ mode, species, condition, diameterSmallIn: s, diameterLargeIn: l, lengthFt: n });
      } else {
        const d = parseFloat(dbh), h = parseFloat(height);
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
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>

      {detectedRegion && (
        <View style={styles.regionBanner}>
          <Text style={styles.regionBannerText}>
            📍 Showing species common to {REGION_LABELS[detectedRegion]}
          </Text>
          <TouchableOpacity onPress={() => setShowAll(v => !v)}>
            <Text style={styles.regionToggle}>{showAll ? 'Show Regional' : 'Show All'}</Text>
          </TouchableOpacity>
        </View>
      )}

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

      <View style={styles.speciesHeader}>
        <Text style={styles.sectionLabel}>
          Species{detectedRegion && !showAll ? ` (${displaySpecies.length - customFiltered.length} regional)` : ''}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Custom</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {displaySpecies.map(s => {
          const isCustom = 'isCustom' in s;
          const isActive = species.name === s.name;
          return (
            <View key={s.name} style={styles.chipWrapper}>
              <TouchableOpacity
                style={[styles.chip, isActive && styles.chipActive, isCustom && !isActive && styles.chipCustom]}
                onPress={() => setSpecies(s)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{s.name}</Text>
              </TouchableOpacity>
              {isCustom && (
                <TouchableOpacity style={styles.chipDelete} onPress={() => removeCustomSpecies(s.name)}>
                  <Text style={styles.chipDeleteText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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
          <Text style={styles.sectionLabel}>Leaf / Needle Status</Text>
          <SegmentedButtons
            value={inLeaf ? 'yes' : 'no'}
            onValueChange={v => setInLeaf(v === 'yes')}
            buttons={[
              { value: 'yes', label: species.category === 'Softwood' ? 'Has Needles' : 'In Leaf' },
              { value: 'no',  label: species.category === 'Softwood' ? 'No Needles'  : 'Dormant' },
            ]}
            style={styles.segment}
          />
        </>
      )}

      {result && (() => {
        const leafWt  = mode === 'tree' ? leafWeightLbs(result.weightLbs, species.category === 'Hardwood', inLeaf) : 0;
        const totalWt = result.weightLbs + leafWt;
        return (
          <>
            <ResultCard
              title="Weight Estimate"
              rows={[
                { label: 'Volume',      value: `${result.volumeFt3.toFixed(2)} ft³` },
                { label: 'Stem Weight', value: `${result.weightLbs.toFixed(0)} lbs` },
                ...(leafWt > 0 ? [{ label: mode === 'tree' && species.category === 'Softwood' ? 'Needle Weight (~0.8%)' : 'Leaf Weight (~1.3%)', value: `${leafWt.toFixed(0)} lbs` }] : []),
                { label: 'Total Weight', value: `${totalWt.toFixed(0)} lbs` },
                { label: 'Species',      value: species.name },
                { label: 'Density',      value: `${species.greenLbsPerFt3} lbs/ft³ (green)` },
                { label: 'Condition',    value: CONDITIONS.find(c => c.value === condition)?.label ?? '' },
              ]}
            />
            <SafetyBadge level="green" message={`${totalWt.toFixed(0)} lbs total — tap below to send to Rigging`} />
            <TouchableOpacity style={styles.sendBtn} onPress={sendToRigging}>
              <Text style={styles.sendBtnText}>→  Use in Rigging Calculator</Text>
            </TouchableOpacity>
          </>
        );
      })()}

      {/* ── Custom Species Modal ─────────────────────────── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Custom Species</Text>

            <Text style={styles.modalLabel}>Species Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Blue Gum Eucalyptus"
              placeholderTextColor={C.textLight}
            />

            <Text style={styles.modalLabel}>Category</Text>
            <SegmentedButtons
              value={newCategory}
              onValueChange={v => setNewCategory(v as Category)}
              buttons={[{ value: 'Hardwood', label: 'Hardwood' }, { value: 'Softwood', label: 'Softwood' }]}
              style={styles.segment}
            />

            <Text style={styles.modalLabel}>Green Density (lbs/ft³)</Text>
            <TextInput
              style={styles.modalInput}
              value={newGreenDensity}
              onChangeText={setNewGreenDensity}
              keyboardType="decimal-pad"
              placeholder="e.g. 62"
              placeholderTextColor={C.textLight}
            />

            <Text style={styles.modalLabel}>Green MOR (psi)</Text>
            <TextInput
              style={styles.modalInput}
              value={newMor}
              onChangeText={setNewMor}
              keyboardType="decimal-pad"
              placeholder="e.g. 8000"
              placeholderTextColor={C.textLight}
            />

            <Text style={styles.modalLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMulti]}
              value={newNotes}
              onChangeText={setNewNotes}
              placeholder="Field notes, habitat, hazards…"
              placeholderTextColor={C.textLight}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={addCustomSpecies}>
                <Text style={styles.modalSaveText}>Add Species</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:    { backgroundColor: C.bg },
  container: { padding: 16, paddingBottom: 48 },
  sectionLabel: { fontSize: T.base, fontWeight: T.bold, color: C.green900, marginTop: 20, marginBottom: 8 },
  segment:      { marginBottom: 8 },

  regionBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.green50, borderRadius: R.md, padding: 11, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: C.green800,
  },
  regionBannerText: { fontSize: T.sm, color: C.green900, fontWeight: T.bold, flex: 1 },
  regionToggle:     { fontSize: T.sm, color: C.orange700, fontWeight: T.bold, marginLeft: 8 },

  speciesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addBtn: {
    backgroundColor: C.green50, borderRadius: R.xl,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1.5, borderColor: C.green100,
  },
  addBtnText: { fontSize: T.sm, color: C.green900, fontWeight: T.bold },

  chipRow:    { flexDirection: 'row', marginBottom: 6 },
  chipWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginRight: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.xl,
    backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border,
  },
  chipActive:       { backgroundColor: C.green900, borderColor: C.green900 },
  chipCustom:       { backgroundColor: '#e3f2fd', borderColor: '#90caf9' },
  chipText:         { fontSize: T.sm, color: C.textMid, fontWeight: T.semibold },
  chipTextActive:   { color: '#fff', fontWeight: T.bold },
  chipDelete: {
    marginLeft: -8, marginTop: -4,
    backgroundColor: '#ef5350', borderRadius: 10,
    width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
  },
  chipDeleteText: { color: '#fff', fontSize: 10, fontWeight: T.heavy, lineHeight: 18 },

  noteBox: {
    backgroundColor: C.green50, borderRadius: R.md, padding: 11,
    marginBottom: 6, borderLeftWidth: 4, borderLeftColor: C.green800,
  },
  noteText: { fontSize: T.sm, color: C.green900, lineHeight: 20 },

  sendBtn: {
    marginTop: 14, backgroundColor: C.green900, borderRadius: R.md,
    paddingVertical: 14, alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  sendBtnText: { color: '#fff', fontWeight: T.bold, fontSize: T.base, letterSpacing: 0.3 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: C.card, borderTopLeftRadius: R.lg, borderTopRightRadius: R.lg,
    padding: 22, paddingBottom: 38,
  },
  modalTitle:  { fontSize: T.lg, fontWeight: T.heavy, color: C.text, marginBottom: 16 },
  modalLabel:  { fontSize: T.sm, fontWeight: T.bold, color: C.green900, marginTop: 12, marginBottom: 5 },
  modalInput: {
    borderWidth: 1.5, borderColor: C.borderMid, borderRadius: R.md,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: T.base, color: C.text, backgroundColor: C.stripe,
  },
  modalInputMulti: { height: 72, textAlignVertical: 'top' },
  modalButtons:    { flexDirection: 'row', marginTop: 20, gap: 12 },
  modalCancel: {
    flex: 1, borderRadius: R.md, paddingVertical: 13, alignItems: 'center',
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border,
  },
  modalCancelText: { fontSize: T.base, fontWeight: T.bold, color: C.textMid },
  modalSave: {
    flex: 1, borderRadius: R.md, paddingVertical: 13, alignItems: 'center',
    backgroundColor: C.green900,
  },
  modalSaveText: { fontSize: T.base, fontWeight: T.bold, color: '#fff' },
});
