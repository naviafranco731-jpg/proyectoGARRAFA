import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PlantillaPrincipal() {
  const [nombre, setNombre] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Prueba de componentes</Text>

      {/* Átomo: Texto */}
      <View style={styles.seccion}>
        <Text style={styles.etiqueta}>Texto</Text>
        <Text style={styles.texto}>¡El componente de texto funciona!</Text>
      </View>

      {/* Átomo: Campo de texto */}
      <View style={styles.seccion}>
        <Text style={styles.etiqueta}>Campo de texto</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        {nombre.length > 0 && (
          <Text style={styles.resultado}>Escribiste: {nombre}</Text>
        )}
      </View>

      {/* Átomo: Botón */}
      <View style={styles.seccion}>
        <Text style={styles.etiqueta}>Botón</Text>
        <Pressable
          style={styles.boton}
          onPress={() =>
            Alert.alert("¡Funciona!", "El botón responde correctamente.")
          }
        >
          <Text style={styles.textoBoton}>Probar botón</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F3F4F6",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#2563EB",
  },
  seccion: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 18,
    gap: 12,
  },
  etiqueta: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
  },
  texto: {
    fontSize: 16,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#222222",
  },
  resultado: {
    fontSize: 15,
    color: "#15803D",
  },
  boton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
