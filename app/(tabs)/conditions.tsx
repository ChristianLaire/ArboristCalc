import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { assessHeat, calcDaylight, dayOfYear } from '@/math/environmental';
import { CITIES, MONTHS, City } from '@/data/locations';

const DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];

export default function ConditionsScreen() {
  // --- Heat Index ---
  const [tempF, setTempF] = useState('');
  const [rh, setRh] = useState('');

  // --- Daylight ---
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[7]); // Atlanta default
  const [cityFilter, setCityFilter] = useState('');
  const [monthIdx, setMonthIdx] = useState(new Date().getMonth()); // 0-based
  const [dayNum, setDayNum] = useState(String(new Date().getDate()));

  const heatResult = (() => {
    const t = parseFloat(tempF);
    const r = parseFloat(rh);
    if (isNaN(t) || isNaN(r) || r < 0 || r > 100) return null;
    return assessHeat(t, r);
  })();

  const daylightResult = (() => {
    const d = parseInt(dayNum);
    const maxDay = DAYS_IN_MONTH[monthIdx];
    if (isNaN(d) || d < 1 || d > maxDay) return null;
    return calcDaylight(selectedCity.lat, dayOfYear(monthIdx + 1, d));
  })();

  const filteredCities = cityFilter.length > 0
    ? CITIES.filter(c => c.name.toLowerCase().startsWith(cityFilter.toLowerCase()))
    : CITIES;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* ── Heat Index ───────────────────────────────────── */}
      <Text style={styles.heading}>Heat Index & Worker Safety</Text>
      <Text style={styles.subheading}>OSHA heat exposure standard — measured in shade</Text>

      <NumericInput label="Air Temperature" unit="°F" value={tempF} onChangeText={setTempF} />
      <NumericInput label="Relative Humidity" unit="%" value={rh} onChangeText={setRh} placeholder="50" />

      {heatResult && (
        <>
          <ResultCard
            title="Heat Assessment"
            rows={[
              { label: 'Heat Index', value: `${heatResult.displayTemp.toFixed(0)}°F` },
              { label: 'Risk Level', value: heatResult.label },
            ]}
          />
          <SafetyBadge level={heatResult.level} message={heatResult.action} />
        </>
      )}

      <View style={styles.divider} />

      {/* ── Daylight Hours ──────────────────────────────── */}
      <Text style={styles.heading}>Working Daylight</Text>
      <Text style={styles.subheading}>Sunrise / sunset by location and date</Text>

      <Text style={styles.sectionLabel}>Location</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {filteredCities.map(c => (
          <TouchableOpacity
            key={`${c.name}-${c.state}`}
            style={[styles.chip, selectedCity.name === c.name && selectedCity.state === c.state && styles.chipActive]}
            onPress={() => setSelectedCity(c)}
          >
            <Text style={[styles.chipText, selectedCity.name === c.name && selectedCity.state === c.state && styles.chipTextActive]}>
              {c.name}, {c.state}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.latRow}>
        <Text style={styles.latLabel}>Latitude: {selectedCity.lat.toFixed(1)}°N</Text>
        <Text style={styles.latLabel}>— or enter custom below</Text>
      </View>

      <Text style={styles.sectionLabel}>Month</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {MONTHS.map((m, i) => (
          <TouchableOpacity
            key={m}
            style={[styles.chip, monthIdx === i && styles.chipActive]}
            onPress={() => setMonthIdx(i)}
          >
            <Text style={[styles.chipText, monthIdx === i && styles.chipTextActive]}>{m.slice(0, 3)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <NumericInput
        label={`Day (1–${DAYS_IN_MONTH[monthIdx]})`}
        value={dayNum}
        onChangeText={setDayNum}
        placeholder={String(new Date().getDate())}
      />

      {daylightResult && (
        <>
          {daylightResult.polarNight ? (
            <SafetyBadge level="red" message="Polar night — no daylight on this date at this latitude." />
          ) : daylightResult.polarDay ? (
            <SafetyBadge level="green" message="Midnight sun — 24 hours of daylight." />
          ) : (
            <>
              <ResultCard
                title={`Daylight — ${selectedCity.name} — ${MONTHS[monthIdx]} ${dayNum}`}
                rows={[
                  { label: 'Sunrise (solar)', value: daylightResult.sunriseLocal },
                  { label: 'Sunset (solar)',  value: daylightResult.sunsetLocal },
                  { label: 'Total Daylight',  value: `${daylightResult.daylightHours.toFixed(1)} hrs` },
                  { label: 'Working Window',  value: `${daylightResult.workingHours.toFixed(1)} hrs` },
                ]}
              />
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  Working window deducts 30 min each end for setup and breakdown.
                  Times shown are local solar noon-based — add/subtract for your timezone offset.
                </Text>
              </View>
            </>
          )}
        </>
      )}

      <View style={styles.divider} />

      {/* ── Field Reference ─────────────────────────────── */}
      <Text style={styles.heading}>Field Reference</Text>

      <View style={styles.refCard}>
        <Text style={styles.refTitle}>Frozen Wood (Gerhards 1982, USDA FPL)</Text>
        {[
          ['Above 33°F', 'No correction'],
          ['20–33°F', '+20% MOR — surface freeze'],
          ['0–20°F', '+40% MOR — column frozen'],
          ['-20–0°F', '+60% MOR — deep freeze'],
          ['Below -20°F', '+80% MOR — extreme cold'],
        ].map(([temp, effect]) => (
          <View key={temp} style={styles.refRow}>
            <Text style={styles.refTemp}>{temp}</Text>
            <Text style={styles.refEffect}>{effect}</Text>
          </View>
        ))}
        <Text style={styles.refNote}>
          Apply correction in Anchor tab → Temperature field. Frozen green wood gains strength as water crystallizes in cell structure.
        </Text>
      </View>

      <View style={styles.refCard}>
        <Text style={styles.refTitle}>Seasonal Leaf Weight (Chojnacky et al. 2014)</Text>
        {[
          ['Deciduous in leaf', '~1.3% of total tree weight'],
          ['Conifer with needles', '~0.8% of total tree weight'],
          ['Deciduous dormant', 'No leaf weight'],
        ].map(([cond, val]) => (
          <View key={cond} style={styles.refRow}>
            <Text style={styles.refTemp}>{cond}</Text>
            <Text style={styles.refEffect}>{val}</Text>
          </View>
        ))}
        <Text style={styles.refNote}>
          Leaf weight applied automatically in Weight tab → Whole Tree mode when "In Leaf" is toggled on.
        </Text>
      </View>

      <View style={styles.refCard}>
        <Text style={styles.refTitle}>Synthetic Rope Temperature (Samson / Petzl)</Text>
        {[
          ['Below -40°F', 'Stiffening; knot integrity — inspect carefully'],
          ['-40°F to 200°F', 'Full rated WLL — polyester safe operating range'],
          ['200–390°F', 'Strength loss begins — friction/heat during lowering'],
          ['Above 390°F', 'Catastrophic failure zone'],
        ].map(([temp, effect]) => (
          <View key={temp} style={styles.refRow}>
            <Text style={styles.refTemp}>{temp}</Text>
            <Text style={styles.refEffect}>{effect}</Text>
          </View>
        ))}
        <Text style={styles.refNote}>
          Ambient temperature rarely affects WLL in arboriculture. Primary rope heat concern is friction during controlled descents — use redirects and friction devices to manage.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  heading: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginTop: 8, marginBottom: 2 },
  subheading: { fontSize: 12, color: '#888', marginBottom: 12 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 12, marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 24 },
  chipRow: { flexDirection: 'row', marginBottom: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8,
  },
  chipActive: { backgroundColor: '#2e7d32' },
  chipText: { fontSize: 13, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  latRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  latLabel: { fontSize: 12, color: '#888' },
  noteBox: {
    backgroundColor: '#f1f8e9', borderRadius: 8, padding: 10,
    marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#2e7d32',
  },
  noteText: { fontSize: 12, color: '#33691e', lineHeight: 18 },
  refCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 14, borderWidth: 1, borderColor: '#e0e0e0',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  refTitle: { fontSize: 13, fontWeight: '700', color: '#2e7d32', marginBottom: 10 },
  refRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  refTemp: { fontSize: 12, color: '#555', flex: 1 },
  refEffect: { fontSize: 12, fontWeight: '600', color: '#1a1a1a', flex: 1.4, textAlign: 'right' },
  refNote: { fontSize: 11, color: '#888', marginTop: 8, lineHeight: 16, fontStyle: 'italic' },
});
