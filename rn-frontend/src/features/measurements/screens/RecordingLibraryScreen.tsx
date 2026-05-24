import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { nativeBridge } from "../../../services/nativeBridge";
import { useRecordingExport } from "../hooks/useRecordingExport";
import { validateRecording } from "../utils/recordingValidation";

import type { MeasurementRecording } from "../../../types/domain";

export function RecordingLibraryScreen(): React.JSX.Element {
  const [recordings, setRecordings] = useState<MeasurementRecording[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { exportRecording, isExporting, lastError: exportError, exportedFileUri } = useRecordingExport();

  const loadRecording = useCallback(async (fileUri: string): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const raw = await nativeBridge.loadRecording(fileUri);
      const validation = validateRecording(raw);
      if (!validation.valid) {
        setLoadError(`Cannot load recording: ${validation.reason}`);
        return;
      }
      setRecordings((prev) => {
        const exists = prev.some((r) => r.recordingId === validation.recording.recordingId);
        return exists ? prev : [...prev, validation.recording];
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load recording.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function renderItem({ item }: { item: MeasurementRecording }): React.JSX.Element {
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.recordingName}</Text>
          <Text style={styles.cardMeta}>
            {item.sampleCount} samples · {item.isLegacyFormat ? "Legacy" : "Modern"} ·{" "}
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => exportRecording(item.recordingId)}
          disabled={isExporting}
        >
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recordings</Text>

      {(loadError || exportError) ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{loadError ?? exportError}</Text>
        </View>
      ) : null}

      {exportedFileUri ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>Exported to: {exportedFileUri}</Text>
        </View>
      ) : null}

      {isLoading && <ActivityIndicator style={styles.loader} />}

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.recordingId}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No recordings loaded.</Text>
            <Text style={styles.emptyHint}>
              Use "Load Recording" to open a saved measurement file.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.loadButton}
        onPress={() => loadRecording("user-picker")}
        disabled={isLoading}
      >
        <Text style={styles.loadButtonText}>Load Recording…</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  errorBanner: { backgroundColor: "#fee2e2", borderRadius: 8, padding: 12, marginBottom: 12 },
  errorText: { color: "#dc2626" },
  successBanner: { backgroundColor: "#dcfce7", borderRadius: 8, padding: 12, marginBottom: 12 },
  successText: { color: "#15803d", fontSize: 12 },
  loader: { marginVertical: 8 },
  list: { gap: 10, paddingBottom: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  cardMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  exportButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2563eb",
    borderRadius: 6
  },
  exportButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", paddingTop: 48 },
  emptyText: { fontSize: 15, color: "#6b7280" },
  emptyHint: { fontSize: 12, color: "#9ca3af", marginTop: 6, textAlign: "center" },
  loadButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
    marginTop: 8
  },
  loadButtonText: { color: "#fff", fontWeight: "600" }
});
