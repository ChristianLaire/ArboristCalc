import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AnchorScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.placeholder}>Module 4 — Anchor Rating</Text>
      <Text style={styles.sub}>Coming in Step 7</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  placeholder: { fontSize: 20, fontWeight: '700', color: '#2e7d32' },
  sub: { marginTop: 8, fontSize: 14, color: '#888' },
});
