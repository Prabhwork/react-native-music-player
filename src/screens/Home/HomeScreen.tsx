import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { HomeHeader } from '../../components/HomeHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { SongCard } from '../../components/SongCard';
import { ArtistAvatar } from '../../components/ArtistAvatar';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

// Dummy Data
const CATEGORIES = ['Suggested', 'Songs', 'Artists', 'Albums', 'Favorites'];

const RECENTLY_PLAYED = [
  {
    id: '1',
    title: 'Shades of Love',
    artist: 'Ania Szarmach',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    title: 'Without You',
    artist: 'The Kid LAROI',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '3',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    image: require('../../../assets/icon.png'),
  },
];

const ARTISTS = [
  {
    id: '1',
    name: 'Ariana Grande',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    name: 'The Weeknd',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '3',
    name: 'Acidrap',
    image: require('../../../assets/icon.png'),
  },
];

const MOST_PLAYED = [
  {
    id: '1',
    title: 'Blue Mood',
    artist: 'Artist 1',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '2',
    title: 'Galaxy',
    artist: 'Artist 2',
    image: require('../../../assets/icon.png'),
  },
  {
    id: '3',
    title: 'Portrait',
    artist: 'Artist 3',
    image: require('../../../assets/icon.png'),
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('Suggested');

  const renderCategory = ({ item }: { item: string }) => (
    <Text
      style={[
        styles.categoryText,
        activeCategory === item && styles.categoryTextActive,
      ]}
      onPress={() => {
        setActiveCategory(item);

        // 👉 MAIN LOGIC
        if (item === 'Songs') {
          navigation.navigate('Songs');
        }
      }}
    >
      {item}
    </Text>
  );

  return (
    <View style={styles.container}>
      <HomeHeader />

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recently Played */}
        <SectionHeader title="Recently Played" onSeeAll={() => {}} />
        <FlatList
          data={RECENTLY_PLAYED}
          renderItem={({ item }) => (
            <SongCard
              title={item.title}
              artist={item.artist}
              image={item.image}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Artists */}
        <SectionHeader title="Artists" onSeeAll={() => {}} />
        <FlatList
          data={ARTISTS}
          renderItem={({ item }) => (
            <ArtistAvatar name={item.name} image={item.image} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Most Played */}
        <SectionHeader title="Most Played" onSeeAll={() => {}} />
        <FlatList
          data={MOST_PLAYED}
          renderItem={({ item }) => (
            <SongCard
              title={item.title}
              artist={item.artist}
              image={item.image}
              variant="large"
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoriesContainer: {
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  categoriesList: {
    paddingHorizontal: spacing.m,
    gap: spacing.l,
    paddingBottom: spacing.s,
  },
  categoryText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
  },
  horizontalList: {
    paddingHorizontal: spacing.m,
  },
});
