import { Play, Pause, Heart, Plus, Clock, Disc } from 'lucide-react';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export default function TrackList({
  tracks,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  onAddToPlaylist,
  emptyTitle = 'No tracks found',
  emptyDescription = 'There are no audio tracks matching this view.',
  onEmptyAction,
  emptyActionLabel
}: TrackListProps) {
  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
        <Disc className="w-10 h-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">{emptyTitle}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">{emptyDescription}</p>
        {onEmptyAction && emptyActionLabel && (
          <button
            onClick={onEmptyAction}
            className="mt-4 px-4 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors shadow-sm"
          >
            {emptyActionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-2.5 px-3 w-12 text-center">#</th>
            <th className="py-2.5 px-4">Title</th>
            <th className="py-2.5 px-4 hidden md:table-cell">Album</th>
            <th className="py-2.5 px-4 hidden lg:table-cell">Genre</th>
            <th className="py-2.5 px-4 w-28 text-right">
              <span className="flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5" />
                Time
              </span>
            </th>
            <th className="py-2.5 px-3 w-20 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900/60 font-medium">
          {tracks.map((track, idx) => {
            const isCurrent = currentTrackId === track.id;
            const isRowPlaying = isCurrent && isPlaying;

            return (
              <tr
                key={track.id}
                onDoubleClick={() => onPlayTrack(track)}
                className={`group transition-colors ${
                  isCurrent
                    ? 'bg-sky-950/30 text-white'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                {/* Index / Play Button */}
                <td className="py-2.5 px-3 text-center">
                  <div className="relative flex items-center justify-center w-6 h-6 mx-auto">
                    {isRowPlaying ? (
                      <button
                        onClick={() => onPlayTrack(track)}
                        className="text-sky-400 hover:text-sky-300"
                        title="Pause"
                      >
                        <Pause className="w-4 h-4 fill-current" />
                      </button>
                    ) : (
                      <>
                        <span className={`text-[11px] font-mono tabular-nums group-hover:hidden ${isCurrent ? 'text-sky-400 font-bold' : 'text-slate-500'}`}>
                          {idx + 1}
                        </span>
                        <button
                          onClick={() => onPlayTrack(track)}
                          className="hidden group-hover:flex items-center justify-center text-white hover:text-sky-400 transition-colors"
                          title="Play track"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </>
                    )}
                  </div>
                </td>

                {/* Title & Artist */}
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className={`font-semibold truncate ${isCurrent ? 'text-sky-300' : 'text-slate-200'}`}>
                        {track.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {track.artist}
                        {track.isLocal && (
                          <span className="ml-2 font-mono text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                            LOCAL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Album */}
                <td className="py-2.5 px-4 text-slate-400 hidden md:table-cell truncate max-w-xs">
                  {track.album}
                </td>

                {/* Genre */}
                <td className="py-2.5 px-4 text-slate-400 hidden lg:table-cell">
                  <span className="text-[11px] text-slate-400">
                    {track.genre}
                  </span>
                </td>

                {/* Duration */}
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-400 text-xs">
                  {formatDuration(track.duration)}
                </td>

                {/* Actions: Like & Add */}
                <td className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => onToggleLike(track.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        track.isLiked
                          ? 'text-rose-500 hover:text-rose-400'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={track.isLiked ? 'Remove like' : 'Like'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${track.isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {onAddToPlaylist && (
                      <button
                        onClick={() => onAddToPlaylist(track)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors"
                        title="Add to playlist"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
