import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { SectionHeader } from '../../components/SectionHeader';
import { SongCard } from '../../components/SongCard';
import { ArtistAvatar } from '../../components/ArtistAvatar';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { artistService } from '../../services/artistService';

import { Artist } from '../../types/artist';
import { Song } from '../../types/song';

// Sample Artist IDs
const SAMPLE_ARTIST_IDS = ['459320', '464656', '456269', '485956', '568565'];

const HomeScreen = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState<Song[]>([]);
  const [recentlyPlayedSongs, setRecentlyPlayedSongs] = useState<Song[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Fetch Artists
        setLoadingArtists(true);
        const artistsData = await artistService.getMultipleArtists(
          SAMPLE_ARTIST_IDS
        );
        setArtists(artistsData);
        setLoadingArtists(false);

        // 🔹 Collect top songs
        const allTopSongs: Song[] = [];
        artistsData.forEach((artist) => {
          if (artist.topSongs) {
            allTopSongs.push(...artist.topSongs);
          }
        });

        const shuffled = [...allTopSongs].sort(() => 0.5 - Math.random());
        setMostPlayedSongs(shuffled.slice(0, 10));
        setRecentlyPlayedSongs(shuffled.slice(10, 15));
        setLoadingSongs(false);
      } catch (e) {
        setLoadingArtists(false);
        setLoadingSongs(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recently Played */}
        <SectionHeader title="Recently Played" onSeeAll={() => {}} />
        <FlatList
          data={recentlyPlayedSongs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <SongCard
              title={item.name}
              artist={item.artists.primary[0]?.name || 'Unknown Artist'}
              image={{ uri: item.image[2]?.url || item.image[0]?.url }}
            />
          )}
        />

        {/* Artists */}
        <SectionHeader title="Artists" onSeeAll={() => {}} />
        {loadingArtists ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ margin: spacing.m }}
          />
        ) : (
          <FlatList
            data={artists}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <ArtistAvatar
                name={item.name}
                image={{ uri: item.image[2]?.url || item.image[0]?.url }}
              />
            )}
          />
        )}

        {/* Most Played */}
        <SectionHeader title="Most Played" onSeeAll={() => {}} />
        {loadingSongs ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ margin: spacing.m }}
          />
        ) : (
          <FlatList
            data={mostPlayedSongs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <SongCard
                title={item.name}
                artist={item.artists.primary[0]?.name || 'Unknown Artist'}
                image={{ uri: item.image[2]?.url || item.image[0]?.url }}
                variant="large"
              />
            )}
          />
        )}

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
  horizontalList: {
    paddingHorizontal: spacing.m,
  },
});
