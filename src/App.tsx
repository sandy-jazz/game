import React, { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Trophy, Music as MusicIcon, Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Background Glows & Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Blue Neon Streak from screenshot */}
        <div 
          className="absolute top-[40%] left-[15%] w-[150px] h-[2px] bg-cyan-500 shadow-[0_0_15px_#06b6d4] rotate-[45deg] opacity-50"
        />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Gamepad2 className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              NEON <span className="text-cyan-400">SNAKE</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Arcade Edition v1.0</p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Current Score</p>
            <p className="text-4xl font-black text-cyan-400 tabular-nums leading-none">{score.toString().padStart(4, '0')}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">High Score</p>
            <div className="flex items-center justify-end gap-3">
              <Trophy className="w-6 h-6 text-pink-500" />
              <p className="text-4xl font-black text-pink-500 tabular-nums leading-none">{highScore.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 p-8 max-w-7xl mx-auto w-full items-center">
        
        {/* Game Window */}
        <section className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex justify-center"
          >
            <SnakeGame onScoreChange={handleScoreChange} />
          </motion.div>
          
          <div className="mt-8 flex gap-4">
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Controls:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-cyan-400">Arrows</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-pink-400">Space</kbd>
            </div>
          </div>
        </section>

        {/* Sidebar / Music Player */}
        <aside className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MusicIcon className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Now Playing</h2>
            </div>
            <MusicPlayer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-slate-900/40 border border-slate-800/50 rounded-2xl"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-4">Game Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-slate-500 uppercase">App Status</span>
                <span className="text-xs font-mono text-cyan-400">OPERATIONAL</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: ['20%', '80%', '40%', '90%'] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-pink-500"
                />
              </div>
              <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
                SYSTEM_LOG: Snake core initialized. Audio engine active. Neon buffers at 100% capacity.
              </p>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
        <span>&copy; 2026 Neon Arcade</span>
        <div className="flex gap-6">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-pink-400 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
        </div>
      </footer>
    </div>
  );
}
