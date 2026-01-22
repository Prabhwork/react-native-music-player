import axios from 'axios';
import { SongResponse, Song } from '../types/song';

const API_BASE_URL = 'https://saavn.sumit.co/api';

export const songService = {
    getSongSuggestions: async (id: string, limit: number = 10): Promise<Song[]> => {
        try {
            const response = await axios.get<SongResponse>(`${API_BASE_URL}/songs/${id}/suggestions`, {
                params: { limit },
            });
            console.log('Song API Response:', response.data); // Log for debugging
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching song suggestions:', error);
            return [];
        }
    },

    getSongDetails: async (id: string): Promise<Song | null> => {
        try {
            const response = await axios.get<SongResponse>(`${API_BASE_URL}/songs/${id}`);
            if (response.data.success && response.data.data.length > 0) {
                return response.data.data[0];
            }
            return null;
        } catch (error) {
            console.error('Error fetching song details:', error);
            return null;
        }
    },

    getSongsByIds: async (ids: string[]): Promise<Song[]> => {
        try {
            const response = await axios.get<SongResponse>(`${API_BASE_URL}/songs`, {
                params: { ids: ids.join(',') },
            });
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching multiple songs:', error);
            return [];
        }
    },

    getHindiSongs: async (page: number = 2, limit: number = 100): Promise<Song[]> => {
        try {
            const response = await axios.get<SongResponse>(`${API_BASE_URL}/search/songs`, {
                params: { query: 'hindi', page, limit },
            });
            if (response.data.success) {
                // Cast to any to handle potential 'results' nesting in search response
                const responseData = response.data.data as any;
                return responseData.results || responseData;
            }
            return [];
        } catch (error) {
            console.error('Error fetching Hindi songs:', error);
            return [];
        }
    }
};
