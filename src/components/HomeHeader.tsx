import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/spacing';

const CATEGORIES = ['Suggested', 'Songs', 'Artists', 'Albums', 'Favorites'] as const;

type Category = typeof CATEGORIES[number];

type Props = {
  activeCategory: Category;
};

export const HomeHeader = ({ activeCategory }: Props) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  /**
   * ✅ SAFE NAVIGATION HANDLER
   * - Favorites → Bottom Tab
   * - Others → Stack screens (Suggested / Songs / Artists / Albums)
   * - No "Do you have a screen named 'Home'?" warning
   */
  const handlePress = useCallback(
    (item: Category) => {
      if (item === activeCategory) return;

      // 🔹 Bottom Tab
      if (item === 'Favorites') {
        navigation.navigate('Favorites');
        return;
      }

      // 🔹 Stack screens (works in nested & non-nested cases)
      navigation.navigate(item);
    },
    [activeCategory, navigation]
  );

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      {/* 🔝 TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.left}>
          <Ionicons name="musical-notes" size={30} color={colors.primary} />
          <Text style={styles.title}>Mume</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={26} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* 📂 CATEGORIES */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => {
          const isActive = item === activeCategory;
          return (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.category,
                  isActive && styles.activeCategory,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  title: {
    fontSize: typography.header.fontSize,
    fontWeight: typography.header.fontWeight,
    color: typography.header.color,
  },
  categoryList: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
    gap: spacing.l,
  },
  category: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeCategory: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
    fontWeight: 'bold',
  },
});
