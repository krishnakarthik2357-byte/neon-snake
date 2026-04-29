import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200 overflow-x-hidden relative flex flex-col">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <header className="pt-8 pb-4 px-6 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Neon</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">Snake</span>
        </h1>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Synthwave Edition</p>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 z-10">
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <MusicPlayer />
        </div>
      </main>

      <footer className="py-6 text-center border-t border-white/5 z-10">
        <p className="text-slate-500 text-sm font-mono">&copy; 2099 Cyber Arcade Systems</p>
      </footer>
    </div>
  );
}
