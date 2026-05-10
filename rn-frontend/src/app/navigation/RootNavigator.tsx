import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../../features/connection/screens/HomeScreen";
import { ConnectScreen } from "../../features/connection/screens/ConnectScreen";
import { DiagnosticsHomeScreen } from "../../features/diagnostics/screens/DiagnosticsHomeScreen";
import { LiveDataScreen } from "../../features/live-data/screens/LiveDataScreen";
import { RecordingLibraryScreen } from "../../features/measurements/screens/RecordingLibraryScreen";
import { SettingsScreen } from "../../features/settings/screens/SettingsScreen";
import { PluginManagerScreen } from "../../features/plugins/screens/PluginManagerScreen";

export type RootStackParamList = {
  Home: undefined;
  Connect: undefined;
  DiagnosticsHome: undefined;
  LiveData: undefined;
  Measurements: undefined;
  Settings: undefined;
  Plugins: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "AndrOBD" }} />
      <Stack.Screen name="Connect" component={ConnectScreen} options={{ title: "Connect" }} />
      <Stack.Screen
        name="DiagnosticsHome"
        component={DiagnosticsHomeScreen}
        options={{ title: "Diagnostics" }}
      />
      <Stack.Screen
        name="LiveData"
        component={LiveDataScreen}
        options={{ title: "Live Data" }}
      />
      <Stack.Screen
        name="Measurements"
        component={RecordingLibraryScreen}
        options={{ title: "Measurements" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
      <Stack.Screen name="Plugins" component={PluginManagerScreen} options={{ title: "Plugins" }} />
    </Stack.Navigator>
  );
}
