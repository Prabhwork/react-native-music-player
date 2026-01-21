import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeHeader } from '../../components/HomeHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { SongCard } from '../../components/SongCard';
import { ArtistAvatar } from '../../components/ArtistAvatar';
import { colors } from '../../theme/colors';
import { spacing, typography } from '../../theme/spacing';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../../store/usePlayerStore';
import { artistService } from '../../services/artistService';
import { songService } from '../../services/songService';
import { Artist } from '../../types/artist';
import { Song } from '../../types/song';
import { Album } from '../../types/album';
import { albumService } from '../../services/albumService';
import { AlbumCard } from '../../components/AlbumCard';

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
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  const navigation = useNavigation();
  const { playSong } = usePlayerStore();

  const handleSongPress = (song: Song, queue: Song[]) => {
    // Ensure the song object is fully populated if using simpler objects from elsewhere
    // But for now assuming Song type matches.
    // API difference: RecentlyPlayed might check for 'id' while Song type uses 'id'.
    // The API return types should be consistent.
    playSong(song, queue);
    // @ts-ignore - navigation type definition issue common in RN
    navigation.navigate('Player');
  };

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

      // Fetch Albums
      setLoadingAlbums(true);
      const albumsData = await albumService.getTopAlbums();
      setAlbums(albumsData);
      setLoadingAlbums(false);
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

  const renderArtistItem = ({ item }: { item: Artist }) => {
    // Determine image source
    const imageSource = item.image && item.image.length > 0
      ? { uri: item.image[2]?.url || item.image[0]?.url }
      : require('../../../assets/icon.png');

    // Determine meta text (Album/Song count - using simulated data if missing)
    const albumCount = item.topAlbums ? item.topAlbums.length : 1;
    const songCount = item.topSongs ? item.topSongs.length : 10;

    return (
      <TouchableOpacity
        style={styles.artistListItem}
        onPress={() => (navigation as any).navigate('ArtistDetails', { id: item.id, artistData: item })}
      >
        <Image source={imageSource} style={styles.artistListImage} />
        <View style={styles.artistListInfo}>
          <Text style={styles.artistListName}>{item.name}</Text>
          <Text style={styles.artistListMeta}>{`${albumCount} Album | ${songCount} Songs`}</Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (activeCategory === 'Artists') {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.artistListContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>{artists.length} artists</Text>
              <View style={styles.sortContainer}>
                <Text style={styles.sortText}>Date Added</Text>
                <Ionicons name="swap-vertical" size={16} color={colors.primary} />
              </View>
            </View>
            {loadingArtists ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : (
              artists.map((artist, index) => (
                <View key={`${artist.id}-${index}`}>
                  {renderArtistItem({ item: artist })}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      );
    }

    if (activeCategory === 'Albums') {
      return (
        <View style={{ flex: 1, paddingHorizontal: spacing.m }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m, marginTop: spacing.s }}>
            <Text style={{ ...typography.header, fontSize: 20 }}>{albums.length} albums</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.primary, marginRight: 4, fontWeight: '600' }}>Date Modified</Text>
              <Ionicons name="swap-vertical" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {loadingAlbums ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : (
            <FlatList
              data={albums}
              renderItem={({ item }) => (
                <AlbumCard
                  name={item.name}
                  artist={item.artists?.primary?.[0]?.name || 'Unknown Artist'}
                  year={item.year}
                  songCount={item.songs?.length || item.songCount}
                  image={{ uri: item.image[2]?.url || item.image[0]?.url }}
                  onPress={() => (navigation as any).navigate('AlbumDetails', { id: item.id, albumData: item })}
                />
              )}
              keyExtractor={(item, index) => item.id || index.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>
      );
    }

    return (
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
              onPress={() => handleSongPress(item, recentlyPlayedSongs)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        {/* Artists */}
        <SectionHeader title="Artists" onSeeAll={() => setActiveCategory('Artists')} />
        {loadingArtists ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ margin: spacing.m }} />
        ) : (
          <FlatList
            data={artists.slice(0, 10)} // Show only top 10 in horizontal view
            renderItem={({ item }) => (
              <ArtistAvatar
                name={item.name}
                image={{ uri: item.image[2]?.url || item.image[0]?.url }}
                onPress={() => (navigation as any).navigate('ArtistDetails', { id: item.id, artistData: item })}
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
                onPress={() => handleSongPress(item, mostPlayedSongs)}
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
    );
  };

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

      {renderContent()}
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
  // Artist List Styles
  artistListContainer: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: colors.primary,
    fontWeight: '600',
  },
  artistListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  artistListImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.m,
  },
  artistListInfo: {
    flex: 1,
  },
  artistListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  artistListMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
