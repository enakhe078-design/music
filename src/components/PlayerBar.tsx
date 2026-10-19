import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Heart, 
  Sliders, 
  Mic, 
  Maximize2, 
  RotateCcw, 
  RotateCw,
  Activity,
  CloudRain
} from 'lucide-react';
import { Track, RepeatMode, VisualizerMode } from '../types';

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isLiked: boolean;
  onToggleLike: (trackId: string) => void;
  repeatMode: RepeatMode;
  onCycleRepeat: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onOpenEQ: () => void;
  onOpenAmbient: () => void;
  isLyricsOpen: boolean;
  onToggleLyrics: () => void;
  visualizerMode: VisualizerMode;
  onCycleVisualizer: () => void;
  onOpenFullscreen: () => void;
}

export default function PlayerBar({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isLiked,
  onToggleLike,
  repeatMode,
  onCycleRepeat,
  isShuffle,
  onToggleShuffle,
  playbackRate,
  onPlaybackRateChange,
  onOpenEQ,
  onOpenAmbient,
  isLyricsOpen,
  onToggleLyrics,
  visualizerMode,
  onCycleVisualizer,
  onOpenFullscreen
}: PlayerBarProps) {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = Number(e.target.value);
    const targetSeconds = (newPercent / 100) * duration;
    onSeek(targetSeconds);
  };

  const handleSkipTime = (delta: number) => {
    onSeek(Math.max(0, Math.min(duration, currentTime + delta)));
  };

  return (
    <footer className="h-24 bg-slate-950/95 border-t border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 select-none relative z-30">
      {/* Left: Track Information & Quick Like */}
      <div className="flex items-center gap-3.5 min-w-[220px] max-w-[280px] w-1/4">
        {currentTrack ? (
          <>
            <div 
              onClick={onOpenFullscreen}
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 cursor-pointer group"
              title="Click for Fullscreen Mode (F)"
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate hover:underline cursor-pointer" onClick={onOpenFullscreen}>
                {currentTrack.title}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {currentTrack.artist}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 font-mono">
                <span>{currentTrack.bitrate || '320 kbps'}</span>
              </div>
            </div>

            <button
              onClick={() => onToggleLike(currentTrack.id)}
              className={`p-1.5 rounded-lg transition-colors ml-1 ${
                isLiked ? 'text-rose-500 hover:text-rose-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Activity className="w-5 h-5 text-slate-600" />
            </div>
            <span>No track playing</span>
          </div>
        )}
      </div>

      {/* Center: Controls & Time Slider */}
      <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleShuffle}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isShuffle ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={`Shuffle: ${isShuffle ? 'On' : 'Off'} (S)`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSkipTime(-5)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            title="Seek back 5 seconds (←)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrevious}
            className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Previous track (Shift + ←)"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onTogglePlay}
            disabled={!currentTrack}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center shadow-lg shadow-white/10 transition-transform active:scale-95 disabled:opacity-40"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-current text-slate-950 translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Next track (Shift + →)"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => handleSkipTime(5)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            title="Seek forward 5 seconds (→)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onCycleRepeat}
            className={`p-1.5 rounded-lg text-xs transition-colors relative ${
              repeatMode !== 'off' ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={`Repeat: ${repeatMode} (R)`}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-[8px] font-mono font-bold bg-sky-400 text-slate-950 px-1 rounded-full">
                1
              </span>
            )}
          </button>
        </div>

        {/* Progress Seek Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono tabular-nums text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercent}
              onChange={handleSeekChange}
              disabled={!currentTrack || duration <= 0}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-sky-400 hover:h-2 transition-all cursor-pointer"
              aria-label="Track progress seek slider"
            />
          </div>

          <span className="text-[11px] font-mono tabular-nums text-slate-400 w-10 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Audio FX, Visualizer mode, Lyrics, Volume & Fullscreen */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-[220px] max-w-[300px] w-1/4">
        {/* Visualizer Mode Cycle Button */}
        <button
          onClick={onCycleVisualizer}
          className="p-1.5 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-900 transition-colors hidden md:flex items-center gap-1"
          title={`Visualizer: ${visualizerMode.toUpperCase()} (V)`}
        >
          <Activity className="w-4 h-4 text-sky-400" />
          <span className="text-[10px] font-mono uppercase text-slate-400">{visualizerMode}</span>
        </button>

        {/* Graphic EQ */}
        <button
          onClick={onOpenEQ}
          className="p-1.5 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-900 transition-colors"
          title="Graphic Equalizer (E)"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Ambient Sounds */}
        <button
          onClick={onOpenAmbient}
          className="p-1.5 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-900 transition-colors"
          title="Ambient Mixer (A)"
        >
          <CloudRain className="w-4 h-4" />
        </button>

        {/* Lyrics */}
        <button
          onClick={onToggleLyrics}
          className={`p-1.5 rounded-lg transition-colors ${
            isLyricsOpen ? 'text-sky-300 bg-sky-950/70 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Synchronized Lyrics (L)"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Playback Speed selector */}
        <button
          onClick={() => {
            const rates = [1.0, 1.25, 1.5, 0.75];
            const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
            onPlaybackRateChange(next);
          }}
          className="px-1.5 py-1 text-[10px] font-mono font-semibold text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors hidden sm:block"
          title="Playback speed"
        >
          {playbackRate}x
        </button>

        {/* Volume Slider with Mute Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg accent-sky-400 cursor-pointer"
            aria-label="Volume slider"
          />
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={onOpenFullscreen}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          title="Fullscreen Mode (F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
