import { Play, Shuffle, Sliders, Sparkles, FolderDown, ArrowRight } from 'lucide-react';
import { Track, Playlist } from '../types';
import TrackList from './TrackList';

interface DiscoverViewProps {
  tracks: Track[];
  playlists: Playlist[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onToggleLike: (trackId: string) => void;
  onAddToPlaylist: (track: Track) => void;
  onOpenEQ: () => void;
  onOpenLocalTab: () => void;
}

export default function DiscoverView({
  tracks,
  playlists,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist,
  onToggleLike,
  onAddToPlaylist,
  onOpenEQ,
  onOpenLocalTab
}: DiscoverViewProps) {
  // Hero featured track
  const featuredTrack = tracks[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Featured Hero Banner */}
      {featuredTrack && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex-1 space-y-3 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Laptop Featured Selection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {featuredTrack.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Immerse in gentle rain and warm lo-fi tape saturation. Specially engineered for prolonged deep work, reading, or coding on your laptop.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlayTrack(featuredTrack)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all shadow-lg shadow-sky-500/25 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Now</span>
              </button>
              <button
                onClick={onOpenEQ}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
              >
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Acoustic EQ</span>
              </button>
            </div>
          </div>

          <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group">
            <img
              src={featuredTrack.coverUrl}
              alt={featuredTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      )}

      {/* Laptop Curated Mood Stations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Curated Listening Stations
            </h2>
            <p className="text-xs text-slate-400">
              Instant soundscapes tailored for focus, energy, and relaxed vibes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((pl) => {
            const trackCount = pl.trackIds.length;
            return (
              <div
                key={pl.id}
                onClick={() => onPlayPlaylist(pl)}
                className="group cursor-pointer rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/30 p-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                    <img
                      src={pl.coverUrl}
                      alt={pl.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                    {pl.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {pl.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{trackCount} {trackCount === 1 ? 'track' : 'tracks'}</span>
                  <span className="flex items-center gap-1 text-sky-400 font-sans group-hover:translate-x-0.5 transition-transform">
                    Play Station <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Laptop Local Audio Drop Strip */}
      <div 
        onClick={onOpenLocalTab}
        className="cursor-pointer p-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 hover:border-sky-500/40 flex items-center justify-between gap-4 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
            <FolderDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors">
              Play Your Laptop Audio Files
            </div>
            <div className="text-[11px] text-slate-400">
              Drag & drop or import your local MP3, WAV, FLAC, and AAC music files
            </div>
          </div>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 group-hover:bg-sky-400 group-hover:text-slate-950 transition-colors">
          Open Local Player
        </button>
      </div>

      {/* Track Listing */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Featured Sound Catalog
            </h2>
            <p className="text-xs text-slate-400">
              High-fidelity tracks with synchronized lyrics and graphic EQ support
            </p>
          </div>
          <button
            onClick={() => {
              if (tracks.length > 0) {
                const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
                onPlayTrack(randomTrack);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span>Random Play</span>
          </button>
        </div>

        <TrackList
          tracks={tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          onPlayTrack={onPlayTrack}
          onToggleLike={onToggleLike}
          onAddToPlaylist={onAddToPlaylist}
        />
      </div>
    </div>
  );
}
