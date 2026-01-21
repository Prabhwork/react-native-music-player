export interface ArtistImage {
    quality: string;
    url: string;
}

export interface ArtistBio {
    text: string | null;
    title: string | null;
    sequence: number | null;
}

export interface Artist {
    id: string;
    name: string;
    url: string;
    type: string;
    image: ArtistImage[];
    followerCount: number | null;
    fanCount: number | null;
    isVerified: boolean | null;
    dominantLanguage: string | null;
    dominantType: string | null;
    bio: ArtistBio[];
    dob: string | null;
    fb: string | null;
    twitter: string | null;
    wiki: string | null;
    availableLanguages: string[];
    isRadioPresent: boolean | null;
    topSongs: import('./song').Song[];
    topAlbums?: any[]; // Simplified for now as we just need count
}

export interface ArtistResponse {
    success: boolean;
    data: Artist;
}
