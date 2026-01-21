import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import SongsScreen from '../screens/songs/SongsScreen';

import MainLayout from "./MainLayout";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainLayout} />
     
       
  <Stack.Screen name="Songs" component={SongsScreen} />
  
    </Stack.Navigator>
  );
}

