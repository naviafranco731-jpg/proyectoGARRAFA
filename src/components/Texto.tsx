import { StyleSheet, Text } from "react-native";

type TextoProps = {
  texto: string;
  tamano?: number;
};

export default function Texto({ texto, tamano = 16 }: TextoProps) {
  return <Text style={[styles.texto, { fontSize: tamano }]}>{texto}</Text>;
}

const styles = StyleSheet.create({
  texto: {
    color: "#222222",
  },
});
