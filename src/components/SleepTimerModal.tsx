import { Moon, Clock, X, Check } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingSeconds: number | null; // null if inactive
  onSetTimer: (minutes: number | 'end-of-track' | null) => void;
}

const TIMER_OPTIONS: { label: string; value: number | 'end-of-track' }[] = [
  { label: '15 Minutes', value: 15 },
  { label: '30 Minutes', value: 30 },
  { label: '45 Minutes', value: 45 },
  { label: '60 Minutes', value: 60 },
  { label: '90 Minutes', value: 90 },
  { label: 'End of Current Track', value: 'end-of-track' }
];

export default function SleepTimerModal({
  isOpen,
  onClose,
  remainingSeconds,
  onSetTimer
}: SleepTimerModalProps) {
  if (!isOpen) return null;

  const formatRemaining = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${String(s).padStart(2, '0')}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sleep-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 id="sleep-title" className="text-base font-semibold text-white">
                Sleep Timer
              </h2>
              <p className="text-xs text-slate-400">Gradual fade-out for night listening</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {remainingSeconds !== null && (
          <div className="my-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs text-indigo-200 font-medium">Timer Active</span>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-indigo-300">
              {formatRemaining(remainingSeconds)}
            </span>
          </div>
        )}

        <div className="mt-3 space-y-2">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => {
                onSetTimer(opt.value);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium text-slate-300 bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 transition-colors text-left"
            >
              <span>{opt.label}</span>
              <Check className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100" />
            </button>
          ))}

          {remainingSeconds !== null && (
            <button
              onClick={() => {
                onSetTimer(null);
                onClose();
              }}
              className="w-full p-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors mt-2"
            >
              Cancel Sleep Timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
