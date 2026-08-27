import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, WatchProgress, Media, Comment } from '../types';
import { mockComments } from '../data/mockData';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;

  // Favorites
  favorites: number[];
  toggleFavorite: (mediaId: number) => void;
  isFavorite: (mediaId: number) => boolean;

  // Watch Progress
  watchProgress: WatchProgress[];
  updateWatchProgress: (progress: WatchProgress) => void;
  getProgress: (mediaId: number, episodeId?: number) => WatchProgress | undefined;

  // Ratings
  ratings: Record<number, number>;
  setRating: (mediaId: number, rating: number) => void;

  // Comments
  comments: Comment[];
  addComment: (mediaId: number, text: string, rating?: number) => void;
  deleteComment: (commentId: number) => void;
  editComment: (commentId: number, text: string) => void;
  toggleLike: (commentId: number) => void;
  getComments: (mediaId: number) => Comment[];

  // UI State
  currentMedia: Media | null;
  setCurrentMedia: (media: Media | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

let commentIdCounter = mockComments.length + 1;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string, name?: string) => {
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        const user: User = {
          id: `user_${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          joinedAt: new Date().toISOString(),
          favorites: [],
          watchHistory: [],
          ratings: {},
        };
        set({ user, isAuthenticated: true });
        return true;
      },

      register: async (name: string, email: string, _password: string) => {
        await new Promise(r => setTimeout(r, 1000));
        const user: User = {
          id: `user_${Date.now()}`,
          name,
          email,
          joinedAt: new Date().toISOString(),
          favorites: [],
          watchHistory: [],
          ratings: {},
        };
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (updates) => set(state => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      // Favorites
      favorites: [],

      toggleFavorite: (mediaId) => set(state => {
        const isFav = state.favorites.includes(mediaId);
        return {
          favorites: isFav
            ? state.favorites.filter(id => id !== mediaId)
            : [...state.favorites, mediaId]
        };
      }),

      isFavorite: (mediaId) => get().favorites.includes(mediaId),

      // Watch Progress
      watchProgress: [],

      updateWatchProgress: (progress) => set(state => {
        const existing = state.watchProgress.findIndex(
          p => p.mediaId === progress.mediaId && p.episodeId === progress.episodeId
        );
        if (existing >= 0) {
          const updated = [...state.watchProgress];
          updated[existing] = progress;
          return { watchProgress: updated };
        }
        return { watchProgress: [...state.watchProgress, progress] };
      }),

      getProgress: (mediaId, episodeId) => {
        return get().watchProgress.find(
          p => p.mediaId === mediaId && p.episodeId === episodeId
        );
      },

      // Ratings
      ratings: {},

      setRating: (mediaId, rating) => set(state => ({
        ratings: { ...state.ratings, [mediaId]: rating }
      })),

      // Comments
      comments: mockComments,

      addComment: (mediaId, text, rating) => {
        const state = get();
        if (!state.user) return;
        const comment: Comment = {
          id: commentIdCounter++,
          mediaId,
          userId: state.user.id,
          userName: state.user.name,
          userAvatar: state.user.avatar,
          text,
          rating,
          createdAt: new Date().toISOString(),
          likes: 0,
          liked: false,
        };
        set(s => ({ comments: [comment, ...s.comments] }));
      },

      deleteComment: (commentId) => set(state => ({
        comments: state.comments.filter(c => c.id !== commentId)
      })),

      editComment: (commentId, text) => set(state => ({
        comments: state.comments.map(c =>
          c.id === commentId ? { ...c, text, updatedAt: new Date().toISOString() } : c
        )
      })),

      toggleLike: (commentId) => set(state => ({
        comments: state.comments.map(c =>
          c.id === commentId
            ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
            : c
        )
      })),

      getComments: (mediaId) => get().comments.filter(c => c.mediaId === mediaId),

      // UI
      currentMedia: null,
      setCurrentMedia: (media) => set({ currentMedia: media }),
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'yuki-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        favorites: state.favorites,
        watchProgress: state.watchProgress,
        ratings: state.ratings,
        comments: state.comments,
      }),
    }
  )
);
