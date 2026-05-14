import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import { assessHeat, calcDaylight, dayOfYear } from '@/math/environmental';
import { CITIES, MONTHS, City, nearestCity } from '@/data/locations';
import { STATE_TO_REGION } from '@/data/speciesRanges';
import { FF, T, R, TOUCH_TARGET, ColorPalette } from '@/theme';
import { useColors, useTheme, ThemeMode } from '@/context/ThemeContext';

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const UA = { 'User-Agent': 'ArboristCalc/1.0 (arborist field safety app)' };

interface WeatherSource {
  label: string;
  tempF: number;
  rhPct: number;
}

type WeatherStatus = 'idle' | 'loading' | 'ok' | 'partial' | 'error';

const MODE_ICONS: Record<ThemeMode, string> = { light: '☀', dark: '🌙', auto: '⚙' };
const MODE_CYCLE: ThemeMode[] = ['auto', 'light', 'dark'];

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

async function fetchNWSObservation(stationsUrl: string): Promise<WeatherSource> {
  const stRes = await verboseFetch(stationsUrl, { verbose: true, headers: UA });
  if (!stRes.ok) throw new Error('stations');
  const stJson = await stRes.json();
  const stationId: string = stJson.features[0].properties.stationIdentifier;
  const obsRes = await verboseFetch(`https://api.weather.gov/stations/${stationId}/observations/latest`, { verbose: true, headers: UA });
  if (!obsRes.ok) throw new Error('obs');
  const obs = await obsRes.json();
  const tempC: number | null = obs.properties.temperature.value;
  if (tempC === null) throw new Error('null temp');
  const rh: number = obs.properties.relativeHumidity?.value ?? 50;
  return { label: 'NWS Station', tempF: Math.round(tempC * 9 / 5 + 32), rhPct: Math.round(rh) };
}

async function fetchNWSForecast(forecastUrl: string): Promise<WeatherSource> {
  const res = await verboseFetch(forecastUrl, { verbose: true, headers: UA });
  if (!res.ok) throw new Error('forecast');
  const json = await res.json();
  const p = json.properties.periods[0];
  return { label: 'NWS Forecast', tempF: p.temperature, rhPct: Math.round(p.relativeHumidity?.value ?? 50) };
}

async function fetchOpenMeteo(lat: number, lon: number): Promise<WeatherSource> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit&timezone=auto`;
  const res = await verboseFetch(url, { verbose: true });
  if (!res.ok) throw new Error('open-meteo');
  const json = await res.json();
  return { label: 'Open-Meteo', tempF: Math.round(json.current.temperature_2m), rhPct: Math.round(json.current.relative_humidity_2m) };
}

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    screen:       { backgroundColor: C.bg },
    container:    { padding: 16, paddingBottom: 56 },
    heading:      { fontSize: T.lg, fontFamily: FF.heavy, color: C.text, marginTop: 8, marginBottom: 3, letterSpacing: 0.1 },
    subheading:   { fontSize: T.sm, fontFamily: FF.normal, color: C.textLight, marginBottom: 14 },
    sectionLabel: { fontSize: T.base, fontFamily: FF.bold, color: C.green900, marginTop: 16, marginBottom: 8 },
    divider:      { height: 1, backgroundColor: C.border, marginVertical: 28 },
    filterHint:   { fontSize: T.xs, fontFamily: FF.normal, color: C.textLight, marginBottom: 6 },
    latLabel:     { fontSize: T.sm, fontFamily: FF.normal, color: C.textMid, marginBottom: 6 },

    // Dark mode toggle
    themeRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: C.card, borderRadius: R.md, padding: 14,
      borderWidth: 1, borderColor: C.border, marginBottom: 20,
    },
    themeLabel: { fontSize: T.sm, fontFamily: FF.bold, color: C.text },
    themeSubLabel: { fontSize: T.xs, fontFamily: FF.normal, color: C.textMid, marginTop: 2 },
    themeButtons: { flexDirection: 'row', gap: 8 },
    themeBtn: {
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.pill,
      borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg,
      minWidth: 52, alignItems: 'center',
    },
    themeBtnActive: { backgroundColor: C.green900, borderColor: C.green900 },
    themeBtnText:   { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid },
    themeBtnTextActive: { color: '#fff' },

    chipRow: { flexDirection: 'row', marginBottom: 4 },
    chip: {
      paddingHorizontal: 14, paddingVertical: 10, borderRadius: R.pill,
      backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border,
      marginRight: 8, marginBottom: 8,
    },
    chipActive:     { backgroundColor: C.green900, borderColor: C.green900 },
    chipText:       { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid },
    chipTextActive: { color: '#fff', fontFamily: FF.bold },

    noteBox: {
      backgroundColor: C.green50, borderRadius: R.md, padding: 12,
      marginTop: 10, borderLeftWidth: 4, borderLeftColor: C.green800,
    },
    noteText: { fontSize: T.sm, fontFamily: FF.normal, color: C.green900, lineHeight: 20 },

    // Weather banner
    banner: { borderRadius: R.md, padding: 13, marginBottom: 20, borderLeftWidth: 5 },
    bannerLoading: { backgroundColor: C.importBg,  borderLeftColor: C.importBorder },
    bannerOk:      { backgroundColor: C.green50,   borderLeftColor: C.green800 },
    bannerPartial: { backgroundColor: C.orange50,  borderLeftColor: C.orange700 },
    bannerError:   { backgroundColor: C.orange50,  borderLeftColor: C.orange700 },

    bannerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bannerRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    bannerTextBlue:  { fontSize: T.sm, fontFamily: FF.semibold, color: C.importText, flex: 1 },
    bannerTextGreen: { fontSize: T.sm, fontFamily: FF.bold, color: C.green900, flex: 1 },
    bannerTextError: { fontSize: T.sm, fontFamily: FF.semibold, color: C.orange700, flex: 1 },

    retryBtn: {
      paddingHorizontal: 12, paddingVertical: 8, minHeight: 36,
      borderRadius: R.pill, backgroundColor: 'rgba(128,128,128,0.12)', marginLeft: 10,
    },
    retryText: { fontSize: T.sm, fontFamily: FF.bold, color: C.textMid },

    sourceRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
    sourceChip: {
      backgroundColor: C.card, borderRadius: R.pill,
      paddingHorizontal: 12, paddingVertical: 5,
      borderWidth: 1, borderColor: C.green100,
    },
    sourceChipText: { fontSize: T.xs + 1, fontFamily: FF.bold, color: C.green900 },

    // Field reference cards
    refCard: {
      backgroundColor: C.card, borderRadius: R.md, padding: 15,
      marginBottom: 14, borderWidth: 1, borderColor: C.border,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
    },
    refTitle:  { fontSize: T.sm, fontFamily: FF.heavy, color: C.green900, marginBottom: 10, letterSpacing: 0.1 },
    refRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border },
    refTemp:   { fontSize: T.sm, fontFamily: FF.normal, color: C.textMid, flex: 1 },
    refEffect: { fontSize: T.sm, fontFamily: FF.bold, color: C.text, flex: 1.4, textAlign: 'right' },
    refNote:   { fontSize: T.xs + 1, fontFamily: FF.normal, color: C.textLight, marginTop: 9, lineHeight: 18, fontStyle: 'italic' },
  });
}

export default function ConditionsScreen() {
  const C = useColors();
  const { mode, setMode } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [gpsLat, setGpsLat]     = useState<number | null>(null);
  const [gpsLon, setGpsLon]     = useState<number | null>(null);
  const [gpsLabel, setGpsLabel] = useState('');
  const [weatherStatus, setWeatherStatus] = useState<WeatherStatus>('idle');
  const [weatherError, setWeatherError]   = useState('');
  const [sources, setSources]             = useState<WeatherSource[]>([]);

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

    const nearest = nearestCity(latitude, longitude);
    setGpsLabel(`${nearest.name}, ${nearest.state}`);
    setSelectedCity(nearest);

    let stationsUrl = '', forecastUrl = '', nwsAvailable = false;

    try {
      const pointsRes = await verboseFetch(
        `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`,
        { verbose: true, headers: UA }
      );
      if (pointsRes.ok) {
        const pJson = await pointsRes.json();
        const nwsCity:  string = pJson.properties?.relativeLocation?.properties?.city  ?? '';
        const nwsState: string = pJson.properties?.relativeLocation?.properties?.state ?? '';
        if (nwsCity) setGpsLabel(`${nwsCity}, ${nwsState}`);

        const stateAbbr = pJson.properties?.relativeLocation?.properties?.state ?? '';
        if (stateAbbr && STATE_TO_REGION[stateAbbr]) {
          await AsyncStorage.setItem('arborist_detected_state', stateAbbr);
        }

        stationsUrl  = pJson.properties.observationStations ?? '';
        forecastUrl  = pJson.properties.forecastHourly      ?? '';
        nwsAvailable = true;
      }
    } catch { /* outside US or network error */ }

    const fetches: Promise<WeatherSource>[] = [fetchOpenMeteo(latitude, longitude)];
    if (nwsAvailable && stationsUrl) fetches.push(fetchNWSObservation(stationsUrl));
    if (nwsAvailable && forecastUrl) fetches.push(fetchNWSForecast(forecastUrl));

    const results     = await Promise.allSettled(fetches);
    const fulfilled: WeatherSource[] = [];
    for (const r of results) if (r.status === 'fulfilled') fulfilled.push(r.value);

    const hasStation   = fulfilled.some(s => s.label === 'NWS Station');
    const deduplicated = fulfilled.filter(s => !(s.label === 'NWS Forecast' && hasStation));
    setSources(deduplicated);

    if (deduplicated.length > 0) {
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
    const t = parseFloat(tempF), r = parseFloat(rh);
    if (isNaN(t) || isNaN(r) || r < 0 || r > 100) return null;
    return assessHeat(t, r);
  })();

  const activeLat = gpsLat ?? selectedCity.lat;

  const daylightResult = (() => {
    const d = parseInt(dayNum), maxDay = DAYS_IN_MONTH[monthIdx];
    if (isNaN(d) || d < 1 || d > maxDay) return null;
    return calcDaylight(activeLat, dayOfYear(monthIdx + 1, d));
  })();

  const filteredCities = cityFilter.length > 1
    ? CITIES.filter(c => `${c.name} ${c.state}`.toLowerCase().includes(cityFilter.toLowerCase()))
    : CITIES;

  const bannerStyle = weatherStatus === 'ok'     ? styles.bannerOk
                    : weatherStatus === 'partial' ? styles.bannerPartial
                    : weatherStatus === 'error'   ? styles.bannerError
                    : styles.bannerLoading;

  const cycleMode = () => {
    const idx = MODE_CYCLE.indexOf(mode);
    setMode(MODE_CYCLE[(idx + 1) % MODE_CYCLE.length]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>

      {/* ── Display Mode ─────────────────────────────────── */}
      <View style={styles.themeRow}>
        <View>
          <Text style={styles.themeLabel}>Display Mode</Text>
          <Text style={styles.themeSubLabel}>71–82% of users prefer dark mode in the field</Text>
        </View>
        <View style={styles.themeButtons}>
          {MODE_CYCLE.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.themeBtn, mode === m && styles.themeBtnActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.themeBtnText, mode === m && styles.themeBtnTextActive]}>
                {MODE_ICONS[m]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Location / Weather Banner ─────────────────────── */}
      <View style={[styles.banner, bannerStyle]}>
        <View style={styles.bannerTop}>
          {weatherStatus === 'loading' ? (
            <View style={styles.bannerRow}>
              <ActivityIndicator size="small" color={C.importText} style={{ marginRight: 10 }} />
              <Text style={styles.bannerTextBlue}>Detecting location and fetching weather…</Text>
            </View>
          ) : weatherStatus === 'ok' || weatherStatus === 'partial' ? (
            <Text style={styles.bannerTextGreen}>
              📍 {gpsLabel}{weatherStatus === 'partial' ? ' — 1 source' : ' — conditions loaded'}
            </Text>
          ) : weatherStatus === 'error' ? (
            <Text style={styles.bannerTextError}>⚠  {weatherError}</Text>
          ) : null}

          {weatherStatus !== 'loading' && (
            <TouchableOpacity onPress={fetchLocationAndWeather} style={styles.retryBtn}>
              <Text style={styles.retryText}>↻ Refresh</Text>
            </TouchableOpacity>
          )}
        </View>

        {sources.length > 0 && (
          <View style={styles.sourceRow}>
            {sources.map(s => (
              <View key={s.label} style={styles.sourceChip}>
                <Text style={styles.sourceChipText}>{s.label}: {s.tempF}°F / {s.rhPct}%</Text>
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
      <Text style={styles.subheading}>
        {gpsLat != null
          ? `GPS: ${gpsLat.toFixed(3)}°N, ${Math.abs(gpsLon ?? 0).toFixed(3)}°W — ${gpsLabel}`
          : 'Sunrise / sunset by location and date'}
      </Text>

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

      {[
        {
          title: 'Frozen Wood (Gerhards 1982, USDA FPL)',
          rows: [
            ['Above 33°F',   'No correction'],
            ['20–33°F',      '+20% MOR — surface freeze'],
            ['0–20°F',       '+40% MOR — column frozen'],
            ['-20–0°F',      '+60% MOR — deep freeze'],
            ['Below -20°F',  '+80% MOR — extreme cold'],
          ],
          note: 'Apply correction in Anchor tab → Temperature field. Frozen green wood gains strength as water crystallizes in cell structure.',
        },
        {
          title: 'Seasonal Leaf Weight (Chojnacky et al. 2014)',
          rows: [
            ['Deciduous in leaf',    '~1.3% of total tree weight'],
            ['Conifer with needles', '~0.8% of total tree weight'],
            ['Deciduous dormant',    'No leaf weight'],
          ],
          note: 'Leaf weight applied automatically in Weight tab → Whole Tree mode when "In Leaf" is toggled on.',
        },
        {
          title: 'Synthetic Rope Temperature (Samson / Petzl)',
          rows: [
            ['Below -40°F',     'Stiffening; knot integrity — inspect carefully'],
            ['-40°F to 200°F',  'Full rated WLL — polyester safe operating range'],
            ['200–390°F',       'Strength loss begins — friction/heat during lowering'],
            ['Above 390°F',     'Catastrophic failure zone'],
          ],
          note: 'Primary rope heat concern is friction during controlled descents — use redirects and friction devices to manage.',
        },
      ].map(card => (
        <View key={card.title} style={styles.refCard}>
          <Text style={styles.refTitle}>{card.title}</Text>
          {card.rows.map(([temp, effect]) => (
            <View key={temp} style={styles.refRow}>
              <Text style={styles.refTemp}>{temp}</Text>
              <Text style={styles.refEffect}>{effect}</Text>
            </View>
          ))}
          <Text style={styles.refNote}>{card.note}</Text>
        </View>
      ))}

    </ScrollView>
  );
}
