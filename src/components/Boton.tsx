import { Pressable, StyleSheet, Text } from "react-native";

type BotonProps = {
  texto: string;
  onPress: () => void;
};

export default function Boton({ texto, onPress }: BotonProps) {
  return (
    <Pressable style={styles.boton} onPress={onPress}>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  texto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
