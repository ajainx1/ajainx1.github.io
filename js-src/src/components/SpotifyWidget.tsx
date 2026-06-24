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
    album: "Hurry Up, We're Dreaming",
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

interface SpotifyWidgetProps { isDark: boolean; }

export default function SpotifyWidget({ isDark }: SpotifyWidgetProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(42);
  const [seconds, setSeconds] = useState(84);

  const currentTrack = PLAYLIST[currentTrackIndex];
  const parseDuration = (dur: string) => { const [m, s] = dur.split(':').map(Number); return m * 60 + s; };
  const totalSeconds = parseDuration(currentTrack.duration);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev >= totalSeconds) {
            setCurrentTrackIndex(pi => (pi + 1) % PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  useEffect(() => { setProgress(Math.floor((seconds / totalSeconds) * 100)); }, [seconds, totalSeconds]);

  const handleTrackChange = (index: number) => { setCurrentTrackIndex(index); setSeconds(0); setProgress(0); };
  const formatTime = (secs: number) => { const m = Math.floor(secs / 60); const s = secs % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  const handleNext = () => handleTrackChange((currentTrackIndex + 1) % PLAYLIST.length);
  const handlePrev = () => handleTrackChange((currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length);

  const cardBg = isDark ? '#111111' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const deepBg = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.03)';
  const trackBg = isDark ? '#000' : '#f8f8fa';
  const textPrimary = isDark ? '#fff' : '#111';
  const textSecondary = isDark ? '#9ca3af' : '#666';
  const textMuted = isDark ? '#4b5563' : '#aaa';
  const controlsBg = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)';
  const controlsBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const trackItemHover = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const activeTrackBg = isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)';

  return (
    <div
      className="rounded-sm border p-5 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10"
      style={{
        background: cardBg,
        borderColor: cardBorder,
        boxShadow: isPlaying ? '0 0 0 1px rgba(59,130,246,0.12), 0 8px 32px rgba(59,130,246,0.08)' : undefined,
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center text-white animate-pulse"
               style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
            <Radio size={15} />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Recent Listening</h3>
            <p className="text-[9px] font-mono uppercase tracking-wider" style={{ color: textMuted }}>
              Founder's Spotify Feed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono text-blue-400"
             style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          LIVE
        </div>
      </div>

      {/* Player */}
      <div
        className="rounded-sm border p-3 sm:p-4 mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
        style={{ background: deepBg, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden group shadow-lg flex-shrink-0"
             style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
          <img
            src={currentTrack.imageUrl}
            alt={currentTrack.album}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music size={20} className="text-blue-400" />
          </div>
        </div>

        <div className="flex-1 w-full text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-between gap-2 mb-1">
            <h4 className="text-sm font-bold truncate hover:text-blue-400 transition-colors"
                style={{ color: textPrimary }}>
              {currentTrack.title}
            </h4>
            <a href={currentTrack.spotifyUrl} target="_blank" rel="noopener noreferrer"
               className="hover:text-blue-400 transition-colors flex-shrink-0" title="Open in Spotify"
               style={{ color: textMuted }}>
              <ExternalLink size={13} />
            </a>
          </div>
          <p className="text-xs truncate" style={{ color: textSecondary }}>{currentTrack.artist}</p>
          <p className="text-[10px] uppercase tracking-wider truncate mt-0.5" style={{ color: textMuted }}>
            {currentTrack.album}
          </p>

          {/* Waveform visualizer */}
          <div className="flex items-end gap-1 h-5 mt-2 justify-center sm:justify-start">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="w-0.5 rounded-sm"
                style={{
                  height: isPlaying ? `${6 + ((i * 7) % 16)}px` : '3px',
                  background: `rgba(59,130,246,${0.3 + (i % 4) * 0.15})`,
                  animation: isPlaying ? `bounce ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${i * 0.07}s`,
                  transition: 'height 0.3s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="w-full h-1 rounded-full overflow-hidden relative cursor-pointer"
             style={{ background: isDark ? '#1a1a1a' : '#e8e8ed' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
            }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono mt-1.5" style={{ color: textMuted }}>
          <span>{formatTime(seconds)}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div
        className="flex justify-between items-center p-2 sm:p-2.5 rounded-sm border"
        style={{ background: controlsBg, borderColor: controlsBorder }}
      >
        <div className="flex items-center gap-1.5">
          <Volume2 size={13} style={{ color: textMuted }} />
          <div className="w-10 sm:w-14 h-0.5 rounded-full overflow-hidden" style={{ background: isDark ? '#1f2937' : '#e0e0e5' }}>
            <div className="h-full w-4/5 rounded-full" style={{ background: isDark ? '#374151' : '#ccc' }} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={handlePrev} className="p-1.5 transition-all hover:scale-110"
                  style={{ color: textMuted }}>
            <SkipBack size={15} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md rounded-sm"
            style={{ background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff' }}
          >
            {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={handleNext} className="p-1.5 transition-all hover:scale-110"
                  style={{ color: textMuted }}>
            <SkipForward size={15} />
          </button>
        </div>

        <span className="text-[9px] font-mono uppercase tracking-[0.2em] hidden sm:block"
              style={{ color: textMuted }}>
          {isPlaying ? 'ACTIVE' : 'PAUSED'}
        </span>
      </div>

      {/* Playlist */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: textMuted }}>
          Focus History
        </p>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {PLAYLIST.map((track, index) => (
            <button
              key={index}
              onClick={() => handleTrackChange(index)}
              className="w-full text-left flex items-center justify-between p-2 rounded-sm text-[11px] transition-all"
              style={{
                background: index === currentTrackIndex ? activeTrackBg : 'transparent',
                borderLeft: index === currentTrackIndex ? '2px solid #3b82f6' : '2px solid transparent',
                color: index === currentTrackIndex ? '#60a5fa' : textSecondary,
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[9px] w-4 text-right flex-shrink-0" style={{ color: textMuted }}>
                  0{index + 1}
                </span>
                <span className="truncate font-medium">{track.title}</span>
                <span className="text-[10px] truncate" style={{ color: textMuted }}>— {track.artist}</span>
              </div>
              <span className="font-mono text-[9px] flex-shrink-0 ml-2" style={{ color: textMuted }}>
                {track.duration}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
