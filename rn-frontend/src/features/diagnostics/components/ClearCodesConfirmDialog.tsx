import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ClearCodesConfirmDialogProps {
  visible: boolean;
  onConfirm: (confirmationToken: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClearCodesConfirmDialog({
  visible,
  onConfirm,
  onCancel,
  isLoading = false
}: ClearCodesConfirmDialogProps): React.JSX.Element {
  function handleConfirm(): void {
    // Generate a stable confirmation token for this destructive action session.
    const token = `clear-${Date.now()}`;
    onConfirm(token);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Clear Fault Codes?</Text>
          <Text style={styles.message}>
            This will erase all stored fault codes from the vehicle ECU. This action cannot be
            undone. Cleared codes will not be recoverable.
          </Text>
          <Text style={styles.warning}>
            Only proceed if you have noted the current codes and are ready to clear them.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, isLoading && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              <Text style={styles.confirmButtonText}>
                {isLoading ? "Clearing…" : "Clear Codes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  title: { fontSize: 18, fontWeight: "bold", color: "#dc2626", marginBottom: 12 },
  message: { fontSize: 14, color: "#374151", lineHeight: 20, marginBottom: 12 },
  warning: {
    fontSize: 13,
    color: "#92400e",
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20
  },
  actions: { flexDirection: "row", gap: 12 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#f3f4f6" },
  cancelButtonText: { fontWeight: "600", color: "#374151" },
  confirmButton: { backgroundColor: "#dc2626" },
  confirmButtonText: { fontWeight: "600", color: "#fff" },
  buttonDisabled: { opacity: 0.6 }
});
