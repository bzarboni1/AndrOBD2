import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { useSessionStore } from "../../../state/sessionStore";
import { emitStructuredLog } from "../../../telemetry/events";
import { recordConnectionAttempt, recordConnectionSuccess } from "../../../telemetry/metrics";

import type { TransportType } from "../../../types/domain";

interface ConnectionActionsResult {
  connect: (transportType: TransportType, options?: Record<string, unknown>) => Promise<void>;
  disconnect: (sessionId: string) => Promise<void>;
  isLoading: boolean;
  lastError: string | null;
}

export function useConnectionActions(): ConnectionActionsResult {
  const { setSession } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const connect = useCallback(
    async (transportType: TransportType, options?: Record<string, unknown>): Promise<void> => {
      setIsLoading(true);
      setLastError(null);
      recordConnectionAttempt();
      emitStructuredLog({
        event: "connection.attempt",
        level: "info",
        payload: { transportType }
      });
      try {
        const session = await nativeBridge.connect(transportType, options);
        setSession(session);
        recordConnectionSuccess();
        emitStructuredLog({
          event: "connection.success",
          level: "info",
          correlationId: session.sessionId,
          payload: { transportType, sessionId: session.sessionId }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Connection failed.";
        setLastError(message);
        emitStructuredLog({
          event: "connection.failure",
          level: "error",
          payload: { transportType, error: message }
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setSession]
  );

  const disconnect = useCallback(
    async (sessionId: string): Promise<void> => {
      setIsLoading(true);
      setLastError(null);
      emitStructuredLog({
        event: "connection.disconnect",
        level: "info",
        correlationId: sessionId,
        payload: { sessionId }
      });
      try {
        await nativeBridge.disconnect(sessionId);
        setSession(null);
        emitStructuredLog({
          event: "connection.disconnected",
          level: "info",
          correlationId: sessionId,
          payload: { sessionId }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Disconnect failed.";
        setLastError(message);
        emitStructuredLog({
          event: "connection.disconnect.failure",
          level: "error",
          correlationId: sessionId,
          payload: { sessionId, error: message }
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setSession]
  );

  return { connect, disconnect, isLoading, lastError };
}
