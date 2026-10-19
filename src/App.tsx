import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Track, 
  Playlist, 
  ViewTab, 
  RepeatMode, 
  VisualizerMode, 
  AmbientSoundState 
} from './types';
import { 
  INITIAL_TRACKS, 
  INITIAL_PLAYLISTS, 
  EQ_PRESETS 
} from './data/tracks';
import { audioEngine } from './services/audioEngine';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import PlayerBar from './components/PlayerBar';
import TrackList from './components/TrackList';
import DiscoverView from './components/DiscoverView';
import Visualizer from './components/Visualizer';
import LyricsView from './components/LyricsView';
import EqualizerModal from './components/EqualizerModal';
import AmbientMixerModal from './components/AmbientMixerModal';
import SleepTimerModal from './components/SleepTimerModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import FullscreenPlayer from './components/FullscreenPlayer';
import MiniPlayer from './components/MiniPlayer';
import { 
  Play, 
  Shuffle, 
  Plus, 
  Trash2, 
  FolderDown, 
  Sliders, 
  Activity, 
  Heart, 
  Mic, 
  Volume2,
  Clock
} from 'lucide-react';

export default function App() {
  // --- Audio State ---
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('auradesk_tracks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with initial tracks to ensure valid asset paths
        const localOnly = parsed.filter((t: Track) => t.isLocal);
        return [...INITIAL_TRACKS, ...localOnly];
      } catch {
        return INITIAL_TRACKS;
      }
    }
    return INITIAL_TRACKS;
  });

  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_TRACKS[0].duration || 0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // --- Playlists & Views ---
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('auradesk_playlists');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_PLAYLISTS; }
    }
    return INITIAL_PLAYLISTS;
  });
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<ViewTab>('discover');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playHistory, setPlayHistory] = useState<string[]>([]);

  // --- Visualizer & EQ ---
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');
  const [isEQOpen, setIsEQOpen] = useState<boolean>(false);
  const [eqPreset, setEqPreset] = useState<string>('Laptop Speakers Pro');
  const [eqBands, setEqBands] = useState<number[]>([-5, -2, 2, 4, 3, 2, 3, 4, 3, 1]);
  const [pan, setPan] = useState<number>(0);

  // --- Ambience & Sleep Timer ---
  const [isAmbientOpen, setIsAmbientOpen] = useState<boolean>(false);
  const [ambientSounds, setAmbientSounds] = useState<AmbientSoundState[]>([
    { id: 'rain', name: 'Rainy Window', icon: 'rain', enabled: false, volume: 0.5 },
    { id: 'vinyl', name: 'Vinyl Tape Crackle', icon: 'vinyl', enabled: false, volume: 0.4 },
    { id: 'cafe', name: 'Coffee House Ambience', icon: 'cafe', enabled: false, volume: 0.45 },
    { id: 'fire', name: 'Campfire Glow', icon: 'fire', enabled: false, volume: 0.5 },
    { id: 'thunder', name: 'Distant Thunder', icon: 'thunder', enabled: false, volume: 0.35 }
  ]);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [sleepRemainingSeconds, setSleepRemainingSeconds] = useState<number | null>(null);
  const [sleepTimerOption, setSleepTimerOption] = useState<number | 'end-of-track' | null>(null);

  // --- Modals & Panels ---
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [trackForPlaylist, setTrackForPlaylist] = useState<Track | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // --- Audio Element Ref ---
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save playlists & local tracks to localStorage
  useEffect(() => {
    localStorage.setItem('auradesk_playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Sync AudioEngine with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioEngine.init(audioRef.current);
      audioEngine.applyEQPreset(eqBands);
      audioEngine.setPanner(pan);
      audioEngine.setMasterGain(isMuted ? 0 : volume);
    }
  }, []);

  // Update EQ bands in audioEngine
  const handleBandChange = (index: number, val: number) => {
    const updated = [...eqBands];
    updated[index] = val;
    setEqBands(updated);
    setEqPreset('Custom');
    audioEngine.setEQBand(index, val);
  };

  const handleSelectPreset = (name: string, bands: number[]) => {
    setEqPreset(name);
    setEqBands([...bands]);
    audioEngine.applyEQPreset(bands);
  };

  const handlePanChange = (newPan: number) => {
    setPan(newPan);
    audioEngine.setPanner(newPan);
  };

  const handleResetEQ = () => {
    const flat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    setEqPreset('Flat');
    setEqBands(flat);
    audioEngine.applyEQPreset(flat);
    setPan(0);
    audioEngine.setPanner(0);
  };

  // Ambient sound management
  const handleToggleAmbient = (id: string) => {
    setAmbientSounds(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.enabled;
        audioEngine.toggleAmbientSound(id, nextState, s.volume);
        return { ...s, enabled: nextState };
      }
      return s;
    }));
  };

  const handleAmbientVolume = (id: string, vol: number) => {
    setAmbientSounds(prev => prev.map(s => {
      if (s.id === id) {
        audioEngine.setAmbientVolume(id, vol);
        return { ...s, volume: vol };
      }
      return s;
    }));
  };

  const handleResetAllAmbience = () => {
    audioEngine.stopAllAmbience();
    setAmbientSounds(prev => prev.map(s => ({ ...s, enabled: false })));
  };

  // Sleep Timer Tick
  useEffect(() => {
    if (sleepRemainingSeconds === null) return;
    if (sleepRemainingSeconds <= 0) {
      // Pause playback
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setSleepRemainingSeconds(null);
      setSleepTimerOption(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepRemainingSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepRemainingSeconds]);

  const handleSetSleepTimer = (val: number | 'end-of-track' | null) => {
    setSleepTimerOption(val);
    if (val === null) {
      setSleepRemainingSeconds(null);
    } else if (typeof val === 'number') {
      setSleepRemainingSeconds(val * 60);
    } else {
      // End of track: set remaining seconds to track remainder
      const rem = Math.max(0, Math.floor(duration - currentTime));
      setSleepRemainingSeconds(rem);
    }
  };

  // Track playback handlers
  const playTrack = useCallback((track: Track) => {
    audioEngine.resume();
    audioEngine.stopProceduralLoFi();
    setCurrentTrack(track);
    setIsPlaying(true);
    setPlayHistory(prev => [track.id, ...prev.filter(id => id !== track.id)].slice(0, 30));

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(err => {
        console.warn('Audio playback error (switching to procedural fallback):', err);
        // Start procedural music engine fallback so music NEVER stops!
        audioEngine.startProceduralLoFi(track.genre.toLowerCase());
      });
    }
  }, [playbackRate]);

  const togglePlay = () => {
    audioEngine.resume();
    if (!currentTrack) {
      if (tracks.length > 0) playTrack(tracks[0]);
      return;
    }

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      audioEngine.stopProceduralLoFi();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          audioEngine.startProceduralLoFi(currentTrack.genre.toLowerCase());
        });
      }
      setIsPlaying(true);
    }
  };

  // Queue and track succession
  const currentTrackList = useMemo(() => {
    if (selectedPlaylistId) {
      const pl = playlists.find(p => p.id === selectedPlaylistId);
      if (pl) return tracks.filter(t => pl.trackIds.includes(t.id));
    }
    if (currentTab === 'favorites') {
      return tracks.filter(t => t.isLiked);
    }
    if (currentTab === 'local') {
      return tracks.filter(t => t.isLocal);
    }
    if (currentTab === 'history') {
      return playHistory.map(id => tracks.find(t => t.id === id)).filter(Boolean) as Track[];
    }
    return tracks;
  }, [selectedPlaylistId, playlists, currentTab, tracks, playHistory]);

  const handleNext = useCallback(() => {
    if (!currentTrack || currentTrackList.length === 0) return;
    if (isShuffle) {
      const remaining = currentTrackList.filter(t => t.id !== currentTrack.id);
      const next = remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : currentTrack;
      playTrack(next);
      return;
    }
    const currentIndex = currentTrackList.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentTrackList.length;
    playTrack(currentTrackList[nextIndex]);
  }, [currentTrack, currentTrackList, isShuffle, playTrack]);

  const handlePrevious = useCallback(() => {
    if (!currentTrack || currentTrackList.length === 0) return;
    if (currentTime > 3) {
      // If played more than 3 seconds, restart current track
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const currentIndex = currentTrackList.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentTrackList.length) % currentTrackList.length;
    playTrack(currentTrackList[prevIndex]);
  }, [currentTrack, currentTrackList, currentTime, playTrack]);

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    setIsMuted(false);
    if (audioRef.current) audioRef.current.volume = vol;
    audioEngine.setMasterGain(vol);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
    audioEngine.setMasterGain(nextMuted ? 0 : volume);
  };

  const handleToggleLike = (trackId: string) => {
    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        const nextLiked = !t.isLiked;
        // Also update favorites playlist
        setPlaylists(pls => pls.map(p => {
          if (p.id === 'pl-favorites') {
            const newTrackIds = nextLiked
              ? Array.from(new Set([...p.trackIds, trackId]))
              : p.trackIds.filter(id => id !== trackId);
            return { ...p, trackIds: newTrackIds };
          }
          return p;
        }));
        return { ...t, isLiked: nextLiked };
      }
      return t;
    }));
  };

  const handleCycleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(next);
  };

  const handleCycleVisualizer = () => {
    const modes: VisualizerMode[] = ['bars', 'wave', 'circle', 'nebula'];
    const next = modes[(modes.indexOf(visualizerMode) + 1) % modes.length];
    setVisualizerMode(next);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // File import handler (Local laptop files)
  const handleImportFiles = (files: FileList) => {
    const newTracks: Track[] = [];

    Array.from(files).forEach((file, idx) => {
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        const objectUrl = URL.createObjectURL(file);

        newTracks.push({
          id: `local-${Date.now()}-${idx}`,
          title: cleanName,
          artist: 'Local Laptop Audio',
          album: 'Imported Library',
          coverUrl: '/src/assets/images/album_lofi_midnight_1792417936228.jpg',
          audioUrl: objectUrl,
          duration: 180, // Updated when loadedmetadata fires
          genre: 'Local Audio',
          isLocal: true,
          bitrate: 'Lossless Local · 48 kHz',
          isLiked: false
        });
      }
    });

    if (newTracks.length > 0) {
      setTracks(prev => [...newTracks, ...prev]);
      setCurrentTab('local');
      setSelectedPlaylistId(null);
      // Immediately start playing first imported track!
      playTrack(newTracks[0]);
    }
  };

  // Keyboard shortcut listeners for laptop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (e.shiftKey) {
          handlePrevious();
        } else {
          handleSeek(Math.max(0, currentTime - 5));
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (e.shiftKey) {
          handleNext();
        } else {
          handleSeek(Math.min(duration, currentTime + 5));
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.05));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.05));
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'l') {
        setIsLyricsOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'e') {
        setIsEQOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'a') {
        setIsAmbientOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'v') {
        handleCycleVisualizer();
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreen(prev => !prev);
      } else if (e.key.toLowerCase() === 's') {
        setIsShuffle(prev => !prev);
      } else if (e.key.toLowerCase() === 'r') {
        handleCycleRepeat();
      } else if (e.key === '?') {
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsEQOpen(false);
        setIsAmbientOpen(false);
        setIsShortcutsOpen(false);
        setIsSleepTimerOpen(false);
        setIsCreatePlaylistOpen(false);
        setTrackForPlaylist(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleNext, handlePrevious, currentTime, duration, volume, isMuted, repeatMode, visualizerMode]);

  // Drag and drop audio files anywhere onto laptop window
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
      if (e.dataTransfer && e.dataTransfer.files) {
        handleImportFiles(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Filtered tracks for search
  const displayedTracks = useMemo(() => {
    let result = currentTrackList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = tracks.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      );
    }
    return result;
  }, [currentTrackList, searchQuery, tracks]);

  const activePlaylist = selectedPlaylistId ? playlists.find(p => p.id === selectedPlaylistId) : null;
  const localTracksCount = tracks.filter(t => t.isLocal).length;
  const ambientActiveCount = ambientSounds.filter(s => s.enabled).length;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans select-none">
      {/* Hidden Audio Player Element */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          if (sleepTimerOption === 'end-of-track') {
            setIsPlaying(false);
            setSleepTimerOption(null);
            setSleepRemainingSeconds(null);
            return;
          }
          if (repeatMode === 'one') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          } else if (repeatMode === 'all') {
            handleNext();
          } else {
            setIsPlaying(false);
          }
        }}
        onError={() => {
          // Automatic seamless procedural synth backup if network fails
          if (currentTrack) {
            audioEngine.startProceduralLoFi(currentTrack.genre.toLowerCase());
          }
        }}
      />

      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-sky-950/80 border-4 border-dashed border-sky-400 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none animate-in fade-in">
          <FolderDown className="w-16 h-16 text-sky-400 animate-bounce mb-3" />
          <h2 className="text-xl font-bold text-white">Drop Audio Files to Play</h2>
          <p className="text-xs text-sky-200 mt-1">Supports MP3, WAV, FLAC, M4A, and OGG from your laptop</p>
        </div>
      )}

      {/* Top Bar Contract (3 zones) */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedPlaylistId(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onImportFiles={handleImportFiles}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onToggleMiniPlayer={() => setIsMiniPlayer(prev => !prev)}
      />

      {/* Center Layout: Sidebar + Main Content + Lyrics Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setSelectedPlaylistId(null);
          }}
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onSelectPlaylist={(id) => {
            setSelectedPlaylistId(id);
          }}
          onCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
          onOpenEQ={() => setIsEQOpen(true)}
          onOpenAmbient={() => setIsAmbientOpen(true)}
          onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
          ambientActiveCount={ambientActiveCount}
          sleepTimerActive={sleepRemainingSeconds !== null}
          localTracksCount={localTracksCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent">
          {searchQuery.trim() ? (
            /* Search Results */
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-xs text-slate-400">
                  Found {displayedTracks.length} {displayedTracks.length === 1 ? 'match' : 'matches'}
                </p>
              </div>
              <TrackList
                tracks={displayedTracks}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={(t) => setTrackForPlaylist(t)}
                emptyTitle="No matching songs found"
                emptyDescription="Try searching for another artist, genre, or keyword."
              />
            </div>
          ) : selectedPlaylistId && activePlaylist ? (
            /* Playlist Details View */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-slate-800/80">
                <img
                  src={activePlaylist.coverUrl}
                  alt={activePlaylist.name}
                  referrerPolicy="no-referrer"
                  className="w-40 h-40 rounded-2xl object-cover shadow-2xl bg-slate-950 border border-slate-800 shrink-0"
                />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                    Playlist
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {activePlaylist.name}
                  </h1>
                  <p className="text-xs text-slate-400 max-w-lg">
                    {activePlaylist.description}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-500 pt-1">
                    <span>{displayedTracks.length} tracks</span>
                    <span>·</span>
                    <span>{Math.round(displayedTracks.reduce((acc, t) => acc + t.duration, 0) / 60)} mins</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-3">
                    <button
                      onClick={() => {
                        if (displayedTracks.length > 0) playTrack(displayedTracks[0]);
                      }}
                      disabled={displayedTracks.length === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play All</span>
                    </button>
                    <button
                      onClick={() => {
                        if (displayedTracks.length > 0) {
                          const rand = displayedTracks[Math.floor(Math.random() * displayedTracks.length)];
                          setIsShuffle(true);
                          playTrack(rand);
                        }
                      }}
                      disabled={displayedTracks.length === 0}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                    >
                      <Shuffle className="w-4 h-4 text-sky-400" />
                      <span>Shuffle</span>
                    </button>
                    {activePlaylist.isCustom && (
                      <button
                        onClick={() => {
                          setPlaylists(prev => prev.filter(p => p.id !== activePlaylist.id));
                          setSelectedPlaylistId(null);
                        }}
                        className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="Delete playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <TrackList
                tracks={displayedTracks}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={(t) => setTrackForPlaylist(t)}
                emptyTitle="This playlist is empty"
                emptyDescription="Browse tracks in your library and click '+' to add them here."
              />
            </div>
          ) : currentTab === 'discover' ? (
            <DiscoverView
              tracks={tracks}
              playlists={playlists}
              currentTrackId={currentTrack?.id || null}
              isPlaying={isPlaying}
              onPlayTrack={playTrack}
              onPlayPlaylist={(pl) => {
                setSelectedPlaylistId(pl.id);
                const plTracks = tracks.filter(t => pl.trackIds.includes(t.id));
                if (plTracks.length > 0) playTrack(plTracks[0]);
              }}
              onToggleLike={handleToggleLike}
              onAddToPlaylist={(t) => setTrackForPlaylist(t)}
              onOpenEQ={() => setIsEQOpen(true)}
              onOpenLocalTab={() => setCurrentTab('local')}
            />
          ) : currentTab === 'local' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <h1 className="text-xl font-bold text-white">Laptop Local Audio Library</h1>
                  <p className="text-xs text-slate-400">
                    Audio files loaded from your laptop storage ({localTracksCount} tracks)
                  </p>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 transition-colors shadow-sm cursor-pointer">
                  <FolderDown className="w-4 h-4" />
                  <span>Import More Files</span>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                    multiple
                    onChange={(e) => e.target.files && handleImportFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              <TrackList
                tracks={tracks.filter(t => t.isLocal)}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={(t) => setTrackForPlaylist(t)}
                emptyTitle="No local laptop files loaded"
                emptyDescription="Click 'Import More Files' or drag & drop any MP3, WAV, FLAC, or OGG files into this window to start listening."
                emptyActionLabel="Choose Audio Files"
                onEmptyAction={() => {
                  const input = document.getElementById('laptop-audio-import') as HTMLInputElement;
                  if (input) input.click();
                }}
              />
            </div>
          ) : currentTab === 'favorites' ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  Favorite Songs
                </h1>
                <p className="text-xs text-slate-400">
                  Your personally starred tracks for quick listening
                </p>
              </div>
              <TrackList
                tracks={tracks.filter(t => t.isLiked)}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={(t) => setTrackForPlaylist(t)}
                emptyTitle="No favorite tracks yet"
                emptyDescription="Click the heart icon on any track to save it to your favorites."
              />
            </div>
          ) : currentTab === 'history' ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    Playback History
                  </h1>
                  <p className="text-xs text-slate-400">
                    Recently played songs from this listening session
                  </p>
                </div>
                {playHistory.length > 0 && (
                  <button
                    onClick={() => setPlayHistory([])}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    Clear History
                  </button>
                )}
              </div>
              <TrackList
                tracks={playHistory.map(id => tracks.find(t => t.id === id)).filter(Boolean) as Track[]}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={(t) => setTrackForPlaylist(t)}
                emptyTitle="No playback history"
                emptyDescription="Tracks you play will appear here."
              />
            </div>
          ) : (
            /* All Library Tracks */
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h1 className="text-xl font-bold text-white">Full Sound Library</h1>
                <p className="text-xs text-slate-400">
                  All available streaming channels and laptop audio files ({tracks.length} tracks)
                </p>
              </div>
              <TrackList
                tracks={tracks}
                currentTrackId={currentTrack?.id || null}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={(t) => setTrackForPlaylist(t)}
              />
            </div>
          )}
        </main>

        {/* Synchronized Lyrics Drawer */}
        {isLyricsOpen && (
          <div className="w-80 h-full shrink-0 animate-in slide-in-from-right duration-200">
            <LyricsView
              track={currentTrack}
              currentTime={currentTime}
              onSeek={handleSeek}
              onClose={() => setIsLyricsOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Bottom Sticky Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSeek={handleSeek}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isLiked={currentTrack?.isLiked || false}
        onToggleLike={handleToggleLike}
        repeatMode={repeatMode}
        onCycleRepeat={handleCycleRepeat}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(prev => !prev)}
        playbackRate={playbackRate}
        onPlaybackRateChange={handlePlaybackRateChange}
        onOpenEQ={() => setIsEQOpen(true)}
        onOpenAmbient={() => setIsAmbientOpen(true)}
        isLyricsOpen={isLyricsOpen}
        onToggleLyrics={() => setIsLyricsOpen(prev => !prev)}
        visualizerMode={visualizerMode}
        onCycleVisualizer={handleCycleVisualizer}
        onOpenFullscreen={() => setIsFullscreen(true)}
      />

      {/* Fullscreen Player Mode */}
      <FullscreenPlayer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isLiked={currentTrack?.isLiked || false}
        onToggleLike={handleToggleLike}
        visualizerMode={visualizerMode}
        onCycleVisualizer={handleCycleVisualizer}
        onOpenEQ={() => setIsEQOpen(true)}
        repeatMode={repeatMode}
        onCycleRepeat={handleCycleRepeat}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(prev => !prev)}
      />

      {/* Floating Mini Player for Laptop Multitasking */}
      <MiniPlayer
        isOpen={isMiniPlayer}
        onClose={() => setIsMiniPlayer(false)}
        onExpand={() => {
          setIsMiniPlayer(false);
          setIsFullscreen(true);
        }}
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentTime={currentTime}
        duration={duration}
        isLiked={currentTrack?.isLiked || false}
        onToggleLike={handleToggleLike}
      />

      {/* Graphic EQ Modal */}
      <EqualizerModal
        isOpen={isEQOpen}
        onClose={() => setIsEQOpen(false)}
        bands={eqBands}
        onBandChange={handleBandChange}
        activePreset={eqPreset}
        onSelectPreset={handleSelectPreset}
        pan={pan}
        onPanChange={handlePanChange}
        onReset={handleResetEQ}
      />

      {/* Ambient Mixer Modal */}
      <AmbientMixerModal
        isOpen={isAmbientOpen}
        onClose={() => setIsAmbientOpen(false)}
        ambientSounds={ambientSounds}
        onToggleSound={handleToggleAmbient}
        onVolumeChange={handleAmbientVolume}
        onResetAll={handleResetAllAmbience}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        remainingSeconds={sleepRemainingSeconds}
        onSetTimer={handleSetSleepTimer}
      />

      {/* Keyboard Shortcuts Sheet */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={(name, description) => {
          const newPl: Playlist = {
            id: `pl-${Date.now()}`,
            name,
            description: description || 'Custom playlist created on laptop.',
            coverUrl: currentTrack?.coverUrl || '/src/assets/images/album_lofi_midnight_1792417936228.jpg',
            trackIds: currentTrack ? [currentTrack.id] : [],
            isCustom: true
          };
          setPlaylists(prev => [...prev, newPl]);
          setSelectedPlaylistId(newPl.id);
        }}
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={!!trackForPlaylist}
        onClose={() => setTrackForPlaylist(null)}
        track={trackForPlaylist}
        playlists={playlists}
        onToggleTrackInPlaylist={(playlistId, trackId) => {
          setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
              const has = p.trackIds.includes(trackId);
              return {
                ...p,
                trackIds: has ? p.trackIds.filter(id => id !== trackId) : [...p.trackIds, trackId]
              };
            }
            return p;
          }));
        }}
        onCreateNewPlaylist={() => {
          setIsCreatePlaylistOpen(true);
        }}
      />
    </div>
  );
}
