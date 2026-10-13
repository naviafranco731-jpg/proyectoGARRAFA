import { StyleSheet, View } from "react-native";
import CampoTexto from "../../CampoTexto";
import Texto from "../../Texto";

type CampoFormularioProps = {
  etiqueta: string;
  valor: string;
  placeholder: string;
  onChangeText: (texto: string) => void;
  seguro?: boolean;
};

export default function CampoFormulario({
  etiqueta,
  valor,
  placeholder,
  onChangeText,
  seguro = false,
}: CampoFormularioProps) {
  return (
    <View style={styles.contenedor}>
      <Texto texto={etiqueta} tamano={14} />
      <CampoTexto
        valor={valor}
        placeholder={placeholder}
        onChangeText={onChangeText}
        seguro={seguro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 8,
    marginBottom: 16,
  },
});
