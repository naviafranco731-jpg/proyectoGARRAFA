import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing, StatusColors, type BadgeTone } from './theme';

export type StatusBadgeProps = {
  tone: BadgeTone;
  label: string;
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const colors = StatusColors[tone];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.background, borderColor: colors.foreground },
      ]}>
      <View style={[styles.dot, { backgroundColor: colors.foreground }]} />
      <Text style={[styles.text, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
  text: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
});
