import { Platform, type ViewStyle } from 'react-native';

export const Palette = {
  primary: '#102A43',
  primaryDark: '#0B1F33',
  primarySoft: '#E7EDF4',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F6F9',
  border: '#E4E7EB',
  borderStrong: '#CBD2D9',
  textPrimary: '#102A43',
  textSecondary: '#52606D',
  textMuted: '#9AA5B1',
  success: '#2E9E5B',
  successSoft: '#E4F5E9',
  warning: '#D98E04',
  warningSoft: '#FDF1D6',
  danger: '#D64545',
  dangerSoft: '#FBE7E7',
  info: '#2678C2',
  infoSoft: '#E3F0FB',
  white: '#FFFFFF',
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const FontSize = {
  title: 22,
  subtitle: 14,
  label: 13,
  body: 15,
  small: 12,
} as const;

export const ContentMaxWidth = 640;

export type BadgeTone = 'pendiente' | 'revision' | 'resuelto';

export const StatusColors: Record<BadgeTone, { background: string; foreground: string }> = {
  pendiente: { background: Palette.warningSoft, foreground: Palette.warning },
  revision: { background: Palette.infoSoft, foreground: Palette.info },
  resuelto: { background: Palette.successSoft, foreground: Palette.success },
};

export const CardShadow: ViewStyle =
  Platform.OS === 'android'
    ? { elevation: 2 }
    : {
        shadowColor: Palette.primary,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      };

export const ModalShadow: ViewStyle =
  Platform.OS === 'android'
    ? { elevation: 12 }
    : {
        shadowColor: '#000000',
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      };
