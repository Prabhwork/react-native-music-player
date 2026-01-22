import { create } from 'zustand';

interface FavoritesState {
    favorites: string[]; // Store song IDs
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: [],
    toggleFavorite: (id: string) => {
        const { favorites } = get();
        const isFav = favorites.includes(id);
        if (isFav) {
            set({ favorites: favorites.filter(favId => favId !== id) });
        } else {
            set({ favorites: [...favorites, id] });
        }
    },
    isFavorite: (id: string) => {
        const { favorites } = get();
        return favorites.includes(id);
    },
}));
