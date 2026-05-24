import React, { createContext, useContext, useMemo, useState } from "react";

import type { ConnectionSession } from "../types/domain";

interface SessionStoreValue {
  session: ConnectionSession | null;
  setSession: (session: ConnectionSession | null) => void;
}

const SessionStoreContext = createContext<SessionStoreValue | undefined>(undefined);

export function SessionStoreProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [session, setSession] = useState<ConnectionSession | null>(null);

  const value = useMemo(() => ({ session, setSession }), [session]);

  return <SessionStoreContext.Provider value={value}>{children}</SessionStoreContext.Provider>;
}

export function useSessionStore(): SessionStoreValue {
  const context = useContext(SessionStoreContext);
  if (!context) {
    throw new Error("useSessionStore must be used inside SessionStoreProvider.");
  }
  return context;
}
