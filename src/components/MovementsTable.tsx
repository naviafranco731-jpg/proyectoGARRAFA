import { StyleSheet, Text, View } from 'react-native';

export type Movement = {
  id: number;
  date: string;
  type: 'Salida' | 'Retorno';
  quantity: number;
  truck: string;
};

type Props = { movements: Movement[] };

export default function MovementsTable({ movements }: Props) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.bold, { flex: 1.6 }]}>Fecha</Text>
        <Text style={[styles.cell, styles.bold, { flex: 1 }]}>Tipo</Text>
        <Text style={[styles.cell, styles.bold, styles.center, { flex: 0.6 }]}>Cant.</Text>
        <Text style={[styles.cell, styles.bold, styles.right, { flex: 1.1 }]}>Camión</Text>
      </View>

      {movements.map((m) => (
        <View key={m.id} style={styles.row}>
          <Text style={[styles.cell, { flex: 1.6 }]}>{m.date}</Text>
          <Text style={[styles.cell, styles.bold, { flex: 1, color: m.type === 'Salida' ? '#ef4444' : '#22c55e' }]}>{m.type}</Text>
          <Text style={[styles.cell, styles.bold, styles.center, { flex: 0.6 }]}>{m.quantity}</Text>
          <Text style={[styles.cell, styles.right, styles.truck, { flex: 1.1 }]}>{m.truck}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e9f0', borderRadius: 16, padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eef0f5' },
  header: { backgroundColor: '#f1f3f8', borderRadius: 10, borderBottomWidth: 0 },
  cell: { fontSize: 15, color: '#1b2a4a' },
  bold: { fontWeight: '700' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  truck: { color: '#6b7280' },
});
