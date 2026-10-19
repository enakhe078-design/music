import { CloudRain, Zap, Coffee, Flame, Disc, Volume2, X } from 'lucide-react';
import { AmbientSoundState } from '../types';

interface AmbientMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambientSounds: AmbientSoundState[];
  onToggleSound: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
  onResetAll: () => void;
}

export default function AmbientMixerModal({
  isOpen,
  onClose,
  ambientSounds,
  onToggleSound,
  onVolumeChange,
  onResetAll
}: AmbientMixerModalProps) {
  if (!isOpen) return null;

  const renderIcon = (id: string) => {
    switch (id) {
      case 'rain': return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'thunder': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'cafe': return <Coffee className="w-5 h-5 text-emerald-400" />;
      case 'fire': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'vinyl': return <Disc className="w-5 h-5 text-purple-400" />;
      default: return <Volume2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const anyActive = ambientSounds.some(s => s.enabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ambient-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 id="ambient-title" className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-sky-400" />
              Ambient Background Mixer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Blend real-time procedural background soundscapes alongside your music
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound List */}
        <div className="mt-4 space-y-3">
          {ambientSounds.map((sound) => (
            <div
              key={sound.id}
              className={`p-3.5 rounded-xl border transition-all ${
                sound.enabled
                  ? 'bg-slate-800/80 border-sky-500/40 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sound.enabled ? 'bg-slate-800' : 'bg-slate-900'}`}>
                    {renderIcon(sound.id)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{sound.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {sound.enabled ? `Volume: ${Math.round(sound.volume * 100)}%` : 'Off'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleSound(sound.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    sound.enabled
                      ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {sound.enabled ? 'Active' : 'Enable'}
                </button>
              </div>

              {sound.enabled && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-3">
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={sound.volume}
                    onChange={(e) => onVolumeChange(sound.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-sky-400 cursor-pointer"
                    aria-label={`${sound.name} volume`}
                  />
                  <span className="text-xs font-mono tabular-nums text-slate-400 w-8 text-right">
                    {Math.round(sound.volume * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetAll}
            disabled={!anyActive}
            className="text-xs font-medium text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Mute All Ambience
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
