import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { HomeHeader } from '../../components/HomeHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { SongCard } from '../../components/SongCard';
import { ArtistAvatar } from '../../components/ArtistAvatar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { artistService } from '../../services/artistService';
import { songService } from '../../services/songService';
import { Artist } from '../../types/artist';
import { Song } from '../../types/song';

// Dummy Data
const CATEGORIES = ['Suggested', 'Songs', 'Artists', 'Albums', 'Favorites'];

const RECENTLY_PLAYED = [
  { id: '1', title: 'Shades of Love', artist: 'Ania Szarmach', image: require('../../../assets/icon.png') }, // Placeholder image
  { id: '2', title: 'Without You', artist: 'The Kid LAROI', image: require('../../../assets/icon.png') },
  { id: '3', title: 'Save Your Tears', artist: 'The Weeknd', image: require('../../../assets/icon.png') },
];

// Sample Artist IDs for testing 
const SAMPLE_ARTIST_IDS = ['459320', '464656', '456269', '485956', '568565'];
// Sample Song ID for suggestions (Using 'yDeAS8Eh' as requested)
const SEED_SONG_ID = 'yDeAS8Eh';

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Suggested');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState<Song[]>([]);
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState<Song[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Artists
      setLoadingArtists(true);
      const artistsData = await artistService.getMultipleArtists(SAMPLE_ARTIST_IDS);
      setArtists(artistsData);
      setLoadingArtists(false);

      // Fetch Most Played (using Top Songs from fetched artists as a fallback for 'Suggested')
      // Since the suggestions API is erroring, we will display the top songs of the loaded artists
      const allTopSongs: Song[] = [];
      artistsData.forEach(artist => {
        if (artist.topSongs) {
          allTopSongs.push(...artist.topSongs);
        }
      });
      // Shuffle or just pick the first few
      const shuffledTopSongs = [...allTopSongs].sort(() => 0.5 - Math.random());
      setMostPlayedSongs(shuffledTopSongs.slice(0, 10)); // Display top 10 songs from these artists
      setLoadingSongs(false);

      // Fetch Recently Played (Random 5 songs from available top songs to ensure validity)
      // We will pick 5 random IDs from the shuffled list (different from most played if possible, or same)
      const recentPool = shuffledTopSongs.slice(10, 20).length > 0 ? shuffledTopSongs.slice(10, 20) : shuffledTopSongs.slice(0, 5);
      // Ensure we have at least 5 IDs if possible
      const recentIdsToFetch = recentPool.slice(0, 5).map(song => song.id);

      // If we don't have enough dynamic IDs, append some hardcoded ones that are known to work
      const hardcodedIds = ['3IoDK8qI', 'yDeAS8Eh', '5GjH_13K', 'ZMcM9o8H', 'Mgqhq94a'];
      while (recentIdsToFetch.length < 5) {
        const nextId = hardcodedIds.shift();
        if (nextId) recentIdsToFetch.push(nextId);
        else break;
      }

      if (recentIdsToFetch.length > 0) {
        const recentSongsData = await songService.getSongsByIds(recentIdsToFetch);
        setRecentlyPlayedSongs(recentSongsData);
      }
    };

    fetchData();
  }, []);

  const renderCategory = ({ item }: { item: string }) => (
    <Text
      style={[
        styles.categoryText,
        activeCategory === item && styles.categoryTextActive,
      ]}
      onPress={() => setActiveCategory(item)}
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
        <SectionHeader title="Recently Played" onSeeAll={() => { }} />
        <FlatList
          data={recentlyPlayedSongs}
          renderItem={({ item }) => (
            <SongCard
              title={item.name}
              artist={item.artists.primary[0]?.name || 'Unknown Artist'}
              image={{ uri: item.image[2]?.url || item.image[0]?.url }}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Artists */}
        <SectionHeader title="Artists" onSeeAll={() => { }} />
        {loadingArtists ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ margin: spacing.m }} />
        ) : (
          <FlatList
            data={artists}
            renderItem={({ item }) => (
              <ArtistAvatar
                name={item.name}
                image={{ uri: item.image[2]?.url || item.image[0]?.url }}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}

        {/* Most Played */}
        <SectionHeader title="Most Played" onSeeAll={() => { }} />
        {loadingSongs ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ margin: spacing.m }} />
        ) : (
          <FlatList
            data={mostPlayedSongs}
            renderItem={({ item }) => (
              <SongCard
                title={item.name}
                artist={item.artists.primary[0]?.name || 'Unknown Artist'}
                image={{ uri: item.image[2]?.url || item.image[0]?.url }}
                variant="large"
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

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

export default HomeScreen;
