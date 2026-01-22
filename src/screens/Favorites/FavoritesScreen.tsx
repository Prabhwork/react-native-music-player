import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HomeHeader } from '../../components/HomeHeader';
import { SongListItem } from '../../components/SongListItem';
import { SongOptionsModal } from '../../components/SongOptionsModal';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { songService } from '../../services/songService';
import { Song } from '../../types/song';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = () => {
    const { favorites } = useFavoritesStore();
    const { playSong } = usePlayerStore();
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchFavorites = async () => {
                if (favorites.length === 0) {
                    setSongs([]);
                    return;
                }
                setLoading(true);
                const data = await songService.getSongsByIds(favorites);
                setSongs(data);
                setLoading(false);
            };

            fetchFavorites();
        }, [favorites])
    );

    const handleSongPress = (song: Song) => {
        playSong(song, songs);
        // @ts-ignore
        navigation.navigate('Player');
    };

    if (loading && songs.length === 0) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HomeHeader />
            <View style={styles.header}>
                <Text style={styles.title}>Your Favorites</Text>
                <Text style={styles.subtitle}>{songs.length} songs</Text>
            </View>

            {songs.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="heart-outline" size={64} color={colors.gray} />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>Mark songs as favorites to see them here</Text>
                </View>
            ) : (
                <FlatList
                    data={songs}
                    renderItem={({ item }) => (
                        <SongListItem
                            song={item}
                            onPress={() => handleSongPress(item)}
                            onOptionPress={() => {
                                setSelectedSong(item);
                                setModalVisible(true);
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <SongOptionsModal
                visible={isModalVisible}
                song={selectedSong}
                onClose={() => setModalVisible(false)}
                onDelete={(id) => {
                    // Start removing from list visually immediately if needed, 
                    // though useFocusEffect/store update will handle re-render when heart is toggled
                    setModalVisible(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: spacing.m,
        marginBottom: spacing.m,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: spacing.m,
        paddingBottom: 100,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: spacing.m,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.s,
    },
});

export default FavoritesScreen;
