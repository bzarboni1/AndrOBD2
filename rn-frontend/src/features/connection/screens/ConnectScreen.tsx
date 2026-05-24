import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useConnectionActions } from "../hooks/useConnectionActions";
import { TransportSelector } from "../components/TransportSelector";
import { useSessionStore } from "../../../state/sessionStore";

import type { TransportType } from "../../../types/domain";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../app/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Connect">;

export function ConnectScreen({ navigation: _navigation }: Props): React.JSX.Element {
  const { session } = useSessionStore();
  const { connect, disconnect, isLoading, lastError } = useConnectionActions();
  const [selectedTransport, setSelectedTransport] = useState<TransportType>("bluetooth");

  const isConnected = session?.status === "connected";

  async function handleConnect(): Promise<void> {
    await connect(selectedTransport);
  }

  async function handleDisconnect(): Promise<void> {
    if (session?.sessionId) {
      await disconnect(session.sessionId);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vehicle Connection</Text>

      {lastError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      ) : null}

      {isConnected ? (
        <View style={styles.connectedCard}>
          <Text style={styles.connectedLabel}>Connected via {session?.transportType}</Text>
          <Text style={styles.sessionId}>Session: {session?.sessionId}</Text>
        </View>
      ) : (
        <TransportSelector selected={selectedTransport} onSelect={setSelectedTransport} />
      )}

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : isConnected ? (
        <TouchableOpacity style={[styles.button, styles.disconnectButton]} onPress={handleDisconnect}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  errorBanner: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  errorText: { color: "#dc2626" },
  connectedCard: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24
  },
  connectedLabel: { fontSize: 16, fontWeight: "600", color: "#15803d" },
  sessionId: { fontSize: 12, color: "#166534", marginTop: 4 },
  loader: { marginTop: 32 },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center"
  },
  disconnectButton: { backgroundColor: "#dc2626" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});
