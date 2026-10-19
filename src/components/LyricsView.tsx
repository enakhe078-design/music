import { useEffect, useRef } from 'react';
import { Track } from '../types';
import { Mic, X } from 'lucide-react';

interface LyricsViewProps {
  track: Track | null;
  currentTime: number;
  onSeek: (seconds: number) => void;
  onClose: () => void;
}

export default function LyricsView({ track, currentTime, onSeek, onClose }: LyricsViewProps) {
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const lyrics = track?.lyrics || [];

  // Determine current active lyric index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto-scroll to active lyric
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  return (
    <div className="h-full flex flex-col bg-slate-950/70 border-l border-slate-800/80 p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Lyrics & Flow
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close lyrics"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      {lyrics.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
          <Mic className="w-8 h-8 stroke-1 mb-2 opacity-50" />
          <p className="text-sm font-medium text-slate-400">No lyrics available</p>
          <p className="text-xs text-slate-500 mt-1">This instrumental track has no embedded lyric transcript.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-6">
          {lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek(line.time)}
                className={`cursor-pointer transition-all duration-300 px-3 py-2 rounded-xl text-left select-none ${
                  isActive
                    ? 'text-lg font-bold text-sky-300 bg-sky-950/40 border border-sky-500/30 scale-[1.02] shadow-sm'
                    : isPast
                    ? 'text-sm font-medium text-slate-400 hover:text-slate-200'
                    : 'text-sm font-medium text-slate-600 hover:text-slate-400'
                }`}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer hint */}
      <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Click line to seek</span>
        <span className="font-mono tabular-nums">{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
