import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import Boton from "../Boton";
import Texto from "../Texto";
import CampoFormulario from "./molecules/CampoFormulario";

export default function FormularioLogin() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  return (
    <View style={styles.contenedor}>
      <Texto texto="Iniciar sesión" tamano={24} />

      <CampoFormulario
        etiqueta="Usuario"
        valor={usuario}
        placeholder="Ingresa tu usuario"
        onChangeText={setUsuario}
      />

      <CampoFormulario
        etiqueta="Contraseña"
        valor={contrasena}
        placeholder="Ingresa tu contraseña"
        onChangeText={setContrasena}
        seguro
      />

      <Boton
        texto="Ingresar"
        onPress={() => {
          if (!usuario.trim() || !contrasena) {
            Alert.alert("Aviso", "Completa todos los campos");
            return;
          }

          Alert.alert("Formulario", "Datos ingresados");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    gap: 16,
  },
});
