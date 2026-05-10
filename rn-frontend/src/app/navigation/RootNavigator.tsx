import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

const Stack = createNativeStackNavigator();

function BootstrapScreen(): React.JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Navigation foundation ready</Text>
    </View>
  );
}

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Bootstrap" component={BootstrapScreen} options={{ title: "AndrOBD" }} />
    </Stack.Navigator>
  );
}
