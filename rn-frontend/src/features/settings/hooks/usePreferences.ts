import { useCallback, useEffect, useState } from "react";

import { nativeBridge } from "../../../services/nativeBridge";
import { emitStructuredLog } from "../../../telemetry/events";

import type { UserPreferenceProfile } from "../../../types/domain";

interface PreferencesResult {
  preferences: UserPreferenceProfile | null;
  isLoading: boolean;
  lastError: string | null;
  setPreference: (key: keyof Omit<UserPreferenceProfile, "profileId" | "updatedAt">, value: unknown) => Promise<void>;
  reload: () => Promise<void>;
}

export function usePreferences(): PreferencesResult {
  const [preferences, setPreferences] = useState<UserPreferenceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLastError(null);
    try {
      const prefs = await nativeBridge.getPreferences();
      setPreferences(prefs);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load preferences.";
      setLastError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const setPreference = useCallback(
    async (
      key: keyof Omit<UserPreferenceProfile, "profileId" | "updatedAt">,
      value: unknown
    ): Promise<void> => {
      setLastError(null);
      emitStructuredLog({
        event: "preferences.update",
        level: "info",
        payload: { key, value: String(value) }
      });
      try {
        await nativeBridge.setPreference(key, value);
        setPreferences((prev) =>
          prev ? { ...prev, [key]: value, updatedAt: new Date().toISOString() } : prev
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save preference.";
        setLastError(message);
        emitStructuredLog({
          event: "preferences.update.error",
          level: "error",
          payload: { key, error: message }
        });
      }
    },
    []
  );

  return { preferences, isLoading, lastError, setPreference, reload: load };
}
