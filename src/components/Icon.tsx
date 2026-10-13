import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type FeatherName = ComponentProps<typeof Feather>['name'];

const names = {
  plus: 'plus',
  check: 'check',
  chevron: 'chevron-right',
  search: 'search',
  eye: 'eye',
  edit: 'edit-2',
  trash: 'trash-2',
  user: 'user',
  home: 'home',
  truck: 'truck',
  pin: 'map-pin',
  database: 'database',
  more: 'more-horizontal',
  message: 'message-square',
  chart: 'bar-chart-2',
  alert: 'alert-triangle',
  xcircle: 'x-circle',
} satisfies Record<string, FeatherName>;

export type IconName = keyof typeof names;

type Props = { name: IconName; size?: number; color?: string };

export default function Icon({ name, size = 24, color = '#1b2a4a' }: Props) {
  return <Feather name={names[name]} size={size} color={color} />;
}
