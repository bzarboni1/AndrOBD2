import React from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";

import { AppProviders } from "./AppProviders";
import { translate } from "../i18n";

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar barStyle="default" />
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text>{translate("app_name")}</Text>
      </View>
      <AppProviders />
    </SafeAreaView>
  );
}
