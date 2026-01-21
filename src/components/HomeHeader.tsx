import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography, spacing } from '../theme/spacing';

export const HomeHeader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Ionicons name="musical-notes" size={32} color={colors.primary} />
                <Text style={styles.title}>Mume</Text>
            </View>
            <TouchableOpacity>
                <Ionicons name="search" size={28} color={colors.black} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        backgroundColor: colors.background,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.s,
    },
    title: {
        fontSize: typography.header.fontSize,
        fontWeight: typography.header.fontWeight,
        color: typography.header.color,
        marginLeft: spacing.s,
    },
});
