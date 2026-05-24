import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { TransportType } from "../../../types/domain";

const TRANSPORTS: Array<{ type: TransportType; label: string; description: string }> = [
  { type: "bluetooth", label: "Bluetooth", description: "ELM327 Bluetooth adapter" },
  { type: "usb", label: "USB", description: "USB OBD-II cable" },
  { type: "wifi", label: "Wi-Fi", description: "ELM327 Wi-Fi adapter" },
  { type: "demo", label: "Demo", description: "Simulated vehicle (no adapter required)" }
];

interface TransportSelectorProps {
  selected: TransportType;
  onSelect: (transport: TransportType) => void;
}

export function TransportSelector({ selected, onSelect }: TransportSelectorProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Connection Type</Text>
      {TRANSPORTS.map(({ type, label, description }) => (
        <TouchableOpacity
          key={type}
          style={[styles.option, selected === type && styles.optionSelected]}
          onPress={() => onSelect(type)}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === type }}
        >
          <View style={styles.optionInner}>
            <Text style={[styles.optionLabel, selected === type && styles.optionLabelSelected]}>
              {label}
            </Text>
            <Text style={styles.optionDescription}>{description}</Text>
          </View>
          {selected === type && <View style={styles.radioFill} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#374151" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 14
  },
  optionSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  optionInner: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: "600", color: "#111827" },
  optionLabelSelected: { color: "#1d4ed8" },
  optionDescription: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  radioFill: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#2563eb" }
});
