import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { albumService } from '../../services/albumService';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Album } from '../../types/album';
import { Song } from '../../types/song';
import { colors } from '../../theme/colors';
import { spacing, typography } from '../../theme/spacing';

const AlbumDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const params = route.params as { id: string; albumData?: Album };
    const { id, albumData } = params || {};

    const [album, setAlbum] = useState<Album | null>(albumData || null);
    const [loading, setLoading] = useState(!albumData);
    const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayerStore();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            // If we didn't pass full data, or just want to refresh/get songs
            const data = await albumService.getAlbumDetails(id);
            if (data) {
                setAlbum(data);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    const handlePlayAll = () => {
        if (album?.songs && album.songs.length > 0) {
            playSong(album.songs[0], album.songs);
            navigation.navigate('Player' as never);
        }
    };

    const handleShuffle = () => {
        if (album?.songs && album.songs.length > 0) {
            const shuffled = [...album.songs].sort(() => Math.random() - 0.5);
            playSong(shuffled[0], shuffled);
            navigation.navigate('Player' as never);
        }
    };

    const handleSongPress = (song: Song) => {
        if (currentSong?.id === song.id) {
            togglePlayPause();
        } else {
            // If playing a song from the album, the queue should ideally be the album songs
            if (album?.songs) {
                playSong(song, album.songs);
            } else {
                playSong(song, [song]); // Fallback
            }
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!album) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Album not found</Text>
            </View>
        );
    }

    const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
        const isCurrent = currentSong?.id === item.id;
        const artistNames = item.artists?.primary?.map(a => a.name).join(', ') || item.label || 'Unknown Artist';
        // Album songs API might differ slightly, but structure usually matches Song type

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
                    source={{ uri: album?.image[2]?.url || album?.image[1]?.url }}
                    style={styles.heroImage}
                    blurRadius={30}
                >
                    <View style={styles.overlay} />
                    <View style={[styles.headerTop, { marginTop: insets.top }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="search" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.backButton, { marginLeft: spacing.s }]}>
                            <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.artistInfoContainer}>
                        <Image source={{ uri: album?.image[2]?.url || album?.image[1]?.url }} style={styles.artistMainImage} />
                        <Text style={styles.name}>{album?.name}</Text>
                        <Text style={styles.followers}>
                            1 Album • {album?.songs?.length || album?.songCount || 0} Songs • {album?.year || ''}
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
                <Text style={styles.sectionTitle}>Songs</Text>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>See All</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={album?.songs || []}
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
        right: spacing.m,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
        width: 160,
        height: 160,
        borderRadius: 20, // Album art usually square/rounded rect
        marginBottom: spacing.m,
        borderWidth: 2,
        borderColor: colors.white,
    },
    name: {
        ...typography.header,
        color: colors.white,
        marginBottom: spacing.xs,
        textAlign: 'center',
        paddingHorizontal: spacing.l,
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
        backgroundColor: colors.primary, // Orange for Shuffle per screenshot
    },
    playButton: {
        backgroundColor: colors.lightGray, // Light for play per screenshot
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

export default AlbumDetailsScreen;
