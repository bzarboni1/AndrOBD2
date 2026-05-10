import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSessionStore } from "../../../state/sessionStore";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../app/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props): React.JSX.Element {
  const { session } = useSessionStore();
  const isConnected = session?.status === "connected";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AndrOBD</Text>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, isConnected ? styles.dotConnected : styles.dotDisconnected]} />
        <Text style={styles.statusText}>
          {isConnected ? `Connected (${session?.transportType})` : "Not connected"}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Connect")}>
        <Text style={styles.buttonText}>{isConnected ? "Manage Connection" : "Connect to Vehicle"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isConnected && styles.buttonDisabled]}
        disabled={!isConnected}
        onPress={() => navigation.navigate("DiagnosticsHome")}
      >
        <Text style={styles.buttonText}>Diagnostics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isConnected && styles.buttonDisabled]}
        disabled={!isConnected}
        onPress={() => navigation.navigate("LiveData")}
      >
        <Text style={styles.buttonText}>Live Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Measurements")}>
        <Text style={styles.buttonText}>Measurements</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  dotConnected: { backgroundColor: "#22c55e" },
  dotDisconnected: { backgroundColor: "#ef4444" },
  statusText: { fontSize: 14 },
  button: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center"
  },
  buttonDisabled: { backgroundColor: "#94a3b8" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});
