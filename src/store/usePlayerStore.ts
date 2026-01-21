import { create } from 'zustand';
import { Audio } from 'expo-av';
import { Song } from '../types/song';

interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    sound: Audio.Sound | null;
    queue: Song[];
    currentIndex: number;
    duration: number;
    position: number;

    initializeAudio: () => Promise<void>;
    playSong: (song: Song, queue: Song[]) => Promise<void>;
    togglePlayPause: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    seek: (millis: number) => Promise<void>;
    updateStatus: (status: any) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    sound: null,
    queue: [],
    currentIndex: -1,
    duration: 0,
    position: 0,

    initializeAudio: async () => {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
        } catch (e) {
            console.error('Failed to init audio', e);
        }
    },

    playSong: async (song: Song, queue: Song[]) => {
        const { sound } = get();
        if (sound) {
            await sound.unloadAsync();
        }

        // Find URL - prefer 320kbps, then 96kbps
        // Based on API: downloadUrl array
        let uri = '';
        if (song.downloadUrl && song.downloadUrl.length > 0) {
            // Try to find highest quality
            const high = song.downloadUrl.find(u => u.quality === '320kbps') || song.downloadUrl[song.downloadUrl.length - 1];
            uri = high.url;
        } else {
            console.warn('No download URL found for song', song.name);
            return;
        }

        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true },
                (status) => get().updateStatus(status)
            );

            const index = queue.findIndex(s => s.id === song.id);

            set({
                sound: newSound,
                currentSong: song,
                queue,
                currentIndex: index,
                isPlaying: true,
            });
        } catch (error) {
            console.error('Error playing song', error);
        }
    },

    togglePlayPause: async () => {
        const { sound, isPlaying } = get();
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
            set({ isPlaying: !isPlaying });
        }
    },

    playNext: async () => {
        const { queue, currentIndex } = get();
        if (currentIndex < queue.length - 1) {
            const nextSong = queue[currentIndex + 1];
            await get().playSong(nextSong, queue);
        }
    },

    playPrevious: async () => {
        const { queue, currentIndex } = get();
        if (currentIndex > 0) {
            const prevSong = queue[currentIndex - 1];
            await get().playSong(prevSong, queue);
        }
    },

    seek: async (millis: number) => {
        const { sound } = get();
        if (sound) {
            await sound.setPositionAsync(millis);
        }
    },

    updateStatus: (status: any) => {
        if (status.isLoaded) {
            set({
                duration: status.durationMillis || 0,
                position: status.positionMillis || 0,
                isPlaying: status.isPlaying,
            });

            // Auto play next
            if (status.didJustFinish) {
                get().playNext();
            }
        }
    }
}));
