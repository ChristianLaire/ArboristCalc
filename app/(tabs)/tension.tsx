import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TensionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Module 3 — Rope Tension &amp; MA</Text>
      <Text style={styles.sub}>Coming in Step 6</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  placeholder: { fontSize: 20, fontWeight: '700', color: '#2e7d32' },
  sub: { marginTop: 8, fontSize: 14, color: '#888' },
});
