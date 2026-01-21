import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { HomeHeader } from './HomeHeader';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = {
  categories?: string[];
  activeCategory?: string;
  onCategoryPress?: (item: string) => void;
  children: React.ReactNode;
};

export const TopLayout: React.FC<Props> = ({
  categories,
  activeCategory,
  onCategoryPress,
  children,
}) => {
  return (
    <View style={styles.container}>
    

      {/* OPTIONAL CATEGORIES */}
      {categories && (
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === item && styles.categoryActive,
                ]}
                onPress={() => onCategoryPress?.(item)}
              >
                {item}
              </Text>
            )}
          />
        </View>
      )}

      {/* SCREEN CONTENT */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingVertical: spacing.s,
  },
  categoriesList: {
    paddingHorizontal: spacing.m,
    gap: spacing.l,
  },
  categoryText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryActive: {
    color: colors.primary,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
  },
});
