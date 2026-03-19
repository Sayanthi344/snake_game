import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "ERR_NO_SIGNAL",
    artist: "AI_SYNTH_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/glitch1/400/400?grayscale"
  },
  {
    id: 2,
    title: "DATA_CORRUPTION",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/glitch2/400/400?grayscale"
  },
  {
    id: 3,
    title: "MEMORY_LEAK",
    artist: "GHOST_IN_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/glitch3/400/400?grayscale"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentTrackIndex]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#050505] border-2 border-[#FF00FF] p-6 shadow-[-6px_6px_0px_#00FFFF] relative overflow-hidden">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={() => handleSkip('next')}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative group border-2 border-[#00FFFF] p-1 bg-[#050505]">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-20 h-20 object-cover filter contrast-150 brightness-75 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-[#FF00FF]/30 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <Radio className="text-[#00FFFF] animate-pulse" size={32} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#00FFFF] font-mono text-xl truncate tracking-tighter glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#FF00FF] text-sm font-sans truncate uppercase tracking-widest mt-1">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="h-4 w-full bg-[#050505] border border-[#00FFFF] relative">
          <div 
            className="h-full bg-[#FF00FF] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          {/* Grid overlay for progress bar */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTAgNEw0IDBaIiBzdHJva2U9IiMwNTA1MDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => handleSkip('prev')}
            className="p-2 border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#050505] transition-none"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-12 bg-[#FF00FF] hover:bg-[#00FFFF] border-2 border-[#00FFFF] flex items-center justify-center text-[#050505] transition-none"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>

          <button 
            onClick={() => handleSkip('next')}
            className="p-2 border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#050505] transition-none"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 text-[#FF00FF]">
          <Volume2 size={16} />
          <div className="w-32 h-2 bg-[#050505] border border-[#FF00FF]">
            <div className="w-2/3 h-full bg-[#00FFFF]" />
          </div>
        </div>
      </div>
    </div>
  );
}

