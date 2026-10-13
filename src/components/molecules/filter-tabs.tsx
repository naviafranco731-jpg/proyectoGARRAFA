import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '../atoms/theme';

export type FilterTabItem<T extends string> = {
  key: T;
  label: string;
  count?: number;
};

export type FilterTabsProps<T extends string> = {
  items: FilterTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function FilterTabs<T extends string>({ items, value, onChange }: FilterTabsProps<T>) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item.key)}
            style={styles.tab}>
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
              {typeof item.count === 'number' ? ` (${item.count})` : ''}
            </Text>
            <View style={[styles.indicator, active && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    backgroundColor: Palette.surface,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  tab: {
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.subtitle,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  labelActive: {
    color: Palette.primary,
  },
  indicator: {
    height: 2,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: Palette.primary,
  },
});
