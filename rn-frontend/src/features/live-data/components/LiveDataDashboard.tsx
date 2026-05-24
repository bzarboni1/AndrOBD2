import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { LiveDataSample } from "../../../types/domain";

interface LiveDataDashboardProps {
  samples: LiveDataSample[];
}

export function LiveDataDashboard({ samples }: LiveDataDashboardProps): React.JSX.Element {
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

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {latest.map((s) => (
        <View key={s.pid} style={styles.card}>
          <Text style={styles.cardLabel} numberOfLines={1}>
            {s.label}
          </Text>
          <Text style={styles.cardValue} adjustsFontSizeToFit numberOfLines={1}>
            {s.value.toFixed(1)}
          </Text>
          <Text style={styles.cardUnit}>{s.unit}</Text>
          <Text style={styles.cardPid}>{s.pid}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    gap: 8
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#6b7280" },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    gap: 2
  },
  cardLabel: { fontSize: 11, color: "#6b7280", textAlign: "center" },
  cardValue: { fontSize: 32, fontWeight: "800", color: "#1d4ed8", marginVertical: 4 },
  cardUnit: { fontSize: 13, color: "#374151" },
  cardPid: { fontSize: 10, fontFamily: "monospace", color: "#d1d5db", marginTop: 4 }
});
