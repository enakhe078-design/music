import { useRef } from 'react';
import { FolderPlus, Search, HelpCircle, Monitor } from 'lucide-react';
import { ViewTab } from '../types';

interface TopNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onImportFiles: (files: FileList) => void;
  onOpenShortcuts: () => void;
  onToggleMiniPlayer: () => void;
}

export default function TopNav({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onImportFiles,
  onOpenShortcuts,
  onToggleMiniPlayer
}: TopNavProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFiles(e.target.files);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between gap-8 shrink-0 z-20">
      {/* Zone 1: Single text element Brand wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onSelectTab('discover'); }}
          className="text-base font-bold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
        >
          AuraDesk Audio
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line nav links + subtle search input */}
      <div className="flex-1 max-w-2xl flex items-center gap-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search songs, artists, genres or albums..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('discover')}
            className={`whitespace-nowrap transition-colors hover:text-slate-200 ${currentTab === 'discover' ? 'text-sky-400 font-semibold' : ''}`}
          >
            Featured
          </button>
          <button
            onClick={() => onSelectTab('tracks')}
            className={`whitespace-nowrap transition-colors hover:text-slate-200 ${currentTab === 'tracks' ? 'text-sky-400 font-semibold' : ''}`}
          >
            All Tracks
          </button>
          <button
            onClick={() => onSelectTab('local')}
            className={`whitespace-nowrap transition-colors hover:text-slate-200 ${currentTab === 'local' ? 'text-sky-400 font-semibold' : ''}`}
          >
            Laptop Files
          </button>
          <button
            onClick={() => onSelectTab('favorites')}
            className={`whitespace-nowrap transition-colors hover:text-slate-200 ${currentTab === 'favorites' ? 'text-sky-400 font-semibold' : ''}`}
          >
            Favorites
          </button>
        </nav>
      </div>

      {/* Zone 3: 1 primary action (+ secondary utility triggers) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenShortcuts}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors hidden sm:flex"
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleMiniPlayer}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors hidden sm:flex"
          title="Open laptop floating mini-player"
          aria-label="Open mini-player"
        >
          <Monitor className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="laptop-audio-import"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl transition-all shadow-sm hover:shadow-sky-500/20 whitespace-nowrap shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Import Files</span>
        </button>
      </div>
    </header>
  );
}
