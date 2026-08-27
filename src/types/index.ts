export type MediaType = 'movie' | 'series' | 'anime';
export type VideoQuality = '360p' | '480p' | '720p' | '1080p' | '4K';

export interface Genre {
  id: number;
  name: string;
  nameAr: string;
}

export interface Server {
  id: string;
  name: string;
  url: string;
  quality: VideoQuality;
}

export interface Episode {
  id: number;
  number: number;
  title: string;
  titleAr?: string;
  description?: string;
  thumbnail?: string;
  duration: number; // minutes
  airDate?: string;
  servers: Server[];
  watched?: boolean;
  watchProgress?: number; // 0-100
}

export interface Season {
  id: number;
  number: number;
  title: string;
  titleAr?: string;
  poster?: string;
  airDate?: string;
  episodes: Episode[];
}

export interface Media {
  id: number;
  type: MediaType;
  title: string;
  titleAr?: string;
  originalTitle?: string;
  description: string;
  poster: string;
  backdrop: string;
  year: number;
  rating: number; // 0-10
  userRating?: number; // 0-5 stars
  ratingCount: number;
  views: number;
  genres: Genre[];
  duration?: number; // for movies (minutes)
  quality?: VideoQuality;
  servers?: Server[]; // for movies
  seasons?: Season[]; // for series/anime
  language?: string;
  subtitles?: string[];
  country?: string;
  director?: string;
  cast?: string[];
  trailer?: string;
  featured?: boolean;
  trending?: boolean;
  status?: 'ongoing' | 'completed' | 'upcoming';
  season?: string; // anime season e.g. "Winter 2024"
}

export interface WatchProgress {
  mediaId: number;
  mediaType: MediaType;
  episodeId?: number;
  seasonId?: number;
  progress: number; // 0-100
  currentTime: number; // seconds
  duration: number; // seconds
  updatedAt: string;
}

export interface Comment {
  id: number;
  mediaId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  liked?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  favorites: number[];
  watchHistory: WatchProgress[];
  ratings: Record<number, number>; // mediaId -> rating (1-5)
}

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  version: string;
}

export interface FilterOptions {
  genres?: number[];
  year?: number;
  sort?: 'rating' | 'newest' | 'views' | 'title';
  type?: MediaType;
  page?: number;
  limit?: number;
  query?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
