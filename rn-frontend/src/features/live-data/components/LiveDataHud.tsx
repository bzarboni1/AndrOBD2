import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { LiveDataSample } from "../../../types/domain";

interface LiveDataHudProps {
  samples: LiveDataSample[];
  /** PIDs to feature prominently in HUD mode. Defaults to first 4 available. */
  featuredPids?: string[];
}

export function LiveDataHud({ samples, featuredPids }: LiveDataHudProps): React.JSX.Element {
  if (samples.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No live data samples yet.</Text>
      </View>
    );
  }

  const latestByPid = new Map<string, LiveDataSample>();
  for (const s of samples) {
    latestByPid.set(s.pid, s);
  }

  const pidsToShow =
    featuredPids && featuredPids.length > 0
      ? featuredPids.filter((pid) => latestByPid.has(pid))
      : Array.from(latestByPid.keys()).slice(0, 4);

  return (
    <View style={styles.hudContainer}>
      {pidsToShow.map((pid) => {
        const s = latestByPid.get(pid);
        if (!s) return null;
        return (
          <View key={pid} style={styles.hudTile}>
            <Text style={styles.hudLabel} numberOfLines={1}>
              {s.label}
            </Text>
            <Text style={styles.hudValue} adjustsFontSizeToFit numberOfLines={1}>
              {s.value.toFixed(1)}
            </Text>
            <Text style={styles.hudUnit}>{s.unit}</Text>
          </View>
        );
      })}
      <ScrollView style={styles.remaining} contentContainerStyle={styles.remainingContent}>
        {Array.from(latestByPid.values())
          .filter((s) => !pidsToShow.includes(s.pid))
          .map((s) => (
            <View key={s.pid} style={styles.smallRow}>
              <Text style={styles.smallPid}>{s.pid}</Text>
              <Text style={styles.smallLabel}>{s.label}</Text>
              <Text style={styles.smallValue}>
                {s.value.toFixed(2)} {s.unit}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: { flex: 1, backgroundColor: "#0f172a" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a" },
  emptyText: { color: "#64748b" },
  hudTile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b"
  },
  hudLabel: { fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  hudValue: { fontSize: 48, fontWeight: "900", color: "#38bdf8" },
  hudUnit: { fontSize: 16, color: "#64748b", marginTop: 4 },
  remaining: { maxHeight: 160, backgroundColor: "#1e293b" },
  remainingContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  smallRow: { flexDirection: "row", alignItems: "center" },
  smallPid: { fontFamily: "monospace", fontSize: 11, color: "#475569", width: 56 },
  smallLabel: { flex: 1, fontSize: 12, color: "#94a3b8" },
  smallValue: { fontSize: 13, fontWeight: "600", color: "#38bdf8" }
});
