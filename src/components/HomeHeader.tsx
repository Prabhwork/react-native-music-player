import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography, spacing } from '../theme/spacing';

export const HomeHeader = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.leftContainer}>
                <Ionicons name="musical-notes" size={32} color={colors.primary} />
                <Text style={styles.title}>Mume</Text>
            </View>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Search')}>
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
        paddingBottom: spacing.s,
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
