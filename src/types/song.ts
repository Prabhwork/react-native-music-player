export type Song = {
  id: string;
  name: string;
  duration: string;
  primaryArtists: string;
  image: { quality: string; link: string }[];
  downloadUrl: { quality: string; link: string }[];
};
