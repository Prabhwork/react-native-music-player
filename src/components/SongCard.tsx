import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { colors } from '../theme/colors';
import { typography, spacing } from '../theme/spacing';

interface SongCardProps {
    title: string;
    artist: string;
    image: ImageSourcePropType;
    onPress?: () => void;
    variant?: 'default' | 'large';
}

export const SongCard = ({ title, artist, image, onPress, variant = 'default' }: SongCardProps) => {
    const imageSize = variant === 'large' ? 160 : 120;

    return (
        <TouchableOpacity style={[styles.container, { width: imageSize }]} onPress={onPress}>
            <Image source={image} style={[styles.image, { width: imageSize, height: imageSize }]} />
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: spacing.m,
    },
    image: {
        borderRadius: spacing.m,
        backgroundColor: colors.gray,
        marginBottom: spacing.s,
    },
    title: {
        ...typography.songTitle,
        marginBottom: 4,
    },
    artist: {
        ...typography.artistName,
    },
});
