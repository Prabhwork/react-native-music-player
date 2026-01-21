import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography, spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface AlbumCardProps {
    name: string;
    artist: string;
    year?: string;
    songCount?: number;
    image: ImageSourcePropType;
    onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.m * 3) / 2; // 2 columns with padding

export const AlbumCard = ({ name, artist, year, songCount, image, onPress }: AlbumCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={image} style={styles.image} />
            <View style={styles.info}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{name}</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {artist} {year ? `| ${year}` : ''}
                </Text>
                {songCount && (
                    <Text style={styles.meta}>{songCount} songs</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        marginBottom: spacing.l,
    },
    image: {
        width: cardWidth,
        height: cardWidth,
        borderRadius: 16,
        marginBottom: spacing.s,
    },
    info: {
        paddingHorizontal: spacing.xs,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        marginRight: spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    meta: {
        fontSize: 12,
        color: colors.gray,
    }
});
