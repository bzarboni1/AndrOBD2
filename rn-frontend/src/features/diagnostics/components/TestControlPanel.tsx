import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useTestControlActions } from "../hooks/useTestControlActions";

export function TestControlPanel(): React.JSX.Element {
  const { getTestControls, isLoading, lastError, result } = useTestControlActions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Controls</Text>

      {lastError ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={getTestControls} disabled={isLoading}>
        <Text style={styles.buttonText}>Retrieve Test Controls</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator style={styles.loader} />}

      {result && (
        <ScrollView style={styles.resultScroll}>
          <Text style={styles.resultStatus}>
            Status: {result.resultStatus}
            {result.resultStatus === "unsupported" ? " (not supported by vehicle)" : ""}
          </Text>
          {result.resultPayload ? (
            <Text style={styles.resultPayload}>
              {JSON.stringify(result.resultPayload, null, 2)}
            </Text>
          ) : (
            result.resultStatus === "success" && (
              <Text style={styles.emptyText}>No test control data returned.</Text>
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  errorCard: { backgroundColor: "#fee2e2", borderRadius: 8, padding: 12, marginBottom: 12 },
  errorText: { color: "#dc2626" },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  loader: { marginTop: 16 },
  resultScroll: { marginTop: 16, flex: 1 },
  resultStatus: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  resultPayload: { fontFamily: "monospace", fontSize: 12, color: "#374151" },
  emptyText: { color: "#6b7280" }
});
