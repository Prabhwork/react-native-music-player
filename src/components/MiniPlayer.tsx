import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/usePlayerStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const { width } = Dimensions.get('window');

export const MiniPlayer = () => {
    const navigation = useNavigation();
    const { currentSong, isPlaying, togglePlayPause } = usePlayerStore();

    if (!currentSong) return null;

    const imageSource = currentSong.image && currentSong.image.length > 0
        ? { uri: currentSong.image[2]?.url || currentSong.image[0]?.url }
        : require('../../assets/icon.png');

    const handlePress = () => {
        // @ts-ignore
        navigation.navigate('Player');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.9}>
                {/* Progress Bar Background (Optional simple implementation) */}

                <Image source={imageSource} style={styles.image} />

                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{currentSong.name}</Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {currentSong.artists.primary[0]?.name || 'Unknown Artist'}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => togglePlayPause()} style={styles.playButton}>
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, // Adjusted to sit above floating tab bar (20 bottom + 70 height + 10 padding)
        left: spacing.m,
        right: spacing.m,
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 100, // Ensure it sits on top
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.s,
        height: 60,
    },
    image: {
        width: 44,
        height: 44,
        borderRadius: 4,
        backgroundColor: colors.gray,
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.m,
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 2,
    },
    artist: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    playButton: {
        padding: spacing.s,
    },
});
