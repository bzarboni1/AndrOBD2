import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { UserPreferenceProfile } from "../../../types/domain";

type ThemeMode = UserPreferenceProfile["themeMode"];

const MODES: Array<{ value: ThemeMode; label: string; description: string }> = [
  { value: "day", label: "Day", description: "Always light" },
  { value: "night", label: "Night", description: "Always dark" },
  { value: "system", label: "System", description: "Follow device setting" }
];

interface ThemeModeSelectorProps {
  current: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

export function ThemeModeSelector({ current, onChange }: ThemeModeSelectorProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>
      <View style={styles.options}>
        {MODES.map(({ value, label, description }) => (
          <TouchableOpacity
            key={value}
            style={[styles.option, current === value && styles.optionSelected]}
            onPress={() => onChange(value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: current === value }}
          >
            <Text style={[styles.optionLabel, current === value && styles.optionLabelSelected]}>
              {label}
            </Text>
            <Text style={styles.optionDesc}>{description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  options: { flexDirection: "row", gap: 8 },
  option: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    alignItems: "center"
  },
  optionSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  optionLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  optionLabelSelected: { color: "#1d4ed8" },
  optionDesc: { fontSize: 11, color: "#6b7280", marginTop: 2, textAlign: "center" }
});
