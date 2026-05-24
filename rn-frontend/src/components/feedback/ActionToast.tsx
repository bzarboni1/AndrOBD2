import React from "react";
import { Text, View } from "react-native";

export function ActionToast({ message }: { message?: string | null }): React.JSX.Element | null {
  if (!message) {
    return null;
  }

  return (
    <View style={{ backgroundColor: "#1f2937", margin: 8, padding: 8, borderRadius: 6 }}>
      <Text style={{ color: "#ffffff" }}>{message}</Text>
    </View>
  );
}
