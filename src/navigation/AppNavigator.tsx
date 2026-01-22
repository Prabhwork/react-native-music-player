import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import PlayerScreen from "../screens/Player/PlayerScreen";
import ArtistDetailsScreen from "../screens/ArtistDetails/ArtistDetailsScreen";
import AlbumDetailsScreen from '../screens/AlbumDetails/AlbumDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ presentation: 'card', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="ArtistDetails"
        component={ArtistDetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
      <Stack.Screen
        name="Search"
        component={require('../screens/Search/SearchScreen').default}
        options={{ animation: 'fade_from_bottom' }}
      />
    </Stack.Navigator>
  );
}

