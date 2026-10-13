import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from './icon';
import { fieldStyles as f } from './styles';
import { FontSize, ModalShadow, Palette, Radius, Spacing } from './theme';

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectFieldProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
};

export function SelectField({
  label,
  placeholder = 'Seleccionar',
  options,
  value,
  onChange,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={f.field}>
      {label ? <Text style={f.label}>{label}</Text> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [f.input, pressed && f.pressed]}>
        <Text style={[f.inputText, !selected && f.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="chevronDown" size={18} color={Palette.textMuted} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{label ?? 'Seleccionar'}</Text>
            <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange?.(option.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                      {option.label}
                    </Text>
                    {active ? <Icon name="check" size={18} color={Palette.primary} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16,42,67,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...ModalShadow,
  },
  sheetTitle: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  list: {
    maxHeight: 320,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  optionPressed: {
    backgroundColor: Palette.surfaceMuted,
  },
  optionLabel: {
    fontSize: FontSize.body,
    color: Palette.textSecondary,
  },
  optionLabelActive: {
    color: Palette.textPrimary,
    fontWeight: '700',
  },
});
