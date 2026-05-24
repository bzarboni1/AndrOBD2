import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { useSessionStore } from "../../../state/sessionStore";
import { emitStructuredLog } from "../../../telemetry/events";
import { checkActionEligibility } from "../utils/actionEligibility";

import type { DiagnosticServiceAction } from "../../../types/domain";

interface FreezeFrameActionsResult {
  getFreezeFrames: () => Promise<DiagnosticServiceAction | null>;
  isLoading: boolean;
  lastError: string | null;
  result: DiagnosticServiceAction | null;
}

export function useFreezeFrameActions(): FreezeFrameActionsResult {
  const { session } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticServiceAction | null>(null);

  const getFreezeFrames = useCallback(async (): Promise<DiagnosticServiceAction | null> => {
    setLastError(null);

    const { eligible, reason } = checkActionEligibility(session, "freezeFrames");
    if (!eligible) {
      setLastError(reason ?? "Freeze frame retrieval not available.");
      return null;
    }

    setIsLoading(true);
    emitStructuredLog({
      event: "diagnostic.freezeFrames.start",
      level: "info",
      correlationId: session!.sessionId,
      payload: { sessionId: session!.sessionId }
    });

    try {
      const action = await nativeBridge.runDiagnosticAction(session!.sessionId, "freezeFrames");
      setResult(action);
      emitStructuredLog({
        event: "diagnostic.freezeFrames.complete",
        level: action.resultStatus === "failure" ? "warn" : "info",
        correlationId: session!.sessionId,
        payload: { resultStatus: action.resultStatus }
      });
      return action;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Freeze frame retrieval failed.";
      setLastError(message);
      emitStructuredLog({
        event: "diagnostic.freezeFrames.error",
        level: "error",
        correlationId: session?.sessionId,
        payload: { error: message }
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return { getFreezeFrames, isLoading, lastError, result };
}
