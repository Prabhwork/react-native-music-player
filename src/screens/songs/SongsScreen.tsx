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

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Artist = {
  id: string;
  name: string;
  image: { quality: string; url: string }[];
};

type Song = {
  id: string;
  name: string;
  duration: number | null;
  artists: { primary: Artist[] };
  image: { quality: string; url: string }[];
};

const SongsScreen: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const allSongs: Song[] = [];
      const playlistIds = ['110858205', '1134543273', '1180186064'];

      for (const id of playlistIds) {
        const res = await fetch(`https://saavn.sumit.co/api/playlists?id=${id}`);
        const json = await res.json();
        if (json?.success && json?.data?.songs) {
          allSongs.push(...json.data.songs);
        }
      }

      const unique = allSongs.filter(
        (song, i, self) => i === self.findIndex(s => s.id === song.id)
      );

      setSongs(unique);
    } catch (e) {
      console.log('Song fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (sec: number | null) => {
    if (!sec) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const renderItem = ({ item }: { item: Song }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.image?.[0]?.url }} style={styles.cover} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.artist}>
          {item.artists?.primary?.[0]?.name || 'Unknown'} ·{' '}
          {formatDuration(item.duration)}
        </Text>
      </View>

      <TouchableOpacity style={styles.playBtn}>
        <Text style={{ color: '#fff' }}>▶</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.m,
          paddingBottom: 120, // bottom tab space
        }}
      />
    </View>
  );
};

export default SongsScreen;

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  artist: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
