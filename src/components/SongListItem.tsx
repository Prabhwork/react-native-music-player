import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types/song';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/spacing';

interface SongListItemProps {
    song: Song;
    onPress: (song: Song) => void;
    onOptionPress?: (song: Song) => void;
    isPlaying?: boolean;
}

// Wrap in React.memo to prevent unnecessary re-renders
export const SongListItem = React.memo(({ song, onPress, onOptionPress, isPlaying = false }: SongListItemProps) => {
    // Format duration from seconds to mm:ss
    const formatDuration = (seconds?: number | null) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const imageSource = song.image && song.image.length > 0
        ? { uri: song.image[2]?.url || song.image[0]?.url }
        : require('../../assets/icon.png');

    const handlePress = () => onPress(song);
    const handleOptionPress = () => onOptionPress?.(song);

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Image source={imageSource} style={styles.image} />

            <View style={styles.contentContainer}>
                <Text style={[styles.title, isPlaying && styles.activeTitle]} numberOfLines={1}>
                    {song.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {song.artists.primary[0]?.name || 'Unknown Artist'} | {formatDuration(song.duration)} mins
                </Text>
            </View>

            <TouchableOpacity style={styles.playButton} onPress={handlePress}>
                <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={32} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleOptionPress}>
                <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    // Custom equality check for performance
    // Only re-render if song ID, playing state, or callback references change
    return (
        prevProps.song.id === nextProps.song.id &&
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.onPress === nextProps.onPress &&
        prevProps.onOptionPress === nextProps.onOptionPress
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
        marginBottom: spacing.s,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8, // Rounded corners as per design
        backgroundColor: colors.gray,
    },
    contentContainer: {
        flex: 1,
        marginLeft: spacing.m,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    activeTitle: {
        color: colors.primary,
    },
    artist: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    playButton: {
        padding: spacing.xs,
    },
    optionButton: {
        padding: spacing.s,
        marginLeft: spacing.xs,
    },
});
