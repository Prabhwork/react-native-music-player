import { Song } from './song';

interface ArtistStart {
    id: string;
    name: string;
    role: string;
    type: string;
    image: { quality: string; url: string }[];
    url: string;
}

export interface Album {
    id: string;
    name: string;
    description?: string;
    year?: string;
    type?: string;
    playCount?: number;
    language?: string;
    explicitContent?: boolean;
    artists?: {
        primary?: ArtistStart[];
        featured?: ArtistStart[];
        all?: ArtistStart[];
    };
    songCount?: number;
    url?: string;
    image: { quality: string; url: string }[];
    songs?: Song[];
}

export interface AlbumResponse {
    success: boolean;
    data: Album;
}
