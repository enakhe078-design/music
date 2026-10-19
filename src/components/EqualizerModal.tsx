import { EQ_FREQUENCIES, EQ_PRESETS } from '../data/tracks';
import { Sliders, RotateCcw, X, Volume2 } from 'lucide-react';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bands: number[];
  onBandChange: (index: number, val: number) => void;
  activePreset: string;
  onSelectPreset: (presetName: string, bands: number[]) => void;
  pan: number;
  onPanChange: (val: number) => void;
  onReset: () => void;
}

export default function EqualizerModal({
  isOpen,
  onClose,
  bands,
  onBandChange,
  activePreset,
  onSelectPreset,
  pan,
  onPanChange,
  onReset
}: EqualizerModalProps) {
  if (!isOpen) return null;

  const formatFreq = (freq: number) => {
    return freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eq-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-sky-400" />
            <div>
              <h2 id="eq-title" className="text-base font-semibold tracking-tight text-white">
                10-Band Graphic Equalizer
              </h2>
              <p className="text-xs text-slate-400">
                Acoustic fine-tuning optimized for laptop speakers & headphones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Equalizer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Acoustic Profiles & Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EQ_PRESETS.map((preset) => {
              const isActive = activePreset === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => onSelectPreset(preset.name, preset.bands)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="font-semibold truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{preset.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 10 Slider Bars */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-2 px-2">
            <span>+12 dB</span>
            <span>0 dB (Flat)</span>
            <span>-12 dB</span>
          </div>

          <div className="flex items-center justify-between gap-2 h-44 pt-2">
            {EQ_FREQUENCIES.map((freq, idx) => {
              const val = bands[idx] ?? 0;
              return (
                <div key={freq} className="flex-1 flex flex-col items-center h-full justify-between">
                  <span className="text-[10px] font-mono tabular-nums text-sky-400 font-medium">
                    {val > 0 ? `+${val}` : `${val}`}
                  </span>
                  
                  {/* Vertical Slider Wrapper */}
                  <div className="relative flex items-center justify-center h-28 w-6">
                    {/* Centerline indicator */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-700/60 pointer-events-none" />
                    
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={val}
                      onChange={(e) => onBandChange(idx, Number(e.target.value))}
                      className="w-28 h-1.5 -rotate-90 origin-center cursor-pointer bg-slate-800 rounded-lg accent-sky-400"
                      aria-label={`${formatFreq(freq)} Hz equalizer band`}
                    />
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 mt-2">
                    {formatFreq(freq)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Balance / Stereo Widener Controls */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-300">Stereo Balance (L / R)</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-slate-500">L</span>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={pan}
                  onChange={(e) => onPanChange(Number(e.target.value))}
                  className="w-32 h-1.5 bg-slate-800 rounded-lg accent-sky-400 cursor-pointer"
                  aria-label="Stereo balance slider"
                />
                <span className="text-[10px] font-mono text-slate-500">R</span>
                <span className="text-[10px] font-mono text-slate-400 ml-1">
                  {pan === 0 ? 'Center' : pan < 0 ? `L ${Math.abs(Math.round(pan * 100))}%` : `R ${Math.round(pan * 100)}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Flat
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
