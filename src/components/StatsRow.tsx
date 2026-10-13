import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = { items: { label: string; value: number | string }[] };

export default function StatsRow({ items }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12 },
  card: { minWidth: 120, gap: 6, padding: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e9f0', borderRadius: 16 },
  label: { fontSize: 14, color: '#5b6577' },
  value: { fontSize: 32, fontWeight: '700', color: '#1b2a4a' },
});
