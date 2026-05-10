import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { usePluginActions } from "../hooks/usePluginActions";

import type { ExtensionModuleState } from "../../../types/domain";

const STATUS_COLORS: Record<ExtensionModuleState["compatibilityStatus"], string> = {
  compatible: "#22c55e",
  degraded: "#f59e0b",
  incompatible: "#ef4444"
};

export function PluginManagerScreen(): React.JSX.Element {
  const { plugins, isLoading, lastError, loadPlugins, invokeAction, lastActionResult } = usePluginActions();

  useEffect(() => {
    loadPlugins().catch(() => undefined);
  }, [loadPlugins]);

  function renderPlugin({ item }: { item: ExtensionModuleState }): React.JSX.Element {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.pluginName}>{item.displayName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[item.compatibilityStatus] }
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.compatibilityStatus}</Text>
          </View>
        </View>
        <Text style={styles.pluginId}>{item.moduleId}</Text>
        <Text style={styles.initResult}>
          Init: {item.lastInitializationResult}
          {item.isEnabled ? " · Enabled" : " · Disabled"}
        </Text>
        {item.lastError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Error: {item.lastError}</Text>
          </View>
        ) : null}
        {item.isEnabled && item.compatibilityStatus !== "incompatible" && (
          <TouchableOpacity
            style={styles.invokeButton}
            onPress={() => invokeAction(item.moduleId, "default")}
          >
            <Text style={styles.invokeButtonText}>Invoke</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Plugins</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadPlugins} disabled={isLoading}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {lastError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{lastError}</Text>
        </View>
      ) : null}

      {lastActionResult ? (
        <View style={styles.resultBanner}>
          <Text style={styles.resultText}>
            Last action: {JSON.stringify(lastActionResult)}
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={plugins}
          keyExtractor={(item) => item.moduleId}
          renderItem={renderPlugin}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No plugins installed.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  heading: { flex: 1, fontSize: 22, fontWeight: "bold" },
  refreshButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#f3f4f6"
  },
  refreshText: { fontWeight: "600", color: "#374151" },
  errorBanner: { backgroundColor: "#fee2e2", borderRadius: 8, padding: 12, marginBottom: 12 },
  errorBannerText: { color: "#dc2626" },
  resultBanner: { backgroundColor: "#dcfce7", borderRadius: 8, padding: 10, marginBottom: 10 },
  resultText: { fontSize: 12, color: "#15803d" },
  loader: { marginTop: 24 },
  list: { gap: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 6
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  pluginName: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  statusBadgeText: { fontSize: 11, color: "#fff", fontWeight: "600" },
  pluginId: { fontFamily: "monospace", fontSize: 11, color: "#9ca3af" },
  initResult: { fontSize: 12, color: "#6b7280" },
  errorCard: { backgroundColor: "#fee2e2", borderRadius: 6, padding: 8 },
  errorText: { color: "#dc2626", fontSize: 12 },
  invokeButton: {
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#2563eb",
    alignItems: "center"
  },
  invokeButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  empty: { alignItems: "center", paddingTop: 48 },
  emptyText: { color: "#6b7280" }
});
