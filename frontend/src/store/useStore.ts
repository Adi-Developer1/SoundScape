import { create } from "zustand";
import { Track } from "../types";

type State = {
  current: Track | null;
  playing: boolean;
  queue: Track[];
  favorites: Record<string, Track>;
  setQueue: (tracks: Track[]) => void;
  setCurrent: (t: Track) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  toggleFavorite: (t: Track) => void;
  loadFavorites: () => void;
  clearFavorites: () => void;
};

export const useStore = create<State>((set, get) => ({
  current: null,
  playing: false,
  queue: [],
  favorites: {},

  // Here Queue management
  setQueue: (tracks) => set({ queue: tracks }),

  // Set and start playing a track
  setCurrent: (t) => set({ current: t, playing: true }),

  // Play/pause
  togglePlay: () => set((state) => ({ playing: !state.playing })),

  // Next track
  next: () => {
    const { queue, current } = get();
    if (!queue.length) return;
    const idx = queue.findIndex((q) => q.id === current?.id);
    const next = queue[(idx + 1) % queue.length];
    set({ current: next, playing: true });
  },

  // Previous track
  prev: () => {
    const { queue, current } = get();
    if (!queue.length) return;
    const idx = queue.findIndex((q) => q.id === current?.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    set({ current: prev, playing: true });
  },

  // Toggle favorites (add/remove)
  toggleFavorite: (t) => {
    const favs = { ...get().favorites };
    if (favs[t.id]) {
      delete favs[t.id as any];
    } else {
      favs[t.id as any] = t;
    }
    localStorage.setItem("ss_favs", JSON.stringify(favs));
    set({ favorites: favs });
  },

  // Load favorites from localStorage
  loadFavorites: () => {
    try {
      const raw = localStorage.getItem("ss_favs");
      const favs = raw ? JSON.parse(raw) : {};
      set({ favorites: favs });
    } catch {
      set({ favorites: {} });
    }
  },

  // Clear all favorites
  clearFavorites: () => {
    localStorage.removeItem("ss_favs");
    set({ favorites: {} });
  },
}));
