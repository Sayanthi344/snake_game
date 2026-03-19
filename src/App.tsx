import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, HardDrive } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00FFFF] font-sans selection:bg-[#FF00FF] selection:text-white overflow-hidden relative crt">
      <div className="static-noise" />
      
      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-8 flex justify-between items-center max-w-7xl mx-auto border-b-4 border-[#FF00FF] mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF00FF] flex items-center justify-center border-2 border-[#00FFFF]">
            <Terminal className="text-[#050505]" size={32} />
          </div>
          <div>
            <h1 
              className="text-4xl font-mono uppercase leading-none text-[#00FFFF] glitch-text" 
              data-text="SNAKE.EXE"
            >
              SNAKE.EXE
            </h1>
            <p className="text-sm font-sans uppercase tracking-[0.2em] text-[#FF00FF] mt-1">
              SYS.VER // 9.9.9 // CORRUPTED
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-mono uppercase tracking-widest text-[#00FFFF] mb-1">MEM_ALLOC: OK</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-4 h-4 bg-[#050505] border border-[#FF00FF] overflow-hidden">
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1, ease: "steps(2)" }}
                  className="w-full h-full bg-[#00FFFF]"
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-2 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Game Section */}
        <section className="flex flex-col items-center">
          <div className="flex w-full items-center gap-2 mb-2 text-[#FF00FF] uppercase text-lg font-mono tracking-widest border-b border-[#00FFFF] pb-2">
            <Cpu size={20} />
            <span>PROC.ID: 0x8FA3 // SNAKE_THREAD</span>
          </div>
          <SnakeGame />
        </section>

        {/* Sidebar Section */}
        <aside className="space-y-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-[#FF00FF] uppercase text-lg font-mono tracking-widest border-b border-[#00FFFF] pb-2">
              <HardDrive size={20} />
              <span>AUDIO.DECODER // STREAM_ACTIVE</span>
            </div>
            <MusicPlayer />
          </div>

          {/* Info Card */}
          <div className="bg-[#050505] border-2 border-[#00FFFF] p-6 shadow-[4px_4px_0px_#FF00FF]">
            <h4 className="text-xl font-mono uppercase tracking-widest text-[#FF00FF] mb-4 glitch-text" data-text="INPUT.MAPPING">INPUT.MAPPING</h4>
            <div className="space-y-4 font-sans text-lg">
              <div className="flex justify-between items-center border-b border-[#00FFFF]/30 pb-2">
                <span className="text-[#00FFFF]">VECTOR_CTRL</span>
                <span className="bg-[#FF00FF] text-[#050505] px-2 py-1 font-mono">ARROWS</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#00FFFF]/30 pb-2">
                <span className="text-[#00FFFF]">HALT_EXEC</span>
                <span className="bg-[#FF00FF] text-[#050505] px-2 py-1 font-mono">SPACE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#00FFFF]">AUDIO_OVERRIDE</span>
                <span className="bg-[#FF00FF] text-[#050505] px-2 py-1 font-mono">UI_BTN</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
