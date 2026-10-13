import { Modal, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from './button';
import { Icon } from './icon';
import { FontSize, ModalShadow, Palette, Radius, Spacing } from './theme';

export type SuccessModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
};

export function SuccessModal({
  visible,
  title = '¡Reclamo registrado!',
  message = 'El reclamo fue registrado correctamente. Nuestro equipo de atención al cliente lo atenderá a la brevedad.',
  confirmLabel = 'Aceptar',
  onConfirm,
}: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onConfirm}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="checkCircle" size={44} color={Palette.success} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <PrimaryButton label={confirmLabel} onPress={onConfirm} style={styles.button} />
        </View>
      </View>
    </Modal>
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
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    ...ModalShadow,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: Radius.pill,
    backgroundColor: Palette.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.subtitle,
    lineHeight: 21,
    color: Palette.textSecondary,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.sm,
  },
});
