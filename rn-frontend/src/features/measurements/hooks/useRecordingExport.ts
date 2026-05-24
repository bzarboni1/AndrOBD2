import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { emitStructuredLog } from "../../../telemetry/events";
import { incrementMetric } from "../../../telemetry/metrics";

interface RecordingExportResult {
  exportRecording: (recordingId: string) => Promise<string | null>;
  isExporting: boolean;
  lastError: string | null;
  exportedFileUri: string | null;
}

export function useRecordingExport(): RecordingExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [exportedFileUri, setExportedFileUri] = useState<string | null>(null);

  const exportRecording = useCallback(async (recordingId: string): Promise<string | null> => {
    setIsExporting(true);
    setLastError(null);
    setExportedFileUri(null);
    emitStructuredLog({
      event: "recording.export.start",
      level: "info",
      payload: { recordingId, format: "legacy" }
    });
    try {
      const { fileUri } = await nativeBridge.exportRecording(recordingId, "legacy");
      setExportedFileUri(fileUri);
      incrementMetric("recording.exported");
      emitStructuredLog({
        event: "recording.export.complete",
        level: "info",
        payload: { recordingId, fileUri }
      });
      return fileUri;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed.";
      setLastError(message);
      emitStructuredLog({
        event: "recording.export.error",
        level: "error",
        payload: { recordingId, error: message }
      });
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportRecording, isExporting, lastError, exportedFileUri };
}
