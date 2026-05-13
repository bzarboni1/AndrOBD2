import React, { createContext, useContext, useMemo, useState } from "react";

import type { DiagnosticServiceAction } from "../types/domain";

interface DiagnosticsStoreValue {
  lastAction: DiagnosticServiceAction | null;
  setLastAction: (action: DiagnosticServiceAction | null) => void;
}

const DiagnosticsStoreContext = createContext<DiagnosticsStoreValue | undefined>(undefined);

export function DiagnosticsStoreProvider({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [lastAction, setLastAction] = useState<DiagnosticServiceAction | null>(null);

  const value = useMemo(() => ({ lastAction, setLastAction }), [lastAction]);

  return <DiagnosticsStoreContext.Provider value={value}>{children}</DiagnosticsStoreContext.Provider>;
}

export function useDiagnosticsStore(): DiagnosticsStoreValue {
  const context = useContext(DiagnosticsStoreContext);
  if (!context) {
    throw new Error("useDiagnosticsStore must be used inside DiagnosticsStoreProvider.");
  }
  return context;
}
