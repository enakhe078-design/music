import { 
  Compass, 
  Music, 
  ListMusic, 
  FolderDown, 
  Heart, 
  History, 
  Sliders, 
  CloudRain, 
  Moon, 
  Plus, 
  Laptop
} from 'lucide-react';
import { Playlist, ViewTab } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string) => void;
  onCreatePlaylist: () => void;
  onOpenEQ: () => void;
  onOpenAmbient: () => void;
  onOpenSleepTimer: () => void;
  ambientActiveCount: number;
  sleepTimerActive: boolean;
  localTracksCount: number;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
  onCreatePlaylist,
  onOpenEQ,
  onOpenAmbient,
  onOpenSleepTimer,
  ambientActiveCount,
  sleepTimerActive,
  localTracksCount
}: SidebarProps) {
  const mainNavItems = [
    { id: 'discover' as ViewTab, label: 'Discover & Featured', icon: Compass },
    { id: 'tracks' as ViewTab, label: 'All Library Tracks', icon: Music },
    { id: 'local' as ViewTab, label: 'Laptop Local Files', icon: FolderDown, badge: localTracksCount > 0 ? `${localTracksCount}` : undefined },
    { id: 'favorites' as ViewTab, label: 'Favorite Tracks', icon: Heart },
    { id: 'history' as ViewTab, label: 'Play History', icon: History }
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 flex flex-col h-full select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-lg">
          <Laptop className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            AuraDesk
            <span className="text-[10px] font-mono font-medium text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800/60">
              DESKTOP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Laptop Studio Audio</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Nav */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Audio Library
          </div>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id && !selectedPlaylistId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Playlists */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Playlists</span>
            <button
              onClick={onCreatePlaylist}
              className="p-1 hover:text-white text-slate-400 rounded transition-colors"
              title="Create new playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {playlists.map((pl) => {
              const isSelected = selectedPlaylistId === pl.id;
              return (
                <button
                  key={pl.id}
                  onClick={() => onSelectPlaylist(pl.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all truncate text-left ${
                    isSelected
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <ListMusic className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="truncate">{pl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Studio Enhancers */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Acoustics & Ambience
          </div>
          <div className="space-y-1">
            <button
              onClick={onOpenEQ}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Graphic Equalizer</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">10-band</span>
            </button>

            <button
              onClick={onOpenAmbient}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent transition-all"
            >
              <div className="flex items-center gap-2.5">
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>Ambient Mixer</span>
              </div>
              {ambientActiveCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-700/60">
                  {ambientActiveCount} ON
                </span>
              )}
            </button>

            <button
              onClick={onOpenSleepTimer}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Sleep Timer</span>
              </div>
              {sleepTimerActive && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Laptop Specs Badge at bottom */}
      <div className="p-3.5 border-t border-slate-800/60 bg-slate-950/40">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
            <span>Audio Engine</span>
            <span className="font-mono text-[10px] text-sky-400">44.1 kHz 32-bit</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Web Audio DSP active with zero-latency buffer.
          </p>
        </div>
      </div>
    </aside>
  );
}
