
import { StyleSheet, Text, View } from "react-native";

type VehicleCardProps = {
  placa: string;
  conductor: string;
  zona: string;
  estado: "En ruta" | "Entregado" | "Retrasado";
};

export default function VehicleCard({
  placa,
  conductor,
  zona,
  estado,
}: VehicleCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🚚</Text>
        <Text style={styles.placa}>{placa}</Text>
        <Text
          style={[
            styles.estado,
            estado === "En ruta" && styles.enRuta,
            estado === "Entregado" && styles.entregado,
            estado === "Retrasado" && styles.retrasado,
          ]}
        >
          {estado}
        </Text>
      </View>

      <Text style={styles.label}>Conductor</Text>
      <Text style={styles.text}>{conductor}</Text>

      <Text style={styles.label}>Zona</Text>
      <Text style={styles.text}>{zona}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E7EF",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  icon: {
    fontSize: 22,
  },
  placa: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#193B65",
  },
  estado: {
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    fontSize: 11,
    fontWeight: "bold",
  },
  enRuta: {
    backgroundColor: "#DDF5E6",
    color: "#18834C",
  },
  entregado: {
    backgroundColor: "#DCEBFF",
    color: "#2765BD",
  },
  retrasado: {
    backgroundColor: "#FFE1E1",
    color: "#C53A3A",
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: "#7B8798",
  },
  text: {
    marginTop: 3,
    marginBottom: 5,
    fontSize: 14,
    color: "#24344D",
  },
});
