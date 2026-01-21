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

type Artist = {
  id: string;
  name: string;
  role: string;
  type: string;
  image: { quality: string; url: string }[];
  url: string;
};

type Song = {
  id: string;
  name: string;
  type: string;
  year: number | null;
  releaseDate: string | null;
  duration: number | null;
  label: string | null;
  explicitContent: boolean;
  playCount: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  url: string;
  copyright: string | null;
  album: {
    id: string | null;
    name: string | null;
    url: string | null;
  };
  artists: {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
  };
  image: { quality: string; url: string }[];
  downloadUrl: { quality: string; url: string }[];
};

const SongsScreen: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      // Fetch from popular playlists to get a good collection of songs
      const playlistRes = await fetch('https://saavn.sumit.co/api/playlists?id=110858205');
      const playlistJson = await playlistRes.json();

      if (playlistJson?.success && playlistJson?.data?.songs) {
        setSongs(playlistJson.data.songs);
      } else {
        // Fallback to search
        const searchRes = await fetch('https://saavn.sumit.co/api/search/songs?query=bollywood&limit=50');
        const searchJson = await searchRes.json();
        if (searchJson?.success && searchJson?.data?.results) {
          setSongs(searchJson.data.results);
        }
      }
    } catch (e) {
      console.log('Song fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const formatDuration = (sec: number | null) => {
    if (!sec) return '00:00 mins';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} mins`;
  };

  const getArtistName = (song: Song) => {
    if (song.artists?.primary && song.artists.primary.length > 0) {
      return song.artists.primary[0].name;
    }
    return 'Unknown Artist';
  };

  const getImageUrl = (song: Song) => {
    if (song.image && song.image.length > 0) {
      // Get medium or high quality image
      const mediumImg = song.image.find(img => img.quality === '500x500');
      const highImg = song.image.find(img => img.quality === '150x150');
      return mediumImg?.url || highImg?.url || song.image[0].url;
    }
    return '';
  };

  const renderItem = ({ item }: { item: Song }) => (
    <View style={styles.row}>
      <Image
        source={{ uri: getImageUrl(item) }}
        style={styles.cover}
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {getArtistName(item)} | {formatDuration(item.duration)}
        </Text>
      </View>

      <TouchableOpacity style={styles.playBtn}>
        <Text style={styles.playIcon}>▶</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBtn}>
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6A00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎵 Mume</Text>
        <TouchableOpacity>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={styles.tab}>Suggested</Text>
        <Text style={[styles.tab, styles.activeTab]}>Songs</Text>
        <Text style={styles.tab}>Artists</Text>
        <Text style={styles.tab}>Albums</Text>
      </View>

      {/* Song Count */}
      <View style={styles.countRow}>
        <Text style={styles.count}>{songs.length} songs</Text>
        <Text style={styles.sortText}>Ascending ⬍</Text>
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>♡</Text>
          <Text style={styles.navLabel}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>▤</Text>
          <Text style={styles.navLabel}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SongsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchIcon: {
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    fontSize: 15,
    color: '#888',
    marginRight: 24,
    paddingBottom: 8,
  },
  activeTab: {
    color: '#FF6A00',
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6A00',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortText: {
    fontSize: 13,
    color: '#FF6A00',
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
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
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  playIcon: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 2,
  },
  menuBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#888',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
    color: '#888',
  },
  navIconActive: {
    fontSize: 22,
    color: '#FF6A00',
  },
  navLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  navLabelActive: {
    fontSize: 11,
    color: '#FF6A00',
    marginTop: 4,
  },
});