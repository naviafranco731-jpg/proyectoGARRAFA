import { StyleSheet } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from './theme';

export const fieldStyles = StyleSheet.create({
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
  },
  inputFocused: {
    borderColor: Palette.primary,
  },
  inputText: {
    flex: 1,
    fontSize: FontSize.body,
    color: Palette.textPrimary,
    paddingVertical: 0,
  },
  placeholder: {
    color: Palette.textMuted,
  },
  textArea: {
    minHeight: 116,
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  textAreaText: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.6,
  },
});
