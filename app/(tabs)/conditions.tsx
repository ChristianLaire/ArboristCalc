import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { assessHeat, calcDaylight, dayOfYear } from '@/math/environmental';
import { CITIES, MONTHS, City, nearestCity } from '@/data/locations';

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const UA = { 'User-Agent': 'ArboristCalc/1.0 (arborist field safety app)' };

interface WeatherSource {
  label: string;
  tempF: number;
  rhPct: number;
}

type WeatherStatus = 'idle' | 'loading' | 'ok' | 'partial' | 'error';

// Verbose fetch wrapper — logs every request, status, and timing to console
async function verboseFetch(url: string, options: RequestInit & { verbose: boolean } = { verbose: true }): Promise<Response> {
  const { verbose, ...init } = options;
  const t0 = Date.now();
  if (verbose) console.log(`[ArboristCalc] → ${url}`);
  try {
    const res = await fetch(url, init);
    if (verbose) console.log(`[ArboristCalc] ← ${res.status} ${res.statusText} (${Date.now() - t0}ms) ${url}`);
    return res;
  } catch (err) {
    if (verbose) console.error(`[ArboristCalc] ✗ FAILED (${Date.now() - t0}ms) ${url}`, err);
    throw err;
  }
}

// NWS real-time observation from the nearest ASOS/AWOS station
async function fetchNWSObservation(stationsUrl: string): Promise<WeatherSource> {
  const stRes = await verboseFetch(stationsUrl, { verbose: true, headers: UA });
  if (!stRes.ok) throw new Error('stations');
  const stJson = await stRes.json();
  const stationId: string = stJson.features[0].properties.stationIdentifier;

  const obsUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;
  const obsRes = await verboseFetch(obsUrl, { verbose: true, headers: UA });
  if (!obsRes.ok) throw new Error('obs');
  const obs = await obsRes.json();

  const tempC: number | null = obs.properties.temperature.value;
  if (tempC === null) throw new Error('null temp');
  const rh: number = obs.properties.relativeHumidity?.value ?? 50;

  console.log(`[ArboristCalc] NWS Station ${stationId}: ${(tempC * 9/5 + 32).toFixed(1)}°F / ${rh.toFixed(0)}% RH`);
  return { label: 'NWS Station', tempF: Math.round(tempC * 9 / 5 + 32), rhPct: Math.round(rh) };
}

// NWS hourly forecast — current period (fallback when no live obs)
async function fetchNWSForecast(forecastUrl: string): Promise<WeatherSource> {
  const res = await verboseFetch(forecastUrl, { verbose: true, headers: UA });
  if (!res.ok) throw new Error('forecast');
  const json = await res.json();
  const p = json.properties.periods[0];
  console.log(`[ArboristCalc] NWS Forecast period: ${p.name} — ${p.temperature}°F / ${p.relativeHumidity?.value ?? '?'}% RH`);
  return {
    label: 'NWS Forecast',
    tempF: p.temperature,
    rhPct: Math.round(p.relativeHumidity?.value ?? 50),
  };
}

// Open-Meteo — free, no API key, global coverage
async function fetchOpenMeteo(lat: number, lon: number): Promise<WeatherSource> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit&timezone=auto`;
  const res = await verboseFetch(url, { verbose: true });
  if (!res.ok) throw new Error('open-meteo');
  const json = await res.json();
  console.log(`[ArboristCalc] Open-Meteo: ${json.current.temperature_2m}°F / ${json.current.relative_humidity_2m}% RH`);
  return {
    label: 'Open-Meteo',
    tempF: Math.round(json.current.temperature_2m),
    rhPct: Math.round(json.current.relative_humidity_2m),
  };
}

export default function ConditionsScreen() {
  const [gpsLat, setGpsLat]     = useState<number | null>(null);
  const [gpsLon, setGpsLon]     = useState<number | null>(null);
  const [gpsLabel, setGpsLabel] = useState('');
  const [weatherStatus, setWeatherStatus] = useState<WeatherStatus>('idle');
  const [weatherError, setWeatherError]   = useState('');
  const [sources, setSources]   = useState<WeatherSource[]>([]);

  const [tempF, setTempF] = useState('');
  const [rh, setRh]       = useState('');

  const [selectedCity, setSelectedCity] = useState<City>(CITIES.find(c => c.name === 'Atlanta')!);
  const [cityFilter, setCityFilter]     = useState('');
  const [monthIdx, setMonthIdx]         = useState(new Date().getMonth());
  const [dayNum, setDayNum]             = useState(String(new Date().getDate()));

  useEffect(() => { fetchLocationAndWeather(); }, []);

  async function fetchLocationAndWeather() {
    setWeatherStatus('loading');
    setWeatherError('');
    setSources([]);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setWeatherStatus('error');
      setWeatherError('Location access denied — enter temperature and humidity manually.');
      return;
    }

    let coords: { latitude: number; longitude: number };
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      coords = loc.coords;
    } catch {
      setWeatherStatus('error');
      setWeatherError('Could not get GPS fix — enter values manually.');
      return;
    }

    const { latitude, longitude } = coords;
    setGpsLat(latitude);
    setGpsLon(longitude);

    // Fallback label from our list while NWS responds
    const nearest = nearestCity(latitude, longitude);
    setGpsLabel(`${nearest.name}, ${nearest.state}`);
    setSelectedCity(nearest);

    // --- Fetch NWS points first (gives us town name + URLs for obs/forecast) ---
    let stationsUrl = '';
    let forecastUrl = '';
    let nwsAvailable = false;

    try {
      const pointsRes = await verboseFetch(
        `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`,
        { verbose: true, headers: UA }
      );
      if (pointsRes.ok) {
        const pJson = await pointsRes.json();
        // NWS provides the actual town name — more precise than our nearest-city lookup
        const nwsCity: string  = pJson.properties?.relativeLocation?.properties?.city  ?? '';
        const nwsState: string = pJson.properties?.relativeLocation?.properties?.state ?? '';
        if (nwsCity) setGpsLabel(`${nwsCity}, ${nwsState}`);

        stationsUrl  = pJson.properties.observationStations ?? '';
        forecastUrl  = pJson.properties.forecastHourly      ?? '';
        nwsAvailable = true;
      }
    } catch { /* NWS points failed — outside US or network error */ }

    // --- Parallel fetch: NWS obs + Open-Meteo (+ NWS forecast as 3rd option) ---
    const fetches: Promise<WeatherSource>[] = [fetchOpenMeteo(latitude, longitude)];
    if (nwsAvailable && stationsUrl) fetches.push(fetchNWSObservation(stationsUrl));
    if (nwsAvailable && forecastUrl) fetches.push(fetchNWSForecast(forecastUrl));

    const results = await Promise.allSettled(fetches);
    const fulfilled: WeatherSource[] = [];

    for (const r of results) {
      if (r.status === 'fulfilled') fulfilled.push(r.value);
    }

    // Prefer NWS Station observation over forecast when both succeed
    const deduplicated: WeatherSource[] = [];
    const hasStation = fulfilled.some(s => s.label === 'NWS Station');
    for (const s of fulfilled) {
      if (s.label === 'NWS Forecast' && hasStation) continue; // station supersedes forecast
      deduplicated.push(s);
    }

    setSources(deduplicated);

    if (deduplicated.length > 0) {
      // Consensus: average all sources
      const avgTemp = Math.round(deduplicated.reduce((a, s) => a + s.tempF, 0) / deduplicated.length);
      const avgRh   = Math.round(deduplicated.reduce((a, s) => a + s.rhPct, 0) / deduplicated.length);
      setTempF(String(avgTemp));
      setRh(String(avgRh));
      setWeatherStatus(deduplicated.length >= 2 ? 'ok' : 'partial');
    } else {
      setWeatherStatus('error');
      setWeatherError('Weather services unavailable — enter temperature and humidity manually.');
    }
  }

  const heatResult = (() => {
    const t = parseFloat(tempF);
    const r = parseFloat(rh);
    if (isNaN(t) || isNaN(r) || r < 0 || r > 100) return null;
    return assessHeat(t, r);
  })();

  const activeLat = gpsLat ?? selectedCity.lat;

  const daylightResult = (() => {
    const d = parseInt(dayNum);
    const maxDay = DAYS_IN_MONTH[monthIdx];
    if (isNaN(d) || d < 1 || d > maxDay) return null;
    return calcDaylight(activeLat, dayOfYear(monthIdx + 1, d));
  })();

  const filteredCities = cityFilter.length > 1
    ? CITIES.filter(c => `${c.name} ${c.state}`.toLowerCase().includes(cityFilter.toLowerCase()))
    : CITIES;

  const bannerStyle = weatherStatus === 'ok'      ? styles.bannerOk
                    : weatherStatus === 'partial'  ? styles.bannerPartial
                    : weatherStatus === 'error'    ? styles.bannerError
                    : styles.bannerLoading;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* ── Location / Weather Banner ─────────────────────── */}
      <View style={[styles.banner, bannerStyle]}>
        <View style={styles.bannerTop}>
          {weatherStatus === 'loading' ? (
            <View style={styles.bannerRow}>
              <ActivityIndicator size="small" color="#1565c0" style={{ marginRight: 8 }} />
              <Text style={styles.bannerTextBlue}>Detecting location and fetching weather…</Text>
            </View>
          ) : weatherStatus === 'ok' || weatherStatus === 'partial' ? (
            <Text style={styles.bannerTextGreen}>
              📍 {gpsLabel}{weatherStatus === 'partial' ? ' — 1 source' : ' — conditions loaded'}
            </Text>
          ) : weatherStatus === 'error' ? (
            <Text style={styles.bannerTextError}>⚠ {weatherError}</Text>
          ) : null}

          {weatherStatus !== 'loading' && (
            <TouchableOpacity onPress={fetchLocationAndWeather} style={styles.retryBtn}>
              <Text style={styles.retryText}>↻ Refresh</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Source chips */}
        {sources.length > 0 && (
          <View style={styles.sourceRow}>
            {sources.map(s => (
              <View key={s.label} style={styles.sourceChip}>
                <Text style={styles.sourceChipText}>
                  {s.label}: {s.tempF}°F / {s.rhPct}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

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
              { label: 'Heat Index',  value: `${heatResult.displayTemp.toFixed(0)}°F` },
              { label: 'Risk Level',  value: heatResult.label },
            ]}
          />
          <SafetyBadge level={heatResult.level} message={heatResult.action} />
        </>
      )}

      <View style={styles.divider} />

      {/* ── Daylight Hours ──────────────────────────────── */}
      <Text style={styles.heading}>Working Daylight</Text>
      <Text style={styles.subheading}>
        {gpsLat != null
          ? `GPS: ${gpsLat.toFixed(3)}°N, ${Math.abs(gpsLon ?? 0).toFixed(3)}°W — ${gpsLabel}`
          : 'Sunrise / sunset by location and date'}
      </Text>

      {/* City picker — shown only when GPS isn't available */}
      {gpsLat == null && (
        <>
          <Text style={styles.sectionLabel}>Search Location</Text>
          <NumericInput
            label="City or state"
            value={cityFilter}
            onChangeText={setCityFilter}
            placeholder="e.g. Portland, OR"
            keyboardType="default"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {filteredCities.slice(0, 40).map(c => (
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
          {filteredCities.length > 40 && (
            <Text style={styles.filterHint}>Showing 40 of {filteredCities.length} — type to narrow</Text>
          )}
          <Text style={styles.latLabel}>Latitude: {selectedCity.lat.toFixed(2)}°N</Text>
        </>
      )}

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
                title={`Daylight — ${gpsLat != null ? gpsLabel : `${selectedCity.name}, ${selectedCity.state}`} — ${MONTHS[monthIdx]} ${dayNum}`}
                rows={[
                  { label: 'Sunrise (solar)', value: daylightResult.sunriseLocal },
                  { label: 'Sunset (solar)',  value: daylightResult.sunsetLocal  },
                  { label: 'Total Daylight',  value: `${daylightResult.daylightHours.toFixed(1)} hrs` },
                  { label: 'Working Window',  value: `${daylightResult.workingHours.toFixed(1)} hrs`  },
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
          ['Above 33°F',   'No correction'],
          ['20–33°F',      '+20% MOR — surface freeze'],
          ['0–20°F',       '+40% MOR — column frozen'],
          ['-20–0°F',      '+60% MOR — deep freeze'],
          ['Below -20°F',  '+80% MOR — extreme cold'],
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
          ['Deciduous in leaf',    '~1.3% of total tree weight'],
          ['Conifer with needles', '~0.8% of total tree weight'],
          ['Deciduous dormant',    'No leaf weight'],
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
          ['Below -40°F',     'Stiffening; knot integrity — inspect carefully'],
          ['-40°F to 200°F',  'Full rated WLL — polyester safe operating range'],
          ['200–390°F',       'Strength loss begins — friction/heat during lowering'],
          ['Above 390°F',     'Catastrophic failure zone'],
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
  container:    { padding: 16, paddingBottom: 48 },
  heading:      { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginTop: 8, marginBottom: 2 },
  subheading:   { fontSize: 12, color: '#888', marginBottom: 12 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 12, marginBottom: 6 },
  divider:      { height: 1, backgroundColor: '#e0e0e0', marginVertical: 24 },
  filterHint:   { fontSize: 11, color: '#aaa', marginBottom: 4 },
  latLabel:     { fontSize: 12, color: '#888', marginBottom: 4 },
  chipRow: { flexDirection: 'row', marginBottom: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f0f0f0', marginRight: 8, marginBottom: 8,
  },
  chipActive:     { backgroundColor: '#2e7d32' },
  chipText:       { fontSize: 13, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  noteBox: {
    backgroundColor: '#f1f8e9', borderRadius: 8, padding: 10,
    marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#2e7d32',
  },
  noteText: { fontSize: 12, color: '#33691e', lineHeight: 18 },

  // Banner
  banner: {
    borderRadius: 8, padding: 12, marginBottom: 16,
    borderWidth: 1,
  },
  bannerLoading: { backgroundColor: '#e3f2fd', borderColor: '#90caf9' },
  bannerOk:      { backgroundColor: '#f1f8e9', borderColor: '#a5d6a7' },
  bannerPartial: { backgroundColor: '#fffde7', borderColor: '#ffe082' },
  bannerError:   { backgroundColor: '#fff8e1', borderColor: '#ffe082' },
  bannerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  bannerTextBlue:  { fontSize: 13, color: '#1565c0', flex: 1 },
  bannerTextGreen: { fontSize: 13, color: '#2e7d32', fontWeight: '600', flex: 1 },
  bannerTextError: { fontSize: 13, color: '#e65100', flex: 1 },
  retryBtn: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 6, backgroundColor: '#e0e0e0', marginLeft: 8,
  },
  retryText: { fontSize: 12, color: '#333', fontWeight: '600' },

  // Source chips
  sourceRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  sourceChip: {
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: '#c8e6c9',
  },
  sourceChipText: { fontSize: 11, color: '#2e7d32', fontWeight: '600' },

  // Field reference
  refCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 14, borderWidth: 1, borderColor: '#e0e0e0',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  refTitle:  { fontSize: 13, fontWeight: '700', color: '#2e7d32', marginBottom: 10 },
  refRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  refTemp:   { fontSize: 12, color: '#555', flex: 1 },
  refEffect: { fontSize: 12, fontWeight: '600', color: '#1a1a1a', flex: 1.4, textAlign: 'right' },
  refNote:   { fontSize: 11, color: '#888', marginTop: 8, lineHeight: 16, fontStyle: 'italic' },
});
