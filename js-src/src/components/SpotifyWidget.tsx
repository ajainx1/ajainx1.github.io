import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Radio, Volume2, SkipForward, SkipBack, ExternalLink } from 'lucide-react';
import { Track } from '../types';

const PLAYLIST: Track[] = [
  {
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    duration: '3:32',
    imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200',
    spotifyUrl: 'https://open.spotify.com/track/1uLa09v9vVvA_q56NWhC0B',
  },
  {
    title: 'After Hours',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '6:01',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=200',
    spotifyUrl: 'https://open.spotify.com/track/2Z8z7tV66of67_qX8X23',
  },
  {
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    duration: '4:03',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=200',
    spotifyUrl: 'https://open.spotify.com/track/168gL67S3S688nN13',
  },
  {
    title: 'Time',
    artist: 'Hans Zimmer',
    album: 'Inception OST',
    duration: '4:35',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=200',
    spotifyUrl: 'https://open.spotify.com/track/6ZFbXI2yv67vIE8',
  },
];

export default function SpotifyWidget() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(42); // percentage
  const [seconds, setSeconds] = useState(84); // 1m 24s

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Parse duration string "m:ss" to total seconds
  const parseDuration = (dur: string) => {
    const [m, s] = dur.split(':').map(Number);
    return m * 60 + s;
  };

  const totalSeconds = parseDuration(currentTrack.duration);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= totalSeconds) {
            // Loop to next track
            setCurrentTrackIndex((prevIdx) => (prevIdx + 1) % PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  useEffect(() => {
    setProgress(Math.floor((seconds / totalSeconds) * 100));
  }, [seconds, totalSeconds]);

  // Reset clock when changing track
  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    setSeconds(0);
    setProgress(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    handleTrackChange((currentTrackIndex + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    handleTrackChange((currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-none p-6 text-white shadow-2xl hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-none bg-blue-600 flex items-center justify-center text-white font-semibold animate-pulse">
            <Radio size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Recent Listening</h3>
            <p className="text-[10px] text-neutral-500 font-mono">FOUNDER'S SPOTIFY FEED</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-blue-950/40 border border-blue-900/30 text-[10px] font-mono text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          LIVE SYNC
        </div>
      </div>

      {/* Main Player Display */}
      <div className="bg-black/60 border border-white/5 rounded-none p-4 mb-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden group shadow-lg flex-shrink-0 border border-white/10">
          <img 
            src={currentTrack.imageUrl} 
            alt={currentTrack.album}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music size={24} className="text-blue-400 animate-bounce" />
          </div>
        </div>

        <div className="flex-1 w-full text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-between gap-2">
            <h4 className="text-sm font-bold text-white truncate hover:text-blue-400 transition-colors">
              {currentTrack.title}
            </h4>
            <a 
              href={currentTrack.spotifyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-blue-400 transition-colors"
              title="Open in Spotify"
            >
              <ExternalLink size={14} />
            </a>
          </div>
          <p className="text-xs text-neutral-300 truncate mt-0.5">{currentTrack.artist}</p>
          <p className="text-[10px] text-neutral-500 truncate mt-1 uppercase tracking-wider">ALBUM: {currentTrack.album}</p>

          {/* Animated Wave visualizer when playing */}
          <div className="flex items-end gap-1.5 h-5 mt-3 justify-center sm:justify-start">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="w-1 bg-blue-500 transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.floor(Math.random() * 16) + 4}px` : '4px',
                  opacity: isPlaying ? 0.4 + (i % 3) * 0.2 : 0.2,
                  animation: isPlaying ? `bounce 1s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="mb-4">
        <div className="w-full bg-neutral-900 h-1 rounded-none overflow-hidden relative group cursor-pointer">
          <div 
            className="bg-blue-500 h-full transition-all duration-300 relative" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1.5">
          <span>{formatTime(seconds)}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Media controls bar */}
      <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-none border border-white/5">
        <div className="flex items-center gap-1">
          <Volume2 size={14} className="text-neutral-500" />
          <div className="w-12 bg-neutral-900 h-0.5 rounded-none overflow-hidden">
            <div className="bg-neutral-600 h-full w-4/5" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-1.5 text-neutral-500 hover:text-white rounded-none transition-all"
          >
            <SkipBack size={16} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 bg-white text-black flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button 
            onClick={handleNext}
            className="p-1.5 text-neutral-500 hover:text-white rounded-none transition-all"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] sm:block hidden">
          {isPlaying ? 'ACTIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Playlist tracks selection */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-widest">Focus History</p>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
          {PLAYLIST.map((track, index) => (
            <button
              key={index}
              onClick={() => handleTrackChange(index)}
              className={`w-full text-left flex items-center justify-between p-2 rounded-none text-[11px] transition-all ${
                index === currentTrackIndex 
                  ? 'bg-blue-950/20 border-l-2 border-blue-500 text-blue-400 font-medium' 
                  : 'hover:bg-neutral-900 text-neutral-500 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[9px] w-3 text-neutral-600 text-right">0{index + 1}</span>
                <span className="truncate">{track.title}</span>
                <span className="text-[10px] text-neutral-500 truncate">- {track.artist}</span>
              </div>
              <span className="font-mono text-[9px] text-neutral-500">{track.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
