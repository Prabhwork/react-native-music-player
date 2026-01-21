import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { HomeHeader } from '../../components/HomeHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Artist = {
  id: string;
  name: string;
  image: { quality: string; url: string }[];
};

const ArtistsScreen = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await fetch(
        'https://saavn.sumit.co/api/search/artists?query=popular&limit=50'
      );
      const json = await res.json();

      if (json?.success && json?.data?.results) {
        setArtists(json.data.results);
      }
    } catch (e) {
      console.log('Artist fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  const getImage = (artist: Artist) => {
    return artist.image?.[1]?.url || artist.image?.[0]?.url || '';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔝 COMMON HEADER */}
      <HomeHeader activeCategory="Artists" />

      <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImage(item) }} style={styles.avatar} />
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ArtistsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.m,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#eee',
    marginBottom: spacing.s,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
