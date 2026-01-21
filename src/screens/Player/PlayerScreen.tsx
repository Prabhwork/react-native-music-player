import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing, typography } from '../../theme/spacing';
import { usePlayerStore } from '../../store/usePlayerStore';

const { width } = Dimensions.get('window');

const PlayerScreen = () => {
    const navigation = useNavigation();
    const { currentSong, isPlaying, duration, position, togglePlayPause, playNext, playPrevious, seek, initializeAudio } = usePlayerStore();

    useEffect(() => {
        initializeAudio();
    }, []);

    const formatTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentSong) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>No song playing</Text>
            </View>
        );
    }

    // Handle generic ImageSource vs URI
    const imageSource = currentSong.image && currentSong.image.length > 0
        ? { uri: currentSong.image[2]?.url || currentSong.image[0]?.url }
        : require('../../../assets/icon.png'); // Fallback

    const artistName = currentSong.artists?.primary?.[0]?.name || 'Unknown Artist';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-down" size={30} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Now Playing</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>

                {/* Artwork */}
                <View style={styles.artworkContainer}>
                    <Image source={imageSource} style={styles.artwork} />
                </View>

                {/* Meta */}
                <View style={styles.metaContainer}>
                    <Text style={styles.title} numberOfLines={1}>{currentSong.name}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{artistName}</Text>
                </View>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Slider
                        style={{ width: width - 40, height: 40 }}
                        minimumValue={0}
                        maximumValue={duration}
                        value={position}
                        onSlidingComplete={seek}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.lightGray}
                        thumbTintColor={colors.primary}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity>
                        <Ionicons name="shuffle" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playPrevious}>
                        <Ionicons name="play-skip-back" size={36} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                        <Ionicons name={isPlaying ? "pause" : "play"} size={36} color={colors.white} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playNext}>
                        <Ionicons name="play-skip-forward" size={36} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="repeat" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Bottom Actions */}
                <View style={styles.bottomActions}>
                    <Ionicons name="timer-outline" size={24} color={colors.text} />
                    <Ionicons name="share-social-outline" size={24} color={colors.text} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 50, // Safe area manual or could use hook
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    artworkContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: spacing.xl,
    },
    artwork: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 20,
    },
    metaContainer: {
        alignItems: 'center',
        marginBottom: spacing.l,
        paddingHorizontal: spacing.l,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    artist: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -10,
    },
    timeText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: spacing.xl,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
    },
});

export default PlayerScreen;
