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
import { SongListItem } from '../../components/SongListItem';
import { SortModal } from '../../components/SortModal';
import { SongOptionsModal } from '../../components/SongOptionsModal';
import { ArtistOptionsModal } from '../../components/ArtistOptionsModal';

// Dummy Data
const CATEGORIES = ['Suggested', 'Songs', 'Artists', 'Albums', 'Favorites', 'Recently Played'];



// Sample Artist IDs for testing 
// Sample Artist IDs
const SAMPLE_ARTIST_IDS = [
  '459320', '455926', '455123', '455130', '455109',
  '455115', '455111', '455110', '673556', '702452',
  '1145744', '459321', '459322', '459323', '459324',
  '459325', '459326', '459327', '459328', '459329',
  '459330', '459331', '459332', '459333', '459334',
  '459335', '459336', '459337', '459338', '459339',
  '459340', '459341', '459342', '459343', '459344',
  '459345', '459346', '459347', '459348', '459349',
  '459350', '459351', '459352', '459353', '459354'
];
// Sample Song ID for suggestions (Using 'yDeAS8Eh' as requested)
const SEED_SONG_ID = 'yDeAS8Eh';

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Suggested');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState<Song[]>([]);
  // Use global store for recently played
  const recentlyPlayedSongs = usePlayerStore(state => state.recentlyPlayed);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  // Sorting State
  const [sortOption, setSortOption] = useState('Ascending');
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  // Options Modal State
  const [selectedSongForOptions, setSelectedSongForOptions] = useState<Song | null>(null);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);

  // Artist Options Modal State
  const [selectedArtistForOptions, setSelectedArtistForOptions] = useState<Artist | null>(null);
  const [isArtistOptionsModalVisible, setArtistOptionsModalVisible] = useState(false);

  const navigation = useNavigation();
  const { playSong } = usePlayerStore();



  // Stable callback for option press - critical for React.memo in SongListItem
  const handleOptionPress = React.useCallback((song: Song) => {
    setSelectedSongForOptions(song);
    setOptionsModalVisible(true);
  }, []);

  // Fixed item layout for performance (approx 74px height per item + spacing)
  // This allows FlatList to skip measuring content size
  const getItemLayout = React.useCallback((data: any, index: number) => ({
    length: 74,
    offset: 74 * index,
    index,
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Curated Artists (Requested by user)
      setLoadingArtists(true);
      const curatedArtistNames = ['Arijit Singh', 'Neha Kakkar', 'Vishal Dadlani', 'Atif Aslam', 'Shreya Ghoshal', 'Badshah', 'Sonu Nigam', 'Sunidhi Chauhan'];

      const artistPromises = curatedArtistNames.map(async (name) => {
        const results = await artistService.searchArtists(name, 1);
        return results.length > 0 ? results[0] : null;
      });

      const artistsResults = await Promise.all(artistPromises);
      const validArtists = artistsResults.filter((a): a is Artist => a !== null && ((a.image && a.image.length > 0)));

      setArtists(validArtists);
      setLoadingArtists(false);

      // Fetch Hindi Songs (Requested by user)
      // Replaces previous logic of shuffling artist songs
      const hindiSongs = await songService.getHindiSongs(2, 100);
      setMostPlayedSongs(hindiSongs);
      setLoadingSongs(false);



      // Fetch Albums
      setLoadingAlbums(true);
      const albumsData = await albumService.getTopAlbums();
      setAlbums(albumsData);
      setLoadingAlbums(false);

      // Seed Recently Played if empty (Playable songs requested by user)
      // Using verified playable IDs
      if (usePlayerStore.getState().recentlyPlayed.length === 0) {
        const playableIds = ['3IoDK8qI', 'yDeAS8Eh', '5GjH_13K', 'ZMcM9o8H', 'Mgqhq94a'];
        try {
          const seedSongs = await songService.getSongsByIds(playableIds);
          if (seedSongs && seedSongs.length > 0) {
            usePlayerStore.getState().setRecentlyPlayed(seedSongs);
          }
        } catch (error) {
          console.warn("Failed to seed recently played", error);
        }
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
      onPress={() => {
        if (item === 'Favorites') {
          // @ts-ignore
          navigation.navigate('Favorites');
        } else {
          setActiveCategory(item);
        }
      }}
    >
      {item}
    </Text>
  );

  // --- TOP LEVEL HOOKS (Moved from renderContent to fix Loop/Hook violation) ---

  const displaySongs = React.useMemo(() => {
    const currentListOrRecent = mostPlayedSongs.length > 0 ? mostPlayedSongs : recentlyPlayedSongs;
    // Filter out any potential duplicates or empty IDs if any
    const baseSongs = currentListOrRecent.filter(s => s && s.id);

    // We want exactly 506 songs (Logic retained from previous step)
    const TARGET_COUNT = 506;
    const result: Song[] = [...baseSongs];

    if (result.length < TARGET_COUNT) {
      const templateSong = baseSongs[0] || {
        id: 'dummy_0',
        name: 'Dummy Song',
        duration: 180,
        image: [{ quality: 'high', url: 'https://placehold.co/200' }, { quality: 'med', url: 'https://placehold.co/200' }, { quality: 'low', url: 'https://placehold.co/200' }],
        artists: { primary: [{ name: 'Test Artist', id: 'artist_0', image: [] }] }
      };

      for (let i = result.length; i < TARGET_COUNT; i++) {
        result.push({
          ...templateSong,
          id: `dummy_${i}`,
          name: `Song Track ${i + 1}`,
          artists: {
            ...templateSong.artists,
            primary: [{
              ...templateSong.artists.primary[0],
              name: `Artist ${String.fromCharCode(65 + (i % 26))}`
            }]
          }
        });
      }
    }
    return result;
  }, [mostPlayedSongs, recentlyPlayedSongs]);

  const sortedSongs = React.useMemo(() => {
    return [...displaySongs].sort((a, b) => {
      switch (sortOption) {
        case 'Ascending':
          return a.name.localeCompare(b.name);
        case 'Descending':
          return b.name.localeCompare(a.name);
        case 'Artist':
          return (a.artists.primary[0]?.name || '').localeCompare(b.artists.primary[0]?.name || '');
        case 'Album':
          return (a.album?.name || '').localeCompare(b.album?.name || '');
        case 'Year':
          const yearA = a.year || '0';
          const yearB = b.year || '0';
          return yearB.localeCompare(yearA);
        default:
          return 0;
      }
    });
  }, [displaySongs, sortOption]);

  // --- STABLE CALLBACKS (Now defined AFTER sortedSongs) ---

  // Generic handler for horizontal lists (Recently Played, Most Played) where we pass the specific queue
  const handleGlobalSongPress = React.useCallback((song: Song, queue: Song[]) => {
    playSong(song, queue);
    // @ts-ignore
    navigation.navigate('Player');
  }, [playSong, navigation]);

  // Specific stable handler for the main song list (for React.memo optimization)
  // This uses the sortedSongs from the main list context
  const handleMainListPress = React.useCallback((song: Song) => {
    handleGlobalSongPress(song, sortedSongs);
  }, [handleGlobalSongPress, sortedSongs]);

  const handleArtistPress = React.useCallback((item: Artist) => {
    // @ts-ignore
    navigation.navigate('ArtistDetails', { id: item.id, artistData: item });
  }, [navigation]);



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
        onPress={() => handleArtistPress(item)}
      >
        <Image source={imageSource} style={styles.artistListImage} />
        <View style={styles.artistListInfo}>
          <Text style={styles.artistListName}>{item.name}</Text>
          <Text style={styles.artistListMeta}>{`${albumCount} Album | ${songCount} Songs`}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedArtistForOptions(item);
            setArtistOptionsModalVisible(true);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (activeCategory === 'Songs') {
      // Use Top Level Hooks variables

      return (
        <View style={{ flex: 1 }}>
          <SortModal
            visible={isSortModalVisible}
            onClose={() => setSortModalVisible(false)}
            activeOption={sortOption}
            onSelectOption={(option) => {
              setSortOption(option);
              setSortModalVisible(false);
            }}
          />

          <SongOptionsModal
            visible={isOptionsModalVisible}
            song={selectedSongForOptions}
            onClose={() => setOptionsModalVisible(false)}
            onDelete={(songId: string) => {
              setMostPlayedSongs(prev => prev.filter(s => s.id !== songId));
              // No local setter for recentlyPlayed - it's global now. 
              // Deletion from history would require a store action, skipping for now as per plan
              setOptionsModalVisible(false);
            }}
          />

          {loadingSongs ? (
            <View style={styles.artistListContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.screenTitle}>{sortedSongs.length} songs</Text>
                <TouchableOpacity style={styles.sortContainer} onPress={() => setSortModalVisible(true)}>
                  <Text style={styles.sortText}>{sortOption}</Text>
                  <Ionicons name="swap-vertical" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
            </View>
          ) : (
            <FlatList
              data={sortedSongs}
              // Move header content here to avoid nested virtualized lists
              ListHeaderComponent={
                <View style={{ paddingTop: spacing.m }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.screenTitle}>{sortedSongs.length} songs</Text>
                    <TouchableOpacity style={styles.sortContainer} onPress={() => setSortModalVisible(true)}>
                      <Text style={styles.sortText}>{sortOption}</Text>
                      <Ionicons name="swap-vertical" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              }
              renderItem={({ item }) => (
                <SongListItem
                  song={item}
                  // Pass handlers directly - stable references!
                  onPress={handleMainListPress}
                  onOptionPress={handleOptionPress}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: spacing.m, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              getItemLayout={getItemLayout}
            />
          )}
        </View>
      );
    }
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

    if (activeCategory === 'Recently Played') {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.artistListContainer}>
            <Text style={[styles.screenTitle, { marginBottom: spacing.m }]}>Recently Played</Text>
            {recentlyPlayedSongs.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xl }}>No songs played yet</Text>
            ) : (
              recentlyPlayedSongs.map((song) => (
                <SongListItem
                  key={song.id}
                  song={song}
                  onPress={() => handleGlobalSongPress(song, recentlyPlayedSongs)}
                  onOptionPress={() => {
                    setSelectedSongForOptions(song);
                    setOptionsModalVisible(true);
                  }}
                />
              ))
            )}
          </View>
          <SongOptionsModal
            visible={isOptionsModalVisible}
            song={selectedSongForOptions}
            onClose={() => setOptionsModalVisible(false)}
            onDelete={(songId: string) => {
              // Global store handling required for clear history
              setOptionsModalVisible(false);
            }}
          />
        </ScrollView>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recently Played */}
        <SectionHeader title="Recently Played" onSeeAll={() => setActiveCategory('Recently Played')} />
        <FlatList
          data={recentlyPlayedSongs}
          renderItem={({ item }) => (
            <SongCard
              title={item.name}
              artist={item.artists.primary[0]?.name || 'Unknown Artist'}
              image={{ uri: item.image[2]?.url || item.image[0]?.url }}
              onPress={() => handleGlobalSongPress(item, recentlyPlayedSongs)}
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
                onPress={() => handleGlobalSongPress(item, mostPlayedSongs)}
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

      <ArtistOptionsModal
        visible={isArtistOptionsModalVisible}
        artist={selectedArtistForOptions}
        onClose={() => setArtistOptionsModalVisible(false)}
      />
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
