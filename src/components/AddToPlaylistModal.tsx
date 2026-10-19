import { ListMusic, Plus, Check, X } from 'lucide-react';
import { Track, Playlist } from '../types';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  playlists: Playlist[];
  onToggleTrackInPlaylist: (playlistId: string, trackId: string) => void;
  onCreateNewPlaylist: () => void;
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  track,
  playlists,
  onToggleTrackInPlaylist,
  onCreateNewPlaylist
}: AddToPlaylistModalProps) {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-pl-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 id="add-to-pl-title" className="text-sm font-semibold text-white">
              Add to Playlist
            </h2>
            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
              "{track.title}" by {track.artist}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {playlists.map((pl) => {
            const hasTrack = pl.trackIds.includes(track.id);
            return (
              <button
                key={pl.id}
                onClick={() => onToggleTrackInPlaylist(pl.id, track.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                  hasTrack
                    ? 'bg-sky-950/60 text-sky-300 border border-sky-800/60'
                    : 'bg-slate-950/40 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ListMusic className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{pl.name}</span>
                </div>
                {hasTrack ? (
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onCreateNewPlaylist();
            }}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Playlist
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
