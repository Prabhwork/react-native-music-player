import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { MiniPlayer } from "./src/components/MiniPlayer";

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <MiniPlayer />
      </View>
    </NavigationContainer>
  );
}
