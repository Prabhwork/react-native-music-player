import axios from 'axios';
import { ArtistResponse, Artist } from '../types/artist';

const API_BASE_URL = 'https://saavn.sumit.co/api';

export const artistService = {
    getArtistDetails: async (id: string): Promise<Artist | null> => {
        try {
            const response = await axios.get<ArtistResponse>(`${API_BASE_URL}/artists`, {
                params: { id },
            });
            console.log('API Response:', response.data); // Log for debugging
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching artist details:', error);
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
    }
};
