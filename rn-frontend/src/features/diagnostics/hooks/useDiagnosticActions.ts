import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { useDiagnosticsStore } from "../../../state/diagnosticsStore";
import { useSessionStore } from "../../../state/sessionStore";
import { emitStructuredLog } from "../../../telemetry/events";
import { recordDiagnosticAttempt, recordDiagnosticFailure } from "../../../telemetry/metrics";
import { checkActionEligibility } from "../utils/actionEligibility";

import type { DiagnosticServiceAction, DiagnosticServiceType } from "../../../types/domain";

interface DiagnosticActionsResult {
  runAction: (
    serviceType: DiagnosticServiceType,
    params?: Record<string, unknown>
  ) => Promise<DiagnosticServiceAction | null>;
  clearCodes: (confirmationToken: string) => Promise<DiagnosticServiceAction | null>;
  isLoading: boolean;
  lastError: string | null;
}

export function useDiagnosticActions(): DiagnosticActionsResult {
  const { session } = useSessionStore();
  const { setLastAction } = useDiagnosticsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const runAction = useCallback(
    async (
      serviceType: DiagnosticServiceType,
      params?: Record<string, unknown>
    ): Promise<DiagnosticServiceAction | null> => {
      setLastError(null);

      const { eligible, reason } = checkActionEligibility(session, serviceType);
      if (!eligible) {
        setLastError(reason ?? "Action not available.");
        return null;
      }

      setIsLoading(true);
      recordDiagnosticAttempt();
      emitStructuredLog({
        event: "diagnostic.action.start",
        level: "info",
        correlationId: session!.sessionId,
        payload: { serviceType, sessionId: session!.sessionId }
      });

      try {
        const result = await nativeBridge.runDiagnosticAction(session!.sessionId, serviceType, params);
        setLastAction(result);
        if (result.resultStatus === "failure") {
          recordDiagnosticFailure();
        }
        emitStructuredLog({
          event: "diagnostic.action.complete",
          level: result.resultStatus === "failure" ? "warn" : "info",
          correlationId: session!.sessionId,
          payload: { serviceType, resultStatus: result.resultStatus, actionId: result.actionId }
        });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Diagnostic action failed.";
        setLastError(message);
        recordDiagnosticFailure();
        emitStructuredLog({
          event: "diagnostic.action.error",
          level: "error",
          correlationId: session?.sessionId,
          payload: { serviceType, error: message }
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [session, setLastAction]
  );

  const clearCodes = useCallback(
    async (confirmationToken: string): Promise<DiagnosticServiceAction | null> => {
      setLastError(null);

      const { eligible, reason } = checkActionEligibility(session, "clearCodes");
      if (!eligible) {
        setLastError(reason ?? "Cannot clear codes.");
        return null;
      }

      setIsLoading(true);
      recordDiagnosticAttempt();
      emitStructuredLog({
        event: "diagnostic.clearCodes.start",
        level: "info",
        correlationId: session!.sessionId,
        payload: { sessionId: session!.sessionId }
      });

      try {
        const result = await nativeBridge.clearFaultCodes(session!.sessionId, confirmationToken);
        setLastAction(result);
        if (result.resultStatus === "failure") {
          recordDiagnosticFailure();
        }
        emitStructuredLog({
          event: "diagnostic.clearCodes.complete",
          level: result.resultStatus === "failure" ? "warn" : "info",
          correlationId: session!.sessionId,
          payload: { resultStatus: result.resultStatus, actionId: result.actionId }
        });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Clear codes failed.";
        setLastError(message);
        recordDiagnosticFailure();
        emitStructuredLog({
          event: "diagnostic.clearCodes.error",
          level: "error",
          correlationId: session?.sessionId,
          payload: { error: message }
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [session, setLastAction]
  );

  return { runAction, clearCodes, isLoading, lastError };
}
