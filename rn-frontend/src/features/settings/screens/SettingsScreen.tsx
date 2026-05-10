import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { usePreferences } from "../hooks/usePreferences";
import { ThemeModeSelector } from "../components/ThemeModeSelector";
import { ResetPreselectionsAction } from "../components/ResetPreselectionsAction";

const DATA_VIEW_OPTIONS = [
  { value: "table", label: "Table" },
  { value: "chart", label: "Chart" },
  { value: "dashboard", label: "Dashboard" },
  { value: "hud", label: "HUD" }
] as const;

export function SettingsScreen(): React.JSX.Element {
  const { preferences, isLoading, lastError, setPreference, reload } = usePreferences();

  if (isLoading && !preferences) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {lastError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      ) : null}

      {/* Theme */}
      <View style={styles.section}>
        <ThemeModeSelector
          current={preferences?.themeMode ?? "system"}
          onChange={(mode) => setPreference("themeMode", mode)}
        />
      </View>

      {/* Preferred data view */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Default Data View</Text>
        <View style={styles.optionRow}>
          {DATA_VIEW_OPTIONS.map(({ value, label }) => {
            const isSelected = (preferences?.preferredDataView ?? "table") === value;
            return (
              <Text
                key={value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setPreference("preferredDataView", value)}
              >
                {label}
              </Text>
            );
          })}
        </View>
      </View>

      {/* Locale */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Language</Text>
        <Text style={styles.localeValue}>{preferences?.locale ?? "en"}</Text>
        <Text style={styles.localeHint}>
          Language can be changed from your device system settings.
        </Text>
      </View>

      {/* Reset preselections */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Reset Preselections</Text>
        <ResetPreselectionsAction onComplete={reload} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { flex: 1 },
  container: { padding: 24, gap: 24 },
  heading: { fontSize: 24, fontWeight: "bold" },
  errorBanner: { backgroundColor: "#fee2e2", padding: 12, borderRadius: 8 },
  errorText: { color: "#dc2626" },
  section: { gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  optionRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    fontSize: 13,
    color: "#374151"
  },
  chipSelected: { borderColor: "#2563eb", backgroundColor: "#eff6ff", color: "#1d4ed8" },
  localeValue: { fontSize: 15, fontWeight: "600", color: "#111827" },
  localeHint: { fontSize: 12, color: "#9ca3af" }
});
