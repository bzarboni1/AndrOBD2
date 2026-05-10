import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { emitStructuredLog } from "../../../telemetry/events";
import { incrementMetric } from "../../../telemetry/metrics";

import type { MeasurementRecording } from "../../../types/domain";

interface RecordingActionsResult {
  startRecording: (streamId: string, metadata?: Record<string, unknown>) => Promise<string | null>;
  stopRecording: (recordingId: string) => Promise<MeasurementRecording | null>;
  isLoading: boolean;
  lastError: string | null;
  activeRecordingId: string | null;
}

export function useRecordingActions(): RecordingActionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);

  const startRecording = useCallback(
    async (streamId: string, metadata?: Record<string, unknown>): Promise<string | null> => {
      setIsLoading(true);
      setLastError(null);
      emitStructuredLog({
        event: "recording.start",
        level: "info",
        payload: { streamId }
      });
      try {
        const { recordingId } = await nativeBridge.startRecording(streamId, metadata);
        setActiveRecordingId(recordingId);
        incrementMetric("recording.started");
        emitStructuredLog({
          event: "recording.started",
          level: "info",
          payload: { recordingId, streamId }
        });
        return recordingId;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to start recording.";
        setLastError(message);
        emitStructuredLog({
          event: "recording.start.error",
          level: "error",
          payload: { error: message }
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const stopRecording = useCallback(
    async (recordingId: string): Promise<MeasurementRecording | null> => {
      setIsLoading(true);
      setLastError(null);
      emitStructuredLog({
        event: "recording.stop",
        level: "info",
        payload: { recordingId }
      });
      try {
        const recording = await nativeBridge.stopRecording(recordingId);
        setActiveRecordingId(null);
        incrementMetric("recording.saved");
        emitStructuredLog({
          event: "recording.saved",
          level: "info",
          payload: { recordingId, sampleCount: recording.sampleCount }
        });
        return recording;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to stop recording.";
        setLastError(message);
        emitStructuredLog({
          event: "recording.stop.error",
          level: "error",
          payload: { recordingId, error: message }
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { startRecording, stopRecording, isLoading, lastError, activeRecordingId };
}
