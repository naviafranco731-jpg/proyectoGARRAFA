import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from './icon';
import { FontSize, Palette, Spacing } from './theme';

export type BottomNavKey = 'inicio' | 'camiones' | 'rutas' | 'garrafas' | 'mas';

type NavItem = {
  key: BottomNavKey;
  label: string;
  icon: IconName;
};

const ITEMS: NavItem[] = [
  { key: 'inicio', label: 'Inicio', icon: 'home' },
  { key: 'camiones', label: 'Camiones', icon: 'truck' },
  { key: 'rutas', label: 'Rutas', icon: 'route' },
  { key: 'garrafas', label: 'Garrafas', icon: 'bottle' },
  { key: 'mas', label: 'Más', icon: 'more' },
];

export type BottomNavProps = {
  active: BottomNavKey;
  onChange?: (key: BottomNavKey) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      {ITEMS.map((item) => {
        const focused = item.key === active;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            onPress={() => onChange?.(item.key)}
            style={styles.item}>
            <Icon
              name={item.icon}
              size={22}
              color={focused ? Palette.primary : Palette.textMuted}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Palette.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  labelActive: {
    color: Palette.primary,
  },
});
