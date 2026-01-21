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

type Album = {
  id: string;
  name: string;
  year: number;
  image: { quality: string; url: string }[];
};

const AlbumsScreen = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch(
        'https://saavn.sumit.co/api/search/albums?query=trending&limit=50'
      );
      const json = await res.json();

      if (json?.success && json?.data?.results) {
        setAlbums(json.data.results);
      }
    } catch (e) {
      console.log('Album fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  const getImage = (album: Album) => {
    return album.image?.[1]?.url || album.image?.[0]?.url || '';
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
      <HomeHeader activeCategory="Albums" />

      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: getImage(item) }} style={styles.cover} />
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.year}>{item.year}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AlbumsScreen;

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
    marginBottom: spacing.l,
    marginHorizontal: spacing.s,
  },
  cover: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: spacing.s,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  year: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
