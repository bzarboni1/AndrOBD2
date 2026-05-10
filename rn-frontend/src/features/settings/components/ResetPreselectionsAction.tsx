import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { nativeBridge } from "../../../services/nativeBridge";
import { emitStructuredLog } from "../../../telemetry/events";

interface ResetPreselectionsActionProps {
  onComplete?: () => void;
}

export function ResetPreselectionsAction({ onComplete }: ResetPreselectionsActionProps): React.JSX.Element {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleReset(): Promise<void> {
    setShowConfirm(false);
    setIsLoading(true);
    setResult(null);
    emitStructuredLog({ event: "settings.resetPreselections.start", level: "info", payload: {} });
    try {
      await nativeBridge.setPreference("defaultHomeScreen", null);
      setResult("success");
      emitStructuredLog({ event: "settings.resetPreselections.complete", level: "info", payload: {} });
      onComplete?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed.";
      setErrorMessage(message);
      setResult("error");
      emitStructuredLog({
        event: "settings.resetPreselections.error",
        level: "error",
        payload: { error: message }
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowConfirm(true)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Reset Preselections</Text>
      </TouchableOpacity>

      {result === "success" && (
        <Text style={styles.successText}>Preselections reset successfully.</Text>
      )}
      {result === "error" && (
        <Text style={styles.errorText}>{errorMessage ?? "Reset failed."}</Text>
      )}

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Reset Preselections?</Text>
            <Text style={styles.dialogMessage}>
              This will clear your saved home screen and data view preferences. Your other settings
              will not be affected.
            </Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelButton]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.confirmButton]}
                onPress={handleReset}
              >
                <Text style={styles.confirmText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f97316",
    alignItems: "center"
  },
  buttonText: { color: "#f97316", fontWeight: "600" },
  successText: { marginTop: 8, color: "#15803d", fontSize: 13 },
  errorText: { marginTop: 8, color: "#dc2626", fontSize: 13 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400
  },
  dialogTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 10 },
  dialogMessage: { fontSize: 14, color: "#374151", marginBottom: 20, lineHeight: 20 },
  dialogActions: { flexDirection: "row", gap: 12 },
  dialogButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#f3f4f6" },
  cancelText: { fontWeight: "600", color: "#374151" },
  confirmButton: { backgroundColor: "#f97316" },
  confirmText: { fontWeight: "600", color: "#fff" }
});
