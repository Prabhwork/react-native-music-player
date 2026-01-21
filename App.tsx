import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainLayout from './src/navigation/MainLayout';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainLayout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
