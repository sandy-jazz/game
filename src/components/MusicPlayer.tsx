import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, BarChart3, Repeat, Repeat1 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#06b6d4"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ec4899"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Digital Echo",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#a855f7"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'none' | 'track' | 'queue'>('none');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    if (repeatMode === 'track') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'queue') {
      handleNext();
    } else {
      // If not last track, go to next
      if (currentTrackIndex < TRACKS.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'queue';
      if (prev === 'queue') return 'track';
      return 'none';
    });
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Visualizer Area */}
      <div className="relative h-24 w-full mb-6 flex items-end justify-center gap-1 overflow-hidden rounded-xl bg-black/20 border border-white/5 p-2">
        <div className="absolute top-2 left-3 flex items-center gap-1.5">
          <BarChart3 className="w-3 h-3 text-cyan-500/50" />
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Spectral Analysis</span>
        </div>
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying 
                ? [
                    `${20 + Math.random() * 60}%`, 
                    `${10 + Math.random() * 80}%`, 
                    `${30 + Math.random() * 50}%`
                  ] 
                : "4px"
            }}
            transition={{
              duration: isPlaying ? 0.4 + Math.random() * 0.4 : 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full max-w-[8px] rounded-t-full bg-gradient-to-t from-cyan-500/20 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          animate={{ 
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? [1, 1.05, 1] : 1
          }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 8, ease: "linear" },
            scale: { repeat: Infinity, duration: 2 }
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Music className="w-8 h-8 text-cyan-400" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-sm text-slate-400 font-mono uppercase tracking-wider">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full bg-slate-800 rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleRepeat}
          className={`p-2 transition-colors ${repeatMode !== 'none' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
          title={`Repeat: ${repeatMode}`}
        >
          {repeatMode === 'track' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center text-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-slate-500">
          <Volume2 className="w-4 h-4" />
          <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-slate-600"></div>
          </div>
        </div>
      </div>

      {/* Track List Mini */}
      <div className="mt-8 space-y-2">
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-slate-800/50'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${idx === currentTrackIndex ? 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]' : 'bg-slate-700'}`} />
            <span className={`text-xs font-mono uppercase tracking-wider ${idx === currentTrackIndex ? 'text-cyan-400' : 'text-slate-500'}`}>
              {track.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
