import { useCallback, useEffect, useRef, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { useSessionStore } from "../../../state/sessionStore";
import { emitStructuredLog } from "../../../telemetry/events";

import type { LiveDataSample } from "../../../types/domain";

interface LiveDataStreamResult {
  samples: LiveDataSample[];
  streamId: string | null;
  isStreaming: boolean;
  lastError: string | null;
  startStream: (selectedPids?: string[]) => Promise<void>;
  stopStream: () => Promise<void>;
}

export function useLiveDataStream(): LiveDataStreamResult {
  const { session } = useSessionStore();
  const [samples, setSamples] = useState<LiveDataSample[]>([]);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const streamIdRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIdRef.current) {
        nativeBridge.stopLiveData(streamIdRef.current).catch(() => undefined);
      }
    };
  }, []);

  const startStream = useCallback(
    async (selectedPids: string[] = []): Promise<void> => {
      if (!session || session.status !== "connected") {
        setLastError("A vehicle connection is required to start live data.");
        return;
      }
      if (isStreaming) return;

      setLastError(null);
      setSamples([]);
      emitStructuredLog({
        event: "liveData.stream.start",
        level: "info",
        correlationId: session.sessionId,
        payload: { sessionId: session.sessionId, pidCount: selectedPids.length }
      });

      try {
        const { streamId: id } = await nativeBridge.startLiveData(session.sessionId, selectedPids);
        streamIdRef.current = id;
        setStreamId(id);
        setIsStreaming(true);
        emitStructuredLog({
          event: "liveData.stream.started",
          level: "info",
          correlationId: session.sessionId,
          payload: { streamId: id }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to start live data.";
        setLastError(message);
        emitStructuredLog({
          event: "liveData.stream.error",
          level: "error",
          correlationId: session.sessionId,
          payload: { error: message }
        });
      }
    },
    [session, isStreaming]
  );

  const stopStream = useCallback(async (): Promise<void> => {
    if (!streamIdRef.current) return;
    emitStructuredLog({
      event: "liveData.stream.stop",
      level: "info",
      payload: { streamId: streamIdRef.current }
    });
    try {
      await nativeBridge.stopLiveData(streamIdRef.current);
    } finally {
      streamIdRef.current = null;
      setStreamId(null);
      setIsStreaming(false);
    }
  }, []);

  // Reconnect: if session drops, stop the stream
  useEffect(() => {
    if (isStreaming && (!session || session.status !== "connected")) {
      stopStream().catch(() => undefined);
      setLastError("Connection lost. Live data stream stopped.");
      emitStructuredLog({
        event: "liveData.stream.connectionLost",
        level: "warn",
        payload: {}
      });
    }
  }, [session, isStreaming, stopStream]);

  return { samples, streamId, isStreaming, lastError, startStream, stopStream };
}
