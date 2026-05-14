import { View, Text, StyleSheet } from 'react-native';
import { C, T, R } from '@/theme';

interface Row {
  label: string;
  value: string;
}

interface Props {
  title: string;
  rows: Row[];
}

export default function ResultCard({ title, rows }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.titleBar} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {rows.map((row, i) => (
        <View key={i} style={[styles.row, i % 2 === 1 && styles.rowAlt]}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: R.md,
    marginTop: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  titleBar: {
    width: 4,
    height: 18,
    backgroundColor: C.green800,
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    fontSize: T.md,
    fontWeight: T.heavy,
    color: C.green900,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rowAlt: {
    backgroundColor: C.stripe,
  },
  rowLabel: {
    fontSize: T.base,
    color: C.textMid,
    flex: 1,
  },
  rowValue: {
    fontSize: T.base,
    fontWeight: T.bold,
    color: C.text,
    textAlign: 'right',
    marginLeft: 12,
  },
});
