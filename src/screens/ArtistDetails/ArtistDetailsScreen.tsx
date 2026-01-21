import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { artistService } from '../../services/artistService';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Artist } from '../../types/artist';
import { Song } from '../../types/song';
import { colors } from '../../theme/colors';
import { spacing, typography } from '../../theme/spacing';

const ArtistDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const params = route.params as { id: string; artistData?: Artist };
    const { id, artistData } = params || {};

    const [artist, setArtist] = useState<Artist | null>(artistData || null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(!artistData);
    const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayerStore();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            if (!artist) {
                const data = await artistService.getArtistDetails(id);
                if (data) setArtist(data);
            }
            const artistSongs = await artistService.getArtistSongs(id);
            setSongs(artistSongs);
            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playSong(songs[0], songs);
            navigation.navigate('Player' as never);
        }
    };

    const handleShuffle = () => {
        if (songs.length > 0) {
            const shuffled = [...songs].sort(() => Math.random() - 0.5);
            playSong(shuffled[0], shuffled);
            navigation.navigate('Player' as never);
        }
    };

    const handleSongPress = (song: Song) => {
        if (currentSong?.id === song.id) {
            togglePlayPause();
        } else {
            playSong(song, songs);
            // Optional: Don't navigate to player immediately if just playing from list, 
            // or keep navigation if that's the desired UX. User said: 
            // "so they can be able to handle it without going to songs playing page"
            // So we REMOVE navigation.navigate('Player') here.
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!artist) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Artist not found</Text>
            </View>
        );
    }

    const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
        const isCurrent = currentSong?.id === item.id;
        const artistNames = item.artists?.primary?.map(a => a.name).join(', ') || item.label || 'Unknown Artist';

        return (
            <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
                <Image source={{ uri: item.image[1]?.url || item.image[0]?.url }} style={styles.songImage} />
                <View style={styles.songInfo}>
                    <Text style={[styles.songName, isCurrent && styles.activeText]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                        {artistNames}
                    </Text>
                </View>
                <View style={styles.songActions}>
                    {isCurrent ? (
                        <Ionicons
                            name={isPlaying ? "pause-circle" : "play-circle"}
                            size={28}
                            color={colors.primary}
                        />
                    ) : (
                        <Ionicons name="play-circle-outline" size={24} color={colors.textSecondary} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const Header = () => (
        <View style={styles.header}>
            <View style={styles.heroContainer}>
                <ImageBackground
                    source={{ uri: artist?.image[2]?.url || artist?.image[1]?.url }}
                    style={styles.heroImage}
                    blurRadius={30}
                >
                    <View style={styles.overlay} />
                    <View style={[styles.headerTop, { marginTop: insets.top }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.artistInfoContainer}>
                        <Image source={{ uri: artist?.image[2]?.url || artist?.image[1]?.url }} style={styles.artistMainImage} />
                        <Text style={styles.name}>{artist?.name}</Text>
                        <Text style={styles.followers}>
                            {artist?.fanCount ? `${(artist.fanCount / 1000).toFixed(1)}K Fans` : 'Artist'} • {songs.length} Songs
                        </Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.button, styles.shuffleButton]} onPress={handleShuffle}>
                    <Ionicons name="shuffle" size={24} color={colors.text} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Shuffle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.playButton]} onPress={handlePlayAll}>
                    <Ionicons name="play" size={24} color={colors.background} style={styles.buttonIcon} />
                    <Text style={[styles.buttonText, { color: colors.background }]}>Play</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Songs</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={songs}
                renderItem={renderSongItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={Header}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
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
        marginBottom: spacing.m,
    },
    heroContainer: {
        height: 350,
        marginBottom: spacing.l,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerTop: {
        position: 'absolute',
        top: 0,
        left: spacing.m,
        zIndex: 10,
    },
    backButton: {
        padding: spacing.s,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    artistInfoContainer: {
        alignItems: 'center',
        paddingBottom: spacing.m,
    },
    artistMainImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: spacing.m,
        borderWidth: 2,
        borderColor: colors.white,
    },
    name: {
        ...typography.header,
        color: colors.white,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    followers: {
        ...typography.artistName,
        color: colors.gray,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.m,
        marginBottom: spacing.l,
        paddingHorizontal: spacing.m,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.m,
        borderRadius: 30,
        maxWidth: 160,
    },
    shuffleButton: {
        backgroundColor: colors.lightGray,
    },
    playButton: {
        backgroundColor: colors.primary,
    },
    buttonIcon: {
        marginRight: spacing.s,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    sectionHeader: {
        paddingHorizontal: spacing.m,
        marginBottom: spacing.s,
    },
    sectionTitle: {
        ...typography.sectionTitle,
        color: colors.text,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        marginBottom: spacing.xs,
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: spacing.m,
    },
    songInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    songName: {
        ...typography.songTitle,
        color: colors.text,
        marginBottom: 2,
    },
    artistName: {
        ...typography.artistName,
        color: colors.textSecondary,
    },
    activeText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    songActions: {
        padding: spacing.xs,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    }
});

export default ArtistDetailsScreen;
