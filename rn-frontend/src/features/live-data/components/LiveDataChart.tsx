import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { LiveDataSample } from "../../../types/domain";

interface LiveDataChartProps {
  samples: LiveDataSample[];
}

// Minimal sparkline bar chart renderer — no third-party charting lib required.
// Each PID is rendered as a horizontal bar scaled to the max observed value.
export function LiveDataChart({ samples }: LiveDataChartProps): React.JSX.Element {
  if (samples.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No live data samples yet.</Text>
      </View>
    );
  }

  // Latest sample per PID
  const latestByPid = new Map<string, LiveDataSample>();
  for (const s of samples) {
    latestByPid.set(s.pid, s);
  }
  const latest = Array.from(latestByPid.values());
  const maxValue = Math.max(...latest.map((s) => Math.abs(s.value)), 1);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {latest.map((s) => {
        const barPct = Math.min(Math.abs(s.value) / maxValue, 1);
        return (
          <View key={s.pid} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.pidText}>{s.pid}</Text>
              <Text style={styles.labelText}>{s.label}</Text>
              <Text style={styles.valueText}>
                {s.value.toFixed(2)} {s.unit}
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { width: `${barPct * 100}%` }]} />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#6b7280" },
  row: { gap: 4 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pidText: { fontFamily: "monospace", fontSize: 12, color: "#6b7280", width: 56 },
  labelText: { flex: 1, fontSize: 13, color: "#374151" },
  valueText: { fontSize: 13, fontWeight: "700", color: "#1d4ed8" },
  barTrack: { height: 10, backgroundColor: "#e5e7eb", borderRadius: 5, overflow: "hidden" },
  bar: { height: "100%", backgroundColor: "#3b82f6", borderRadius: 5 }
});
