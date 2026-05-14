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

const CONDITIONS: { label: string; value: Condition }[] = [
  { label: 'Green', value: 'green' },
  { label: 'Air-dry', value: 'airDry' },
  { label: 'Kiln-dry', value: 'kilnDry' },
];

const CUSTOM_KEY = 'arborist_custom_species';

interface CustomSpecies extends Species {
  isCustom: true;
}

export default function WeightScreen() {
  const [mode, setMode]           = useState<'log' | 'tree'>('log');
  const [category, setCategory]   = useState<Category>('Hardwood');
  const [species, setSpecies]     = useState<Species>(SPECIES[0]);
  const [condition, setCondition] = useState<Condition>('green');

  // log mode
  const [dSmall, setDSmall] = useState('');
  const [dLarge, setDLarge] = useState('');
  const [length, setLength] = useState('');

  // tree mode
  const [dbh, setDbh]       = useState('');
  const [height, setHeight] = useState('');
  const [inLeaf, setInLeaf] = useState(true);

  // region filter
  const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);
  const [showAll, setShowAll] = useState(false);

  // custom species
  const [customSpecies, setCustomSpecies]   = useState<CustomSpecies[]>([]);
  const [modalVisible, setModalVisible]     = useState(false);
  const [newName, setNewName]               = useState('');
  const [newCategory, setNewCategory]       = useState<Category>('Hardwood');
  const [newGreenDensity, setNewGreenDensity] = useState('');
  const [newMor, setNewMor]                 = useState('');
  const [newNotes, setNewNotes]             = useState('');

  useEffect(() => {
    loadRegionAndCustom();
  }, []);

  async function loadRegionAndCustom() {
    const state = await AsyncStorage.getItem('arborist_detected_state');
    if (state && STATE_TO_REGION[state]) {
      setDetectedRegion(STATE_TO_REGION[state] as Region);
    }
    const raw = await AsyncStorage.getItem(CUSTOM_KEY);
    if (raw) {
      try { setCustomSpecies(JSON.parse(raw)); } catch {}
    }
  }

  async function saveCustomSpecies(updated: CustomSpecies[]) {
    setCustomSpecies(updated);
    await AsyncStorage.setItem(CUSTOM_KEY, JSON.stringify(updated));
  }

  function addCustomSpecies() {
    const density = parseFloat(newGreenDensity);
    const mor     = parseFloat(newMor);
    if (!newName.trim()) { Alert.alert('Name required'); return; }
    if (isNaN(density) || density <= 0) { Alert.alert('Enter a valid green density (lbs/ft³)'); return; }
    if (isNaN(mor) || mor <= 0) { Alert.alert('Enter a valid MOR (psi)'); return; }
    const entry: CustomSpecies = {
      name: newName.trim(),
      category: newCategory,
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

  // Build the displayed species list
  const baseFiltered = getByCategory(category);
  const regionFiltered = (detectedRegion && !showAll)
    ? baseFiltered.filter(s => {
        const regions = SPECIES_REGIONS[s.name];
        return regions ? regions.includes(detectedRegion) : true;
      })
    : baseFiltered;

  const customFiltered = customSpecies.filter(s => s.category === category);
  const displaySpecies: Species[] = [...regionFiltered, ...customFiltered];

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
    const first = getByCategory(cat)[0];
    setSpecies(first);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* ── Region banner ─────────────────────────────────── */}
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
        <Text style={styles.sectionLabel}>Species{detectedRegion && !showAll ? ` (${displaySpecies.length - customFiltered.length} regional)` : ''}</Text>
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
                style={[styles.chip, isActive && styles.chipActive, isCustom && styles.chipCustom, isActive && isCustom && styles.chipCustomActive]}
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
          <Text style={styles.sectionLabel}>Leaf/Needle Status</Text>
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
        const leafWt = mode === 'tree'
          ? leafWeightLbs(result.weightLbs, species.category === 'Hardwood', inLeaf)
          : 0;
        const totalWt = result.weightLbs + leafWt;
        return (
          <>
            <ResultCard
              title="Weight Estimate"
              rows={[
                { label: 'Volume', value: `${result.volumeFt3.toFixed(2)} ft³` },
                { label: 'Stem Weight', value: `${result.weightLbs.toFixed(0)} lbs` },
                ...(leafWt > 0 ? [{ label: mode === 'tree' && species.category === 'Softwood' ? 'Needle Weight (~0.8%)' : 'Leaf Weight (~1.3%)', value: `${leafWt.toFixed(0)} lbs` }] : []),
                { label: 'Total Weight', value: `${totalWt.toFixed(0)} lbs` },
                { label: 'Species', value: species.name },
                { label: 'Density', value: `${species.greenLbsPerFt3} lbs/ft³ (green)` },
                { label: 'Condition', value: CONDITIONS.find(c => c.value === condition)?.label ?? '' },
              ]}
            />
            <SafetyBadge level="green" message={`${totalWt.toFixed(0)} lbs total — tap below to send to Rigging`} />
            <TouchableOpacity style={styles.sendBtn} onPress={sendToRigging}>
              <Text style={styles.sendBtnText}>→ Use in Rigging Calculator</Text>
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
              placeholder="e.g. Osage Orange"
              placeholderTextColor="#aaa"
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
              placeholderTextColor="#aaa"
            />

            <Text style={styles.modalLabel}>Green MOR (psi)</Text>
            <TextInput
              style={styles.modalInput}
              value={newMor}
              onChangeText={setNewMor}
              keyboardType="decimal-pad"
              placeholder="e.g. 8000"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.modalLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMulti]}
              value={newNotes}
              onChangeText={setNewNotes}
              placeholder="Field notes, habitat, hazards…"
              placeholderTextColor="#aaa"
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
  container:    { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 16, marginBottom: 6 },
  segment:      { marginBottom: 8 },

  regionBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#e8f5e9', borderRadius: 8, padding: 10, marginBottom: 12,
    borderLeftWidth: 3, borderLeftColor: '#2e7d32',
  },
  regionBannerText: { fontSize: 12, color: '#2e7d32', fontWeight: '600', flex: 1 },
  regionToggle:     { fontSize: 12, color: '#1565c0', fontWeight: '600', marginLeft: 8 },

  speciesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addBtn: {
    backgroundColor: '#e8f5e9', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: '#a5d6a7',
  },
  addBtnText: { fontSize: 12, color: '#2e7d32', fontWeight: '600' },

  chipRow:    { flexDirection: 'row', marginBottom: 4 },
  chipWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginRight: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  chipActive:       { backgroundColor: '#2e7d32' },
  chipCustom:       { backgroundColor: '#e3f2fd', borderWidth: 1, borderColor: '#90caf9' },
  chipCustomActive: { backgroundColor: '#1565c0', borderColor: '#1565c0' },
  chipText:         { fontSize: 13, color: '#333' },
  chipTextActive:   { color: '#fff', fontWeight: '600' },
  chipDelete: {
    marginLeft: -8, marginTop: -4,
    backgroundColor: '#ef5350', borderRadius: 10,
    width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
  },
  chipDeleteText: { color: '#fff', fontSize: 10, fontWeight: '700', lineHeight: 18 },

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

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 20, paddingBottom: 36,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  modalLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginTop: 12, marginBottom: 4 },
  modalInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 15, color: '#1a1a1a', backgroundColor: '#fafafa',
  },
  modalInputMulti: { height: 70, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', marginTop: 20, gap: 12 },
  modalCancel: {
    flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: '#555' },
  modalSave: {
    flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: 'center',
    backgroundColor: '#2e7d32',
  },
  modalSaveText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
