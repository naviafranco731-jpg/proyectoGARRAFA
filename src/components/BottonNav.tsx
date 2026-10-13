import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon, { type IconName } from './Icon';

export type NavKey = 'inicio' | 'camiones' | 'rutas' | 'garrafas' | 'mas';

const items: { key: NavKey; label: string; icon: IconName }[] = [
  { key: 'inicio', label: 'Inicio', icon: 'home' },
  { key: 'camiones', label: 'Camiones', icon: 'truck' },
  { key: 'rutas', label: 'Rutas', icon: 'pin' },
  { key: 'garrafas', label: 'Garrafas', icon: 'database' },
  { key: 'mas', label: 'Más', icon: 'more' },
];

type Props = { active: NavKey; onSelect?: (key: NavKey) => void };

export default function BottomNav({ active, onSelect }: Props) {
  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const isActive = item.key === active;
        const color = isActive ? '#3a6ea5' : '#9ca3af';
        return (
          <Pressable key={item.key} style={styles.item} onPress={() => onSelect?.(item.key)}>
            <Icon name={item.icon} size={26} color={color} />
            <Text style={[styles.label, { color }, isActive && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', paddingTop: 10, paddingHorizontal: 8, paddingBottom: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e6e9f0' },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 13 },
  labelActive: { fontWeight: '700' },
});
