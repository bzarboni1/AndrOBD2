import { useCallback, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { emitStructuredLog } from "../../../telemetry/events";
import { incrementMetric } from "../../../telemetry/metrics";

import type { ExtensionModuleState, PluginActionResult } from "../../../types/domain";

interface PluginActionsResult {
  plugins: ExtensionModuleState[];
  isLoading: boolean;
  lastError: string | null;
  loadPlugins: () => Promise<void>;
  invokeAction: (moduleId: string, action: string, payload?: unknown) => Promise<PluginActionResult | null>;
  lastActionResult: PluginActionResult | null;
}

export function usePluginActions(): PluginActionsResult {
  const [plugins, setPlugins] = useState<ExtensionModuleState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastActionResult, setLastActionResult] = useState<PluginActionResult | null>(null);

  const loadPlugins = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLastError(null);
    emitStructuredLog({ event: "plugins.load.start", level: "info", payload: {} });
    try {
      const list = await nativeBridge.listPlugins();
      setPlugins(list);
      incrementMetric("plugins.loaded");
      emitStructuredLog({
        event: "plugins.load.complete",
        level: "info",
        payload: { count: list.length }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load plugins.";
      setLastError(message);
      emitStructuredLog({
        event: "plugins.load.error",
        level: "error",
        payload: { error: message }
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invokeAction = useCallback(
    async (moduleId: string, action: string, payload?: unknown): Promise<PluginActionResult | null> => {
      setLastError(null);
      emitStructuredLog({
        event: "plugins.action.start",
        level: "info",
        payload: { moduleId, action }
      });
      try {
        const result = await nativeBridge.invokePluginAction(moduleId, action, payload);
        setLastActionResult(result);
        incrementMetric("plugins.action.invoked");
        emitStructuredLog({
          event: "plugins.action.complete",
          level: "info",
          payload: { moduleId, action, status: result.status }
        });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Plugin action failed.";
        setLastError(message);
        incrementMetric("plugins.action.failed");
        emitStructuredLog({
          event: "plugins.action.error",
          level: "error",
          payload: { moduleId, action, error: message }
        });
        return null;
      }
    },
    []
  );

  return { plugins, isLoading, lastError, loadPlugins, invokeAction, lastActionResult };
}
