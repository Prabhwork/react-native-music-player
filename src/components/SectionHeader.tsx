import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography, spacing } from '../theme/spacing';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
}

export const SectionHeader = ({ title, onSeeAll }: SectionHeaderProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        marginBottom: spacing.m,
        marginTop: spacing.l,
    },
    title: {
        ...typography.sectionTitle,
    },
    seeAll: {
        ...typography.seeAll,
    },
});
