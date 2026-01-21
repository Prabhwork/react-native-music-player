export interface ArtistImage {
  quality: string;
  url: string;
}

export interface SongImage {
  quality: string;
  url: string;
}

export interface DownloadUrl {
  quality: string;
  url: string;
}

export interface Album {
  id: string | null;
  name: string | null;
  url: string | null;
}

export interface SongArtist {
  id: string;
  name: string;
  role: string;
  type: string;
  image: ArtistImage[];
  url: string;
}

export interface SongArtists {
  primary: SongArtist[];
  featured: SongArtist[];
  all: SongArtist[];
}

export interface Song {
  id: string;
  name: string;
  type: string;
  year: string | null; // API shows null in example but usually string/number
  releaseDate: string | null;
  duration: number | null;
  label: string | null;
  explicitContent: boolean;
  playCount: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  url: string;
  copyright: string | null;
  album: Album;
  artists: SongArtists;
  image: SongImage[];
  downloadUrl: DownloadUrl[];
}

export interface SongResponse {
  success: boolean;
  data: Song[];
}
