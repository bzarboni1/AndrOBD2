import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ErrorBanner } from "../components/feedback/ErrorBanner";
import { ActionToast } from "../components/feedback/ActionToast";
import { RootNavigator } from "./navigation/RootNavigator";
import { DiagnosticsStoreProvider } from "../state/diagnosticsStore";
import { SessionStoreProvider } from "../state/sessionStore";

export function AppProviders(): React.JSX.Element {
  const [errorMessage] = useState<string | null>(null);
  const [toastMessage] = useState<string | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionStoreProvider>
        <DiagnosticsStoreProvider>
          <NavigationContainer>
            <ErrorBanner message={errorMessage} />
            <RootNavigator />
            <ActionToast message={toastMessage} />
          </NavigationContainer>
        </DiagnosticsStoreProvider>
      </SessionStoreProvider>
    </GestureHandlerRootView>
  );
}
