import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { Palette } from './theme';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

export type IconName =
  | 'back'
  | 'home'
  | 'truck'
  | 'route'
  | 'bottle'
  | 'more'
  | 'clock'
  | 'eye'
  | 'eyeOff'
  | 'chevronDown'
  | 'check'
  | 'checkCircle'
  | 'plus'
  | 'userPlus'
  | 'alert'
  | 'user'
  | 'list';

const ICONS: Record<IconName, { ios: string; android: string; web: string }> = {
  back: { ios: 'chevron.left', android: 'arrow_back_ios', web: 'arrow_back_ios' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  truck: { ios: 'truck.box.fill', android: 'local_shipping', web: 'local_shipping' },
  route: { ios: 'map.fill', android: 'map', web: 'map' },
  bottle: { ios: 'flame.fill', android: 'propane_tank', web: 'propane_tank' },
  more: { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  chevronDown: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  checkCircle: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  userPlus: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
  alert: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
  user: { ios: 'person.fill', android: 'person', web: 'person' },
  list: { ios: 'list.bullet', android: 'list', web: 'list' },
};

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 20, color = Palette.textPrimary, style }: IconProps) {
  return (
    <SymbolView
      name={ICONS[name] as SymbolName}
      size={size}
      tintColor={color}
      style={style}
    />
  );
}
