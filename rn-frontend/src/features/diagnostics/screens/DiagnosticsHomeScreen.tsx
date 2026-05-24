import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useDiagnosticActions } from "../hooks/useDiagnosticActions";
import { FaultCodeList } from "../components/FaultCodeList";
import { ClearCodesConfirmDialog } from "../components/ClearCodesConfirmDialog";
import { FreezeFramePanel } from "../components/FreezeFramePanel";
import { TestControlPanel } from "../components/TestControlPanel";
import { useSessionStore } from "../../../state/sessionStore";
import { checkActionEligibility } from "../utils/actionEligibility";

import type { DiagnosticServiceAction } from "../../../types/domain";

type DiagnosticsTab = "overview" | "freezeFrames" | "testControls";

export function DiagnosticsHomeScreen(): React.JSX.Element {
  const { session } = useSessionStore();
  const { runAction, clearCodes, isLoading, lastError } = useDiagnosticActions();
  const [activeTab, setActiveTab] = useState<DiagnosticsTab>("overview");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [readCodesResult, setReadCodesResult] = useState<DiagnosticServiceAction | null>(null);
  const [vehicleInfoResult, setVehicleInfoResult] = useState<DiagnosticServiceAction | null>(null);

  const clearEligibility = checkActionEligibility(session, "clearCodes");

  async function handleReadCodes(): Promise<void> {
    const result = await runAction("readCodes");
    if (result) setReadCodesResult(result);
  }

  async function handleVehicleInfo(): Promise<void> {
    const result = await runAction("vehicleInfo");
    if (result) setVehicleInfoResult(result);
  }

  async function handleClearConfirm(token: string): Promise<void> {
    setShowClearConfirm(false);
    await clearCodes(token);
    setReadCodesResult(null);
  }

  const faultCodes = parseFaultCodes(readCodesResult);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {(["overview", "freezeFrames", "testControls"] as DiagnosticsTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {lastError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      ) : null}

      {activeTab === "overview" && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleVehicleInfo} disabled={isLoading}>
            <Text style={styles.actionButtonText}>Retrieve Vehicle Info</Text>
          </TouchableOpacity>
          {vehicleInfoResult && (
            <Text style={styles.resultText}>
              {JSON.stringify(vehicleInfoResult.resultPayload ?? vehicleInfoResult.resultStatus, null, 2)}
            </Text>
          )}

          <Text style={styles.sectionTitle}>Fault Codes</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleReadCodes} disabled={isLoading}>
            <Text style={styles.actionButtonText}>Read Fault Codes</Text>
          </TouchableOpacity>

          {isLoading && <ActivityIndicator style={styles.loader} />}

          {readCodesResult && (
            <FaultCodeList
              codes={faultCodes}
              emptyMessage={
                readCodesResult.resultStatus === "success"
                  ? "No fault codes stored."
                  : `Read codes ${readCodesResult.resultStatus}.`
              }
            />
          )}

          <TouchableOpacity
            style={[
              styles.clearButton,
              !clearEligibility.eligible && styles.clearButtonDisabled
            ]}
            onPress={() => setShowClearConfirm(true)}
            disabled={!clearEligibility.eligible}
          >
            <Text style={styles.clearButtonText}>Clear Fault Codes</Text>
          </TouchableOpacity>
          {!clearEligibility.eligible && (
            <Text style={styles.eligibilityHint}>{clearEligibility.reason}</Text>
          )}
        </ScrollView>
      )}

      {activeTab === "freezeFrames" && <FreezeFramePanel />}
      {activeTab === "testControls" && <TestControlPanel />}

      <ClearCodesConfirmDialog
        visible={showClearConfirm}
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        isLoading={isLoading}
      />
    </View>
  );
}

const TAB_LABELS: Record<DiagnosticsTab, string> = {
  overview: "Overview",
  freezeFrames: "Freeze Frames",
  testControls: "Test Controls"
};

function parseFaultCodes(
  action: DiagnosticServiceAction | null
): Array<{ code: string; description?: string; status?: string }> {
  if (!action || action.resultStatus !== "success" || !action.resultPayload) return [];
  const payload = action.resultPayload;
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      if (typeof item === "object" && item !== null) {
        return {
          code: String((item as Record<string, unknown>).code ?? "???"),
          description: (item as Record<string, unknown>).description as string | undefined,
          status: (item as Record<string, unknown>).status as string | undefined
        };
      }
      return { code: String(item) };
    });
  }
  return [];
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#2563eb" },
  tabText: { fontSize: 13, color: "#6b7280" },
  tabTextActive: { color: "#2563eb", fontWeight: "600" },
  errorBanner: { backgroundColor: "#fee2e2", padding: 12, margin: 12, borderRadius: 8 },
  errorText: { color: "#dc2626" },
  content: { flex: 1 },
  contentContainer: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 8, color: "#111827" },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center"
  },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  loader: { marginVertical: 8 },
  resultText: { fontFamily: "monospace", fontSize: 12, color: "#374151" },
  clearButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#dc2626",
    alignItems: "center"
  },
  clearButtonDisabled: { backgroundColor: "#fca5a5" },
  clearButtonText: { color: "#fff", fontWeight: "600" },
  eligibilityHint: { fontSize: 12, color: "#6b7280", textAlign: "center", marginTop: 4 }
});
