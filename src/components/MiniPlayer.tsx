import { Play, Pause, SkipBack, SkipForward, Maximize2, X, Heart } from 'lucide-react';
import { Track } from '../types';

interface MiniPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}

export default function MiniPlayer({
  isOpen,
  onClose,
  onExpand,
  track,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  currentTime,
  duration,
  isLiked,
  onToggleLike
}: MiniPlayerProps) {
  if (!isOpen || !track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="fixed bottom-28 right-6 z-50 w-72 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 select-none"
      role="region"
      aria-label="Floating mini player"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
        <span className="text-[10px] font-mono font-semibold uppercase text-sky-400 tracking-wider">
          Laptop Mini Player
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onExpand}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Expand player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close mini player"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={track.coverUrl}
          alt={track.title}
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">{track.title}</div>
          <div className="text-[11px] text-slate-400 truncate">{track.artist}</div>
        </div>
        <button
          onClick={() => onToggleLike(track.id)}
          className={`p-1 rounded text-xs ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
        <div
          className="bg-sky-400 h-full transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Mini Controls */}
      <div className="flex items-center justify-center gap-3 mt-2.5">
        <button
          onClick={onPrevious}
          className="p-1.5 text-slate-300 hover:text-white transition-colors"
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </button>
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center shadow hover:bg-slate-200 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
        </button>
        <button
          onClick={onNext}
          className="p-1.5 text-slate-300 hover:text-white transition-colors"
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
