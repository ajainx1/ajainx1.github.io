import React, { useState, useEffect } from 'react';
import { Play, Pause, Music, Radio, Volume2, SkipForward, SkipBack, ExternalLink } from 'lucide-react';
import { Track } from '../types';

const PLAYLIST: Track[] = [
  {
    title: "Still Don't Know My Name (From \"Euphoria\")",
    artist: "Labrinth",
    album: "Euphoria OST",
    duration: "2:33",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0289c39ba1acdf33ed7acd3867",
    spotifyUrl: "https://open.spotify.com/track/6N22FZs2ZhPBYi3b9XPajV",
  },
  {
    title: "Ribs",
    artist: "Lorde",
    album: "Pure Heroine",
    duration: "4:18",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02187331e276c898d39764cc98",
    spotifyUrl: "https://open.spotify.com/track/2MvvoeRt8NcOXWESkxWn3g",
  },
  {
    title: "Elijah",
    artist: "Matthew And The Atlas",
    album: "Temple",
    duration: "4:10",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0237f547aac571c23fbd2e4aa8",
    spotifyUrl: "https://open.spotify.com/track/2j0TnrVUhRav9s9MzDLaOv",
  },
  {
    title: "Chamber Of Reflection",
    artist: "Mac DeMarco",
    album: "Salad Days",
    duration: "3:51",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02d29a6b42f592c433ee31104d",
    spotifyUrl: "https://open.spotify.com/track/5oeOWXjH8NZFOWP0SpSXqV",
  },
  {
    title: "Rosyln",
    artist: "Bon Iver, St. Vincent",
    album: "Twilight Saga OST",
    duration: "4:49",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e028cdc3315bbb5331eddf6a21d",
    spotifyUrl: "https://open.spotify.com/track/4k7x3QKrc3h3U0Viqk0uop",
  },
  {
    title: "Wolves",
    artist: "Kanye West",
    album: "The Life Of Pablo",
    duration: "5:01",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e022a7db835b912dc5014bd37f4",
    spotifyUrl: "https://open.spotify.com/track/432hUIl3ISDeytYW5XBQ5h",
  },
  {
    title: "Mystery of Love",
    artist: "Sufjan Stevens",
    album: "Mystery of Love",
    duration: "4:08",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e023fc1588803d1887f11d660cc",
    spotifyUrl: "https://open.spotify.com/track/5GbVzc6Ex5LYlLJqzRQhuy",
  },
  {
    title: "Another Love",
    artist: "Tom Odell",
    album: "Long Way Down",
    duration: "4:04",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e021917a0f3f4152622a040913f",
    spotifyUrl: "https://open.spotify.com/track/3JvKfv6T31zO0ini8iNItO",
  },
  {
    title: "Ride",
    artist: "Twenty One Pilots",
    album: "Blurryface",
    duration: "3:34",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e022df0d98a423025032d0db1f7",
    spotifyUrl: "https://open.spotify.com/track/2Z8WuEywRWYTKe1NybPQEW",
  },
  {
    title: "The Night We Met",
    artist: "Lord Huron",
    album: "Strange Trails",
    duration: "3:28",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0217875a0610c23d8946454583",
    spotifyUrl: "https://open.spotify.com/track/3hRV0jL3vUpRrcy398teAU",
  },
  {
    title: "It's Ok",
    artist: "Tom Rosenthal",
    album: "The Pleasant Trees",
    duration: "3:11",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0281d2341ea6c0d31a33207f26",
    spotifyUrl: "https://open.spotify.com/track/2Iyfw8YfKruAagJwGc4G07",
  },
  {
    title: "I Found",
    artist: "Amber Run",
    album: "5AM",
    duration: "4:33",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e0207a1897752cd38db3e9e43f3",
    spotifyUrl: "https://open.spotify.com/track/5zT5cMnMKoyruPj13TQXGx",
  },
  {
    title: "Anchor",
    artist: "Novo Amor",
    album: "Bathing Beach",
    duration: "4:17",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02277620423172f5a151f452e3",
    spotifyUrl: "https://open.spotify.com/track/7qH9Z4dJEN0l9bidizW7fq",
  },
  {
    title: "In the Wind",
    artist: "Lord Huron",
    album: "Lonesome Dreams",
    duration: "5:25",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e02542039818419947a015b8994",
    spotifyUrl: "https://open.spotify.com/track/0HNOnAD8CBnZAjXZIoHTKk",
  },
  {
    title: "Berlin",
    artist: "RY X",
    album: "Dawn",
    duration: "2:54",
    imageUrl: "https://i.scdn.co/image/ab67616d00001e023cdc10addc062fe6ef755dbb",
    spotifyUrl: "https://open.spotify.com/track/5REBSsJkKSD6LEiXSYHO2d",
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
            loading="lazy"
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
