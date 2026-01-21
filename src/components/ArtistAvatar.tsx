import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { colors } from '../theme/colors';
import { typography, spacing } from '../theme/spacing';

interface ArtistAvatarProps {
    name: string;
    image: ImageSourcePropType;
    onPress?: () => void;
}

export const ArtistAvatar = ({ name, image, onPress }: ArtistAvatarProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={image} style={styles.image} />
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: spacing.l,
        width: 100,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.gray,
        marginBottom: spacing.s,
    },
    name: {
        ...typography.songTitle,
        textAlign: 'center',
    },
});
