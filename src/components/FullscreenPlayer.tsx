import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Heart, 
  Mic, 
  Sliders, 
  Activity,
  Shuffle,
  Repeat
} from 'lucide-react';
import { Track, VisualizerMode, RepeatMode } from '../types';
import Visualizer from './Visualizer';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (secs: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  visualizerMode: VisualizerMode;
  onCycleVisualizer: () => void;
  onOpenEQ: () => void;
  repeatMode: RepeatMode;
  onCycleRepeat: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
}

export default function FullscreenPlayer({
  isOpen,
  onClose,
  track,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isLiked,
  onToggleLike,
  visualizerMode,
  onCycleVisualizer,
  onOpenEQ,
  repeatMode,
  onCycleRepeat,
  isShuffle,
  onToggleShuffle
}: FullscreenPlayerProps) {
  if (!isOpen || !track) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Active lyric
  const lyrics = track.lyrics || [];
  let currentLyricText = '♪ Instrumental Flow ♪';
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      currentLyricText = lyrics[i].text;
    } else {
      break;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070b12] text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Blurred background cover glow */}
      <div 
        className="absolute inset-0 opacity-25 filter blur-3xl scale-125 pointer-events-none bg-center bg-cover transition-all duration-700"
        style={{ backgroundImage: `url(${track.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/80 to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 font-mono">
            AuraDesk Immersive
          </span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs font-mono text-slate-400">{track.bitrate}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCycleVisualizer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="uppercase font-mono text-[10px]">{visualizerMode}</span>
          </button>
          <button
            onClick={onOpenEQ}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Graphic EQ"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Exit Fullscreen (Esc or F)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 max-w-4xl mx-auto w-full text-center">
        {/* Cover Art with subtle floating effect */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl shadow-sky-950/60 border border-white/10 group mb-6">
          <img
            src={track.coverUrl}
            alt={track.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Track Metadata */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 line-clamp-1">
          {track.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-400 font-medium">
          {track.artist} <span className="text-slate-600">·</span> {track.album}
        </p>

        {/* Live Active Lyric Bar */}
        <div className="mt-4 px-6 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md max-w-xl flex items-center justify-center gap-2">
          <Mic className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-sm font-semibold text-sky-200 line-clamp-1">
            {currentLyricText}
          </span>
        </div>

        {/* Live Audio Visualizer Canvas */}
        <div className="w-full max-w-xl h-24 mt-4">
          <Visualizer
            mode={visualizerMode}
            isPlaying={isPlaying}
            accentColor="#38bdf8"
          />
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-4">
        {/* Seek Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-slate-400 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progressPercent}
            onChange={(e) => onSeek((Number(e.target.value) / 100) * duration)}
            className="w-full h-2 bg-slate-800 rounded-lg accent-sky-400 cursor-pointer"
          />
          <span className="text-xs font-mono tabular-nums text-slate-400 w-12 text-left">
            {formatTime(duration)}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          {/* Like */}
          <button
            onClick={() => onToggleLike(track.id)}
            className={`p-2.5 rounded-xl transition-colors ${
              isLiked ? 'text-rose-500 bg-rose-950/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Core Controls */}
          <div className="flex items-center gap-5">
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-xl transition-colors ${
                isShuffle ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={onPrevious}
              className="p-3 text-slate-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-14 h-14 rounded-full bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center shadow-xl shadow-white/20 transition-transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current text-slate-950" />
              ) : (
                <Play className="w-6 h-6 fill-current text-slate-950 translate-x-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-3 text-slate-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            <button
              onClick={onCycleRepeat}
              className={`p-2 rounded-xl transition-colors ${
                repeatMode !== 'off' ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={onToggleMute} className="text-slate-400 hover:text-white">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg accent-sky-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
