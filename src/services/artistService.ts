import axios from 'axios';
import { ArtistResponse, Artist } from '../types/artist';
import { Song } from '../types/song';

const API_BASE_URL = 'https://saavn.sumit.co/api';

export const artistService = {
    getArtistDetails: async (id: string): Promise<Artist | null> => {
        try {
            // Updated to use path parameter as per user hint: api/artists/{id}
            const response = await axios.get<ArtistResponse>(`${API_BASE_URL}/artists/${id}`);


            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching artist details for ID ${id}:`, error);
            return null;
        }
    },

    getMultipleArtists: async (ids: string[]): Promise<Artist[]> => {
        try {
            const promises = ids.map(id => artistService.getArtistDetails(id));
            const results = await Promise.all(promises);
            return results.filter((artist): artist is Artist => artist !== null);
        } catch (error) {
            console.error('Error fetching multiple artists:', error);
            return [];
        }
    },

    getTopArtists: async (limit: number = 50): Promise<Artist[]> => {
        const artistIds = [
            '459320', '455926', '455123', '455130', '455109',
            '455115', '455111', '455110', '673556', '702452',
            '1145744', '459321', '459322', '459323', '459324',
            '459325', '459326', '459327', '459328', '459329',
            '459330', '459331', '459332', '459333', '459334',
            '459335', '459336', '459337', '459338', '459339',
            '459340', '459341', '459342', '459343', '459344',
            '459345', '459346', '459347', '459348', '459349',
            '459350', '459351', '459352', '459353', '459354'
        ];

        return await artistService.getMultipleArtists(artistIds.slice(0, limit));
    },

    getArtistSongs: async (id: string, page: number = 1, sortBy: string = 'popularity'): Promise<Song[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/artists/${id}/songs`, {
                params: { page, sortBy },
            });
            if (response.data.success) {
                return response.data.data.songs || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching artist songs:', error);
            return [];
        }
    },

    searchArtists: async (query: string, limit: number = 20): Promise<Artist[]> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/search/artists`, {
                params: { query, limit },
            });
            if (response.data.success) {
                // Cast to any to handle potential structural differences or missing types
                const responseData = response.data.data as any;
                // It might be nested in 'results' or direct array, similar to songs
                return responseData.results || responseData;
            }
            return [];
        } catch (error) {
            console.error('Error searching artists:', error);
            return [];
        }
    }
};
