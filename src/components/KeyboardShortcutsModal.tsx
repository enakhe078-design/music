import { Command, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause playback' },
  { key: '← / →', desc: 'Seek 5 seconds backward / forward' },
  { key: 'Shift + ← / →', desc: 'Previous track / Next track' },
  { key: '↑ / ↓', desc: 'Volume up / down (5%)' },
  { key: 'M', desc: 'Mute / Unmute audio' },
  { key: 'L', desc: 'Toggle Lyrics panel' },
  { key: 'E', desc: 'Toggle Graphic Equalizer' },
  { key: 'A', desc: 'Toggle Ambient Mixer' },
  { key: 'V', desc: 'Cycle Visualizer mode (Bars / Wave / Circle / Nebula)' },
  { key: 'F', desc: 'Toggle Immersive Fullscreen Mode' },
  { key: 'S', desc: 'Toggle Shuffle mode' },
  { key: 'R', desc: 'Cycle Repeat mode (Off / All / Track)' },
  { key: 'Esc', desc: 'Close dialogs or exit fullscreen' }
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-sky-400" />
            <h2 id="shortcuts-title" className="text-base font-semibold text-white">
              Laptop Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs"
            >
              <span className="text-slate-300 font-medium">{item.desc}</span>
              <kbd className="px-2 py-0.8 font-mono text-[11px] font-semibold text-sky-300 bg-slate-800 border border-slate-700 rounded shadow-sm shrink-0 ml-2">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
