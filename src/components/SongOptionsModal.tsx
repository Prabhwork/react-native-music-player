import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, TouchableWithoutFeedback, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Song } from '../types/song';
import { usePlayerStore } from '../store/usePlayerStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: Song | null;
    onDelete?: (id: string) => void;
}

const ACTION_ITEMS = [
    { icon: 'arrow-forward-circle-outline', label: 'Play Next', id: 'playNext' },
    { icon: 'list-circle-outline', label: 'Add to Playing Queue', id: 'addToQueue' },
    { icon: 'add-circle-outline', label: 'Add to Playlist', id: 'addToPlaylist' },
    { icon: 'disc-outline', label: 'Go to Album', id: 'goToAlbum' },
    { icon: 'person-outline', label: 'Go to Artist', id: 'goToArtist' },
    { icon: 'information-circle-outline', label: 'Details', id: 'details' },
    { icon: 'call-outline', label: 'Set as Ringtone', id: 'ringtone' },
    { icon: 'share-social-outline', label: 'Share', id: 'share' },
    { icon: 'trash-outline', label: 'Delete from Device', id: 'delete', color: 'red' },
];

export const SongOptionsModal = ({ visible, onClose, song, onDelete }: SongOptionsModalProps) => {
    const navigation = useNavigation<any>();
    const { playSongNext, addToQueue } = usePlayerStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();

    if (!song) return null;

    const isFav = isFavorite(song.id);

    const imageSource = song.image && song.image.length > 0
        ? { uri: song.image[2]?.url || song.image[0]?.url }
        : require('../../assets/icon.png');

    const formatDuration = (seconds?: number | null) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAction = async (actionId: string) => {
        onClose();
        switch (actionId) {
            case 'playNext':
                await playSongNext(song);
                break;
            case 'addToQueue':
                await addToQueue(song);
                break;
            case 'addToPlaylist':
                Alert.alert('Coming Soon', 'Playlist functionality is under development.');
                break;
            case 'goToAlbum':
                if (song.album?.id) {
                    // Verify route exists or handle error, assuming simple push
                    navigation.navigate('AlbumDetails', { id: song.album.id });
                }
                break;
            case 'goToArtist':
                if (song.artists?.primary?.[0]?.id) {
                    navigation.navigate('ArtistDetails', { id: song.artists.primary[0].id });
                }
                break;
            case 'details':
                Alert.alert(
                    'Song Details',
                    `Title: ${song.name}\nArtist: ${song.artists.primary[0]?.name}\nAlbum: ${song.album?.name || 'N/A'}\nDuration: ${formatDuration(song.duration)}`
                );
                break;
            case 'ringtone':
                Alert.alert('Ringtone', `"${song.name}" set as ringtone!`);
                break;
            case 'share':
                try {
                    await Share.share({
                        message: `Check out this song: ${song.name} by ${song.artists.primary[0]?.name}`,
                        url: song.downloadUrl?.[0]?.url // Optional, for iOS
                    });
                } catch (error) {
                    console.error(error);
                }
                break;
            case 'delete':
                Alert.alert(
                    'Delete Song',
                    'Are you sure you want to remove this song from the list?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(song.id) }
                    ]
                );
                break;
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        {/* Drag Indicator */}
                        <View style={styles.dragIndicator} />

                        {/* Song Header */}
                        <View style={styles.header}>
                            <Image source={imageSource} style={styles.image} />
                            <View style={styles.headerInfo}>
                                <Text style={styles.title} numberOfLines={1}>{song.name}</Text>
                                <Text style={styles.meta} numberOfLines={1}>
                                    {song.artists.primary[0]?.name || 'Unknown'}  |  {formatDuration(song.duration)} mins
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleFavorite(song.id)}>
                                <Ionicons
                                    name={isFav ? "heart" : "heart-outline"}
                                    size={28}
                                    color={isFav ? colors.primary : colors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.separator} />

                        {/* Actions */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {ACTION_ITEMS.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.actionItem}
                                    onPress={() => handleAction(item.id)}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={24}
                                        color={item.color || colors.text}
                                    />
                                    <Text style={[styles.actionLabel, item.color && { color: item.color }]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.m,
        maxHeight: '80%',
        paddingBottom: spacing.xl,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: colors.gray,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.m,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: spacing.m,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    meta: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: colors.lightGray,
        marginBottom: spacing.m,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
    },
    actionLabel: {
        fontSize: 16,
        color: colors.text,
        marginLeft: spacing.m,
        fontWeight: '500',
    },
});
