import { Track, Playlist, EqualizerPreset } from '../types';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Rainy Night Study Session',
    artist: 'Coffee Beats & Tape',
    album: 'Midnight Study Sessions',
    coverUrl: '/src/assets/images/album_lofi_midnight_1792417936228.jpg',
    // High quality royalty-free lo-fi / chill piano stream from reliable open CDN
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    duration: 147,
    genre: 'Lo-Fi Chillhop',
    year: 2024,
    bitrate: '320 kbps · 44.1 kHz',
    isLiked: true,
    lyrics: [
      { time: 0, text: '♪ Warm amber lamp glow on the paper ♪' },
      { time: 14, text: 'Raindrops tap against the glass windowpane' },
      { time: 28, text: 'Gentle vinyl crackle in the headphones' },
      { time: 42, text: 'Midnight thoughts wandering through the notes' },
      { time: 58, text: 'Tea steam rising into the quiet dark room' },
      { time: 74, text: 'A steady rhythm to keep the mind at ease' },
      { time: 92, text: 'Pages turn softly in the silent night' },
      { time: 110, text: 'Deep focus settles in as the clock ticks past two' },
      { time: 128, text: '♪ Peaceful drift into the late hours ♪' }
    ]
  },
  {
    id: 'track-2',
    title: 'Neon Horizon 1984',
    artist: 'Cyber Runner',
    album: 'Neon Fury: Synthwave Odyssey',
    coverUrl: '/src/assets/images/album_synth_sunset_1792417951706.jpg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3',
    duration: 172,
    genre: 'Synthwave / Retrowave',
    year: 2024,
    bitrate: '320 kbps · 48.0 kHz',
    isLiked: false,
    lyrics: [
      { time: 0, text: '♪ Analog synthesizers ignite the grid ♪' },
      { time: 18, text: 'Streaking through chrome freeways under magenta skies' },
      { time: 36, text: 'Digital pulse racing through the dashboard' },
      { time: 54, text: 'Laser lights reflect in retro mirrors' },
      { time: 72, text: 'Accelerating toward the neon horizon line' },
      { time: 90, text: 'The city below fades into electric static' },
      { time: 112, text: 'Velocity 180, nothing can slow this drive' },
      { time: 135, text: 'Midnight overdrive in the infinite simulation' }
    ]
  },
  {
    id: 'track-3',
    title: 'Nordic Mist & Stone',
    artist: 'Aeterna Ensemble',
    album: 'Echoes of Mist',
    coverUrl: '/src/assets/images/album_ambient_sanctuary_1792417951819.jpg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    duration: 184,
    genre: 'Ambient / Neoclassical',
    year: 2024,
    bitrate: 'Lossless FLAC · 96 kHz',
    isLiked: true,
    lyrics: [
      { time: 0, text: '♪ Serene mountain wind across still water ♪' },
      { time: 24, text: 'Echoes of ancient stones standing through time' },
      { time: 52, text: 'A solitary piano chord ripples the surface' },
      { time: 80, text: 'Breath slows down to match the rising fog' },
      { time: 110, text: 'Subtle harmonics expanding the room' },
      { time: 140, text: 'Weightless clarity in the silence between notes' },
      { time: 165, text: 'Pure stillness returns to the fjord' }
    ]
  },
  {
    id: 'track-4',
    title: 'Autumn Rain at Midnight',
    artist: 'The Midnight Quintet',
    album: 'Midnight Jazz at the Spotlight',
    coverUrl: '/src/assets/images/album_jazz_nocturne_1792417951921.jpg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_9855b40cf3.mp3?filename=jazz-happy-110855.mp3',
    duration: 135,
    genre: 'Modal Jazz / Kissa',
    year: 2023,
    bitrate: '320 kbps · 44.1 kHz',
    isLiked: true,
    lyrics: [
      { time: 0, text: '♪ Warm double bass walks into the spotlight ♪' },
      { time: 15, text: 'Brushed snare whisper like footsteps on wet asphalt' },
      { time: 32, text: 'Tenor saxophone sings a smoky midnight ballad' },
      { time: 50, text: 'Espresso cup clinks in the corner of the cafe' },
      { time: 70, text: 'Piano fills the room with rich melancholic chords' },
      { time: 95, text: 'Improvising through the amber reflections' },
      { time: 115, text: 'Gentle brass fade into the cool autumn air' }
    ]
  },
  {
    id: 'track-5',
    title: 'Subtle Focus Flow (432Hz)',
    artist: 'Monk of Sound',
    album: 'Echoes of Mist',
    coverUrl: '/src/assets/images/album_ambient_sanctuary_1792417951819.jpg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8cbf85590.mp3?filename=deep-meditation-192828.mp3',
    duration: 210,
    genre: 'Meditation & Focus',
    year: 2024,
    bitrate: '320 kbps · 48.0 kHz',
    isLiked: false,
    lyrics: [
      { time: 0, text: '♪ Deep resonant drone tuned to 432 Hz ♪' },
      { time: 30, text: 'Alpha wave synchronization for mental clarity' },
      { time: 65, text: 'Eliminating cognitive fatigue and distractions' },
      { time: 105, text: 'Sustained focus, deep immersion' },
      { time: 150, text: 'Calm alpha waves washing over awareness' }
    ]
  },
  {
    id: 'track-6',
    title: 'Cassette Tape Nostalgia',
    artist: 'Coffee Beats & Tape',
    album: 'Midnight Study Sessions',
    coverUrl: '/src/assets/images/album_lofi_midnight_1792417936228.jpg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=lofi-orchestra-16230.mp3',
    duration: 124,
    genre: 'Lo-Fi Chillhop',
    year: 2024,
    bitrate: '320 kbps · 44.1 kHz',
    isLiked: false,
    lyrics: [
      { time: 0, text: '♪ Analog flutter and magnetic warmth ♪' },
      { time: 20, text: 'Faded memories captured on magnetic tape' },
      { time: 45, text: 'Bouncing guitar chords and soft kick drum' },
      { time: 75, text: 'Afternoon sun pouring across the wooden floor' },
      { time: 100, text: 'A quiet afternoon doing nothing at all' }
    ]
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-favorites',
    name: 'Favorite Tracks',
    description: 'Tracks you have starred for quick laptop listening.',
    coverUrl: '/src/assets/images/album_lofi_midnight_1792417936228.jpg',
    trackIds: ['track-1', 'track-3', 'track-4']
  },
  {
    id: 'pl-study',
    name: 'Deep Study & Coding',
    description: 'Mellow lo-fi beats, ambient textures and zero vocals for uninterrupted laptop workflow.',
    coverUrl: '/src/assets/images/album_ambient_sanctuary_1792417951819.jpg',
    trackIds: ['track-1', 'track-3', 'track-5', 'track-6']
  },
  {
    id: 'pl-night-drive',
    name: 'Cyber Night Drive',
    description: 'Energetic 80s synthwave, analog basslines and pumping arpeggios.',
    coverUrl: '/src/assets/images/album_synth_sunset_1792417951706.jpg',
    trackIds: ['track-2']
  },
  {
    id: 'pl-jazz-kissa',
    name: 'Tokyo Jazz Kissa',
    description: 'Warm acoustic jazz, walking basslines, vinyl crackle and espresso vibes.',
    coverUrl: '/src/assets/images/album_jazz_nocturne_1792417951921.jpg',
    trackIds: ['track-4']
  }
];

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS: EqualizerPreset[] = [
  {
    name: 'Flat',
    description: 'Natural direct sound without acoustic coloration',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: 'Laptop Speakers Pro',
    description: 'Specially tuned to cut muddy low sub-bass and enhance mids/treble on laptop built-in speakers',
    bands: [-5, -2, 2, 4, 3, 2, 3, 4, 3, 1]
  },
  {
    name: 'Bass Boost',
    description: 'Rich low-end warmth for headphones and external desktop monitors',
    bands: [6, 5, 4, 2, 0, -1, 0, 1, 2, 3]
  },
  {
    name: 'Vocal Presence',
    description: 'Brings voices and solo instruments forward with crystal clarity',
    bands: [-2, -1, 0, 2, 4, 5, 3, 2, 1, 0]
  },
  {
    name: 'Lo-Fi Chill Warmth',
    description: 'Analog tape rolloff with enhanced low-mids and attenuated high treble',
    bands: [3, 4, 3, 2, 0, -1, -2, -3, -5, -6]
  },
  {
    name: 'Electronic / Dance',
    description: 'Punchy bass drum and crisp hi-hat sizzle for electronic music',
    bands: [5, 4, 2, -1, -2, 1, 3, 4, 5, 4]
  },
  {
    name: 'Acoustic & Classical',
    description: 'Spacious organic soundstage with natural wooden resonance',
    bands: [2, 2, 1, 0, 2, 3, 3, 4, 3, 2]
  }
];
