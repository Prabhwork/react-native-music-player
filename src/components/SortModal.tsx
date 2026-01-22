import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { SortOptionItem } from './SortOptionItem';

interface SortModalProps {
    visible: boolean;
    onClose: () => void;
    activeOption: string;
    onSelectOption: (option: string) => void;
}

const SORT_OPTIONS = [
    'Ascending',
    'Descending',
    'Artist',
    'Album',
    'Year',
    'Date Added',
    'Date Modified',
    'Composer',
];

export const SortModal = ({ visible, onClose, activeOption, onSelectOption }: SortModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {SORT_OPTIONS.map((option) => (
                                <SortOptionItem
                                    key={option}
                                    label={option}
                                    selected={activeOption === option}
                                    onPress={() => onSelectOption(option)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: spacing.m,
        maxHeight: '70%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
