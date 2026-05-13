import { View, Text, StyleSheet } from 'react-native';

export type SafetyLevel = 'green' | 'yellow' | 'red';

interface Props {
  level: SafetyLevel;
  message: string;
}

const CONFIG: Record<SafetyLevel, { bg: string; text: string; border: string }> = {
  green:  { bg: '#e8f5e9', text: '#1b5e20', border: '#2e7d32' },
  yellow: { bg: '#fff8e1', text: '#e65100', border: '#f9a825' },
  red:    { bg: '#ffebee', text: '#b71c1c', border: '#c62828' },
};

export default function SafetyBadge({ level, message }: Props) {
  const c = CONFIG[level];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.text, { color: c.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
