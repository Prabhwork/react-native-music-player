import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import SongsScreen from '../screens/songs/SongsScreen'
import ArtistsScreen from '../screens/Artists/ArtistsScreen';
import AlbumsScreen from '../screens/Albums/AlbumsScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Suggested" component={HomeScreen} />
      <Stack.Screen name="Songs" component={SongsScreen} />
      <Stack.Screen name="Artists" component={ArtistsScreen} />
      <Stack.Screen name="Albums" component={AlbumsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
