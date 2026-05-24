import React from "react";
import { Text, View } from "react-native";

export function ErrorBanner({ message }: { message?: string | null }): React.JSX.Element | null {
  if (!message) {
    return null;
  }

  return (
    <View style={{ backgroundColor: "#8b0000", padding: 8 }}>
      <Text style={{ color: "#ffffff" }}>{message}</Text>
    </View>
  );
}
