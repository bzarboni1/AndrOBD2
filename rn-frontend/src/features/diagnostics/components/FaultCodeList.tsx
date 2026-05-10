import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface FaultCode {
  code: string;
  description?: string;
  status?: string;
}

interface FaultCodeListProps {
  codes: FaultCode[];
  emptyMessage?: string;
}

export function FaultCodeList({
  codes,
  emptyMessage = "No fault codes found."
}: FaultCodeListProps): React.JSX.Element {
  if (codes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      {codes.map((item, index) => (
        <View key={`${item.code}-${index}`} style={styles.row}>
          <View style={styles.codeChip}>
            <Text style={styles.codeText}>{item.code}</Text>
          </View>
          <View style={styles.detail}>
            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : (
              <Text style={styles.unknownDescription}>Unknown fault code</Text>
            )}
            {item.status ? <Text style={styles.status}>{item.status}</Text> : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { color: "#6b7280", fontSize: 14 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb"
  },
  codeChip: {
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    minWidth: 72,
    alignItems: "center"
  },
  codeText: { fontFamily: "monospace", fontSize: 13, fontWeight: "700", color: "#92400e" },
  detail: { flex: 1 },
  description: { fontSize: 14, color: "#111827" },
  unknownDescription: { fontSize: 14, color: "#9ca3af", fontStyle: "italic" },
  status: { fontSize: 12, color: "#6b7280", marginTop: 2 }
});
