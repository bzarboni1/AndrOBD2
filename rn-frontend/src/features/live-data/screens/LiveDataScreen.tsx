import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLiveDataStream } from "../hooks/useLiveDataStream";
import { LiveDataTable } from "../components/LiveDataTable";
import { LiveDataChart } from "../components/LiveDataChart";
import { LiveDataDashboard } from "../components/LiveDataDashboard";
import { LiveDataHud } from "../components/LiveDataHud";

type ViewMode = "table" | "chart" | "dashboard" | "hud";

const VIEW_LABELS: Record<ViewMode, string> = {
  table: "Table",
  chart: "Chart",
  dashboard: "Dashboard",
  hud: "HUD"
};

export function LiveDataScreen(): React.JSX.Element {
  const { samples, isStreaming, lastError, startStream, stopStream } = useLiveDataStream();
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <View style={styles.container}>
      {/* View mode selector */}
      <View style={styles.modeBar}>
        {(["table", "chart", "dashboard", "hud"] as ViewMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.modeButton, viewMode === mode && styles.modeButtonActive]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.modeText, viewMode === mode && styles.modeTextActive]}>
              {VIEW_LABELS[mode]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {lastError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      ) : null}

      {/* Data presenter */}
      <View style={styles.presenter}>
        {viewMode === "table" && <LiveDataTable samples={samples} />}
        {viewMode === "chart" && <LiveDataChart samples={samples} />}
        {viewMode === "dashboard" && <LiveDataDashboard samples={samples} />}
        {viewMode === "hud" && <LiveDataHud samples={samples} />}
      </View>

      {/* Stream control */}
      <View style={styles.controls}>
        {isStreaming ? (
          <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={stopStream}>
            <Text style={styles.controlButtonText}>Stop Stream</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.controlButton} onPress={() => startStream()}>
            <Text style={styles.controlButtonText}>Start Stream</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modeBar: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  modeButton: { flex: 1, paddingVertical: 10, alignItems: "center" },
  modeButtonActive: { borderBottomWidth: 2, borderBottomColor: "#2563eb" },
  modeText: { fontSize: 12, color: "#6b7280" },
  modeTextActive: { color: "#2563eb", fontWeight: "600" },
  errorBanner: { backgroundColor: "#fee2e2", padding: 10, margin: 12, borderRadius: 8 },
  errorText: { color: "#dc2626", fontSize: 13 },
  presenter: { flex: 1 },
  controls: { padding: 16, borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  controlButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    alignItems: "center"
  },
  stopButton: { backgroundColor: "#ef4444" },
  controlButtonText: { color: "#fff", fontWeight: "600" }
});
