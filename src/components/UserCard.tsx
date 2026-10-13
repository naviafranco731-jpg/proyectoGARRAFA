import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon, { type IconName } from './Icon';

export type Role = 'Administrador' | 'Conductor' | 'Distribuidor' | 'Personal autorizado';

export type User = {
  id: number;
  name: string;
  phone: string;
  role: Role;
  active: boolean;
};

const roleColor: Record<Role, string> = {
  Administrador: '#1b2a4a',
  Conductor: '#22c55e',
  Distribuidor: '#f59e0b',
  'Personal autorizado': '#9ca3af',
};

type Props = {
  user: User;
  avatarSrc?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

// Parte interna (antes molécula): link con icono
function ActionLink({ icon, label, red, onPress }: { icon: IconName; label: string; red?: boolean; onPress?: () => void }) {
  const color = red ? '#ef4444' : '#3a6ea5';
  return (
    <Pressable style={styles.link} onPress={onPress}>
      <Icon name={icon} size={20} color={color} />
      <Text style={[styles.linkText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export default function UserCard({ user, avatarSrc, onView, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {avatarSrc ? <Image style={styles.avatar} source={{ uri: avatarSrc }} /> : <View style={styles.avatar} />}

        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>

        <View style={styles.side}>
          <View style={[styles.badge, { backgroundColor: roleColor[user.role] }]}>
            <Text style={styles.badgeText}>{user.role}</Text>
          </View>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: user.active ? '#22c55e' : '#9ca3af' }]} />
            <Text style={styles.phone}>{user.active ? 'Activo' : 'Inactivo'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionLink icon="eye" label="Ver" onPress={onView} />
        <ActionLink icon="edit" label="Editar" onPress={onEdit} />
        <ActionLink icon="trash" label="Eliminar" red onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12, padding: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e9f0', borderRadius: 16 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eceff4' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 20, fontWeight: '700', color: '#1b2a4a' },
  phone: { fontSize: 14, color: '#5b6577' },
  side: { alignItems: 'flex-end', gap: 6 },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eef0f5' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkText: { fontSize: 16, fontWeight: '600' },
});
