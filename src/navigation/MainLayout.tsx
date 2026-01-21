import React from 'react';
import { View, StyleSheet } from 'react-native';

import { HomeHeader } from '../components/HomeHeader';
import TabNavigator from './TabNavigator';
import { colors } from '../theme/colors';

const MainLayout = () => {
  return (
    <View style={styles.container}>
      {/* 🔝 COMMON HEADER */}
      <HomeHeader activeCategory="Suggested" />

      {/* 🔽 COMMON BOTTOM BAR */}
      <TabNavigator />
    </View>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
