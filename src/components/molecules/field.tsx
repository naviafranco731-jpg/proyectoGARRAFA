import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Icon, type IconName } from '../atoms/icon';
import { fieldStyles as f } from '../atoms/styles';
import { FontSize, Palette, Spacing } from '../atoms/theme';

type BaseFieldProps = TextInputProps & {
  label?: string;
  rightIcon?: IconName;
  rightIconColor?: string;
  onRightIconPress?: () => void;
  multiline?: boolean;
};

function BaseField({
  label,
  rightIcon,
  rightIconColor,
  onRightIconPress,
  multiline,
  style,
  ...props
}: BaseFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={f.field}>
      {label ? <Text style={f.label}>{label}</Text> : null}
      <View style={[f.input, focused && f.inputFocused, multiline && f.textArea]}>
        <TextInput
          {...props}
          multiline={multiline}
          style={[f.inputText, multiline && f.textAreaText, style]}
          placeholderTextColor={Palette.textMuted}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
        />
        {rightIcon ? (
          onRightIconPress ? (
            <Pressable hitSlop={8} onPress={onRightIconPress}>
              <Icon name={rightIcon} size={18} color={rightIconColor ?? Palette.textMuted} />
            </Pressable>
          ) : (
            <Icon name={rightIcon} size={18} color={rightIconColor ?? Palette.textMuted} />
          )
        ) : null}
      </View>
    </View>
  );
}

export type TextFieldProps = TextInputProps & { label?: string };

export function TextField(props: TextFieldProps) {
  return <BaseField {...props} />;
}

export function NumberField({ label, ...props }: TextFieldProps) {
  return <BaseField label={label} keyboardType="number-pad" {...props} />;
}

export function TimeField({ label, placeholder = 'HH:MM', ...props }: TextFieldProps) {
  return (
    <BaseField
      label={label}
      placeholder={placeholder}
      rightIcon="clock"
      keyboardType="numbers-and-punctuation"
      {...props}
    />
  );
}

export function TextAreaField({ label, ...props }: TextFieldProps) {
  return <BaseField label={label} multiline {...props} />;
}

export function PasswordField({ label = 'Contraseña', ...props }: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <BaseField
      label={label}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightIcon={visible ? 'eyeOff' : 'eye'}
      onRightIconPress={() => setVisible((value) => !value)}
      {...props}
    />
  );
}

export type SwitchFieldProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SwitchField({ label, description, value, onValueChange }: SwitchFieldProps) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.switchText}>
        <Text style={f.label}>{label}</Text>
        {description ? <Text style={styles.switchDescription}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Palette.borderStrong, true: Palette.primary }}
        thumbColor={Palette.white}
        ios_backgroundColor={Palette.borderStrong}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  switchDescription: {
    fontSize: FontSize.small,
    color: Palette.textMuted,
  },
});
