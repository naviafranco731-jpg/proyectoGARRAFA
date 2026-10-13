import { StyleSheet, TextInput } from "react-native";

type CampoTextoProps = {
  valor: string;
  placeholder: string;
  onChangeText: (texto: string) => void;
  seguro?: boolean;
};

export default function CampoTexto({
  valor,
  placeholder,
  onChangeText,
  seguro = false,
}: CampoTextoProps) {
  return (
    <TextInput
      style={styles.input}
      value={valor}
      placeholder={placeholder}
      onChangeText={onChangeText}
      secureTextEntry={seguro}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
