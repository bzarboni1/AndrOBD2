import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { LiveDataSample } from "../../../types/domain";

interface LiveDataTableProps {
  samples: LiveDataSample[];
}

export function LiveDataTable({ samples }: LiveDataTableProps): React.JSX.Element {
  if (samples.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No live data samples yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerCell, styles.pidCol]}>PID</Text>
        <Text style={[styles.cell, styles.headerCell, styles.labelCol]}>Label</Text>
        <Text style={[styles.cell, styles.headerCell, styles.valueCol]}>Value</Text>
        <Text style={[styles.cell, styles.headerCell, styles.unitCol]}>Unit</Text>
      </View>
      {samples.map((s, i) => (
        <View key={`${s.pid}-${i}`} style={[styles.row, i % 2 === 1 && styles.rowAlt]}>
          <Text style={[styles.cell, styles.pidCol, styles.pidText]}>{s.pid}</Text>
          <Text style={[styles.cell, styles.labelCol]}>{s.label}</Text>
          <Text style={[styles.cell, styles.valueCol, styles.valueText]}>
            {s.value.toFixed(2)}
          </Text>
          <Text style={[styles.cell, styles.unitCol, styles.unitText]}>{s.unit}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#6b7280" },
  header: { flexDirection: "row", backgroundColor: "#f3f4f6", paddingVertical: 8 },
  row: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  rowAlt: { backgroundColor: "#fafafa" },
  cell: { paddingHorizontal: 8, fontSize: 13, color: "#374151" },
  headerCell: { fontWeight: "700", color: "#111827" },
  pidCol: { width: 72 },
  labelCol: { flex: 1 },
  valueCol: { width: 80, textAlign: "right" },
  unitCol: { width: 56, textAlign: "right" },
  pidText: { fontFamily: "monospace", color: "#6b7280" },
  valueText: { fontWeight: "600", color: "#1d4ed8" },
  unitText: { color: "#9ca3af" }
});
