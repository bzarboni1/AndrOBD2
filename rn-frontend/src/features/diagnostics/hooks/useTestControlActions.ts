import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { useSessionStore } from "../../../state/sessionStore";
import { emitStructuredLog } from "../../../telemetry/events";
import { checkActionEligibility } from "../utils/actionEligibility";

import type { DiagnosticServiceAction } from "../../../types/domain";

interface TestControlActionsResult {
  getTestControls: () => Promise<DiagnosticServiceAction | null>;
  isLoading: boolean;
  lastError: string | null;
  result: DiagnosticServiceAction | null;
}

export function useTestControlActions(): TestControlActionsResult {
  const { session } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticServiceAction | null>(null);

  const getTestControls = useCallback(async (): Promise<DiagnosticServiceAction | null> => {
    setLastError(null);

    const { eligible, reason } = checkActionEligibility(session, "testControl");
    if (!eligible) {
      setLastError(reason ?? "Test controls not available.");
      return null;
    }

    setIsLoading(true);
    emitStructuredLog({
      event: "diagnostic.testControl.start",
      level: "info",
      correlationId: session!.sessionId,
      payload: { sessionId: session!.sessionId }
    });

    try {
      const action = await nativeBridge.runDiagnosticAction(session!.sessionId, "testControl");
      setResult(action);
      emitStructuredLog({
        event: "diagnostic.testControl.complete",
        level: action.resultStatus === "failure" ? "warn" : "info",
        correlationId: session!.sessionId,
        payload: { resultStatus: action.resultStatus }
      });
      return action;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Test control retrieval failed.";
      setLastError(message);
      emitStructuredLog({
        event: "diagnostic.testControl.error",
        level: "error",
        correlationId: session?.sessionId,
        payload: { error: message }
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return { getTestControls, isLoading, lastError, result };
}
