import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/spacing';
import { Artist } from '../types/artist';
import { usePlayerStore } from '../store/usePlayerStore';

interface ArtistOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    artist: Artist | null;
}

import { Share, Alert, ActivityIndicator } from 'react-native';
import { artistService } from '../services/artistService';

export const ArtistOptionsModal = ({ visible, onClose, artist }: ArtistOptionsModalProps) => {
    if (!artist) return null;

    const { playSong, addToQueue, playSongNext } = usePlayerStore();
    const [loading, setLoading] = React.useState(false);

    const fetchSongs = async () => {
        setLoading(true);
        const songs = await artistService.getArtistSongs(artist.id);
        setLoading(false);
        return songs;
    };

    const handlePlay = async () => {
        const songs = await fetchSongs();
        if (songs && songs.length > 0) {
            playSong(songs[0], songs);
            onClose();
        } else {
            Alert.alert("No songs", "Could not find songs for this artist.");
        }
    };

    const handlePlayNext = async () => {
        const songs = await fetchSongs();
        if (songs && songs.length > 0) {
            // Add top 5 songs to play next, in reverse order so the first one ends up immediately next
            // providing a "queue next" experience
            const songsToAdd = songs.slice(0, 5).reverse();
            for (const song of songsToAdd) {
                await playSongNext(song);
            }
            onClose();
        }
    };

    const handleAddToQueue = async () => {
        const songs = await fetchSongs();
        if (songs && songs.length > 0) {
            for (const song of songs) {
                await addToQueue(song);
            }
            Alert.alert("Added to Queue", `${songs.length} songs added to queue.`);
            onClose();
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Listen to ${artist.name} on Mume Music! 🎵\n\nStream your favorite songs for free.`,
                title: `Listen to ${artist.name}`,
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddToPlaylist = () => {
        Alert.alert("Coming Soon", "Playlist functionality is currently in development.");
        onClose();
    };

    const menuItems = [
        {
            icon: 'play-circle-outline',
            label: 'Play',
            onPress: handlePlay,
        },
        {
            icon: 'arrow-forward-circle-outline',
            label: 'Play Next',
            onPress: handlePlayNext,
        },
        {
            icon: 'layers-outline',
            label: 'Add to Playing Queue',
            onPress: handleAddToQueue,
        },
        {
            icon: 'add-circle-outline',
            label: 'Add to Playlist',
            onPress: handleAddToPlaylist,
        },
        {
            icon: 'share-social-outline',
            label: 'Share',
            onPress: handleShare,
        },
    ];

    // Determine image source
    const imageSource = artist.image && artist.image.length > 0
        ? { uri: artist.image[2]?.url || artist.image[0]?.url }
        : require('../../assets/icon.png');

    // Metadata text
    const albumCount = artist.topAlbums ? artist.topAlbums.length : 1;
    // API might not give song count directly in all contexts, fallback to dummy or available data
    const songCount = artist.topSongs ? artist.topSongs.length : 20;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.handleIndicator} />

                            {/* Header */}
                            <View style={styles.header}>
                                <Image source={imageSource} style={styles.artistImage} />
                                <View style={styles.artistInfo}>
                                    <Text style={styles.artistName}>{artist.name}</Text>
                                    <Text style={styles.artistMeta}>{`${albumCount} Album | ${songCount} Songs`}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            {/* Actions */}
                            {loading ? (
                                <ActivityIndicator size="large" color={colors.primary} style={{ margin: spacing.xl }} />
                            ) : (
                                <View style={styles.actionsContainer}>
                                    {menuItems.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.actionRow}
                                            onPress={item.onPress}
                                        >
                                            <Ionicons name={item.icon as any} size={26} color={colors.text} style={styles.actionIcon} />
                                            <Text style={styles.actionLabel}>{item.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: spacing.xl,
        paddingTop: spacing.s,
        backgroundColor: '#fff', // Explicitly white as per image, or use theme color if 'colors.surface' or 'colors.card'
    },
    handleIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.m,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.m,
    },
    artistImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: spacing.m,
    },
    artistInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    artistName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', // Making sure it's dark
        marginBottom: 4,
    },
    artistMeta: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: spacing.s,
    },
    actionsContainer: {
        paddingHorizontal: spacing.l,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
    },
    actionIcon: {
        marginRight: spacing.l,
        color: '#000',
    },
    actionLabel: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
});
