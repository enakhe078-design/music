export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  year?: number;
  isLocal?: boolean;
  bitrate?: string;
  isLiked?: boolean;
  lyrics?: { time: number; text: string }[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isCustom?: boolean;
}

export type VisualizerMode = 'bars' | 'wave' | 'circle' | 'nebula';

export type RepeatMode = 'off' | 'all' | 'one';

export interface EqualizerPreset {
  name: string;
  description: string;
  bands: number[]; // 10 values (-12 to +12 dB)
}

export interface AmbientSoundState {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  volume: number; // 0 to 1
}

export type ViewTab = 'discover' | 'tracks' | 'playlists' | 'local' | 'favorites' | 'history';
