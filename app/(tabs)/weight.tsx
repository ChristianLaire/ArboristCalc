import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WeightScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Module 1 — Tree / Log Weight</Text>
      <Text style={styles.sub}>Coming in Step 4</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  placeholder: { fontSize: 20, fontWeight: '700', color: '#2e7d32' },
  sub: { marginTop: 8, fontSize: 14, color: '#888' },
});
