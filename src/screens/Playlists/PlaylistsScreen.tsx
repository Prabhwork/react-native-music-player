import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HomeHeader } from '../../components/HomeHeader';

const PlaylistsScreen = () => {
    return (
        <View style={styles.container}>
            <HomeHeader />
            <View style={styles.content}>
                <Text>Playlists Screen</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PlaylistsScreen;
