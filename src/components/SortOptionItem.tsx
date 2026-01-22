import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SortOptionItemProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export const SortOptionItem = ({ label, selected, onPress }: SortOptionItemProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected && <View style={styles.radioInner} />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    label: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
});
