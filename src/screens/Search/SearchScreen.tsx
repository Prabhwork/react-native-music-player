import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    Keyboard,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing, typography } from '../../theme/spacing';
import { Song } from '../../types/song';
import { songService } from '../../services/songService';
import { SongListItem } from '../../components/SongListItem';
import { usePlayerStore } from '../../store/usePlayerStore';
import axios from 'axios';

// Mock Recent Searches
const MOCK_RECENT_SEARCHES = [
    'Ariana Grande',
    'Morgan Wallen',
    'Justin Bieber',
    'Drake',
    'Olivia Rodrigo',
    'The Weeknd',
    'Taylor Swift'
];

const TABS = ['Songs', 'Artists', 'Albums', 'Folders'];

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>(MOCK_RECENT_SEARCHES);
    const [activeTab, setActiveTab] = useState('Songs');
    const [results, setResults] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const { playSong } = usePlayerStore();

    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, []);

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            setLoading(true);
            setHasSearched(true);
            try {
                // Implementing a direct search call here since service doesn't have it yet
                // Assuming the API supports search. Using a generic search endpoint or constructing one.
                // If the saavn API follows common patterns: /search/songs?query=...
                const response = await axios.get(`https://saavn.sumit.co/api/search/songs`, {
                    params: { query: text, limit: 20 }
                });

                if (response.data.success) {
                    setResults(response.data.data.results || response.data.data);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Search error', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        } else if (text.length === 0) {
            setHasSearched(false);
            setResults([]);
        }
    };

    const handleClearRecent = () => {
        setRecentSearches([]);
    };

    const removeRecent = (item: string) => {
        setRecentSearches(prev => prev.filter(i => i !== item));
    };

    const renderRecentSearches = () => (
        <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={handleClearRecent}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={recentSearches}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.recentItem}>
                        <TouchableOpacity
                            style={styles.recentItemContent}
                            onPress={() => handleSearch(item)}
                        >
                            <Text style={styles.recentText}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeRecent(item)}>
                            <Ionicons name="close" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                )}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {TABS.map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderResults = () => {
        if (loading) {
            return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
        }

        if (hasSearched && results.length === 0) {
            return (
                <View style={styles.notFoundContainer}>
                    {/* Placeholder for illustration */}
                    <Ionicons name="sad-outline" size={80} color={colors.primary} style={{ marginBottom: spacing.m }} />
                    <Text style={styles.notFoundTitle}>Not Found</Text>
                    <Text style={styles.notFoundText}>
                        Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SongListItem
                        song={item}
                        onPress={(song) => playSong(song, results)}
                        onOptionPress={() => { }}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Search..."
                        placeholderTextColor={colors.textSecondary}
                        value={query}
                        onChangeText={handleSearch}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {!hasSearched && query.length === 0 ? (
                renderRecentSearches()
            ) : (
                <View style={{ flex: 1 }}>
                    {renderTabs()}
                    {renderResults()}
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        marginBottom: spacing.s,
    },
    backButton: {
        marginRight: spacing.m,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff', // White background as per design
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.primary, // Orange border as per design
        paddingHorizontal: spacing.m,
        height: 45,
    },
    searchIcon: {
        marginRight: spacing.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    // Recent Searches
    recentContainer: {
        paddingHorizontal: spacing.m,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    clearAllText: {
        color: colors.primary,
        fontWeight: '600',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.s + 4,
        borderBottomWidth: 0,
    },
    recentItemContent: {
        flex: 1,
    },
    recentText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.m,
        marginBottom: spacing.m,
        gap: spacing.s,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        color: colors.primary,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    // Not Found
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    notFoundTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.s,
    },
    notFoundText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
});
