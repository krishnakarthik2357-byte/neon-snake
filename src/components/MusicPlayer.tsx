import { useEffect, useState, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Cyber Race (AI Generated)",
    artist: "NeonBot",
    url: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg"
  },
  {
    id: 2,
    title: "Synthwave Circuit (AI Generated)",
    artist: "AudioGenIX",
    url: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race2.ogg"
  },
  {
    id: 3,
    title: "Neon Menu Loop (AI Generated)",
    artist: "AlgoBeats",
    url: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/menu.ogg"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-slate-900/80 border border-fuchsia-500/50 rounded-xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(217,70,239,0.2)] flex flex-col gap-4 max-w-sm w-full mx-auto">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded} 
        loop={false}
      />
      
      <div className="flex items-center gap-4 border-b border-fuchsia-500/30 pb-4">
        <div className="w-12 h-12 rounded-full bg-fuchsia-950 flex items-center justify-center border-2 border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]">
          <Music className="text-fuchsia-400" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-fuchsia-100 font-bold truncate text-lg tracking-wide">{currentTrack.title}</h3>
          <p className="text-fuchsia-400/80 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-fuchsia-300 hover:text-fuchsia-100 transition-colors p-2"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-fuchsia-400 hover:bg-fuchsia-900 hover:text-fuchsia-200 transition-all border border-fuchsia-500/30 hover:border-fuchsia-400 shadow-[0_0_10px_transparent] hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-all border border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.6)] hover:scale-105"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-fuchsia-400 hover:bg-fuchsia-900 hover:text-fuchsia-200 transition-all border border-fuchsia-500/30 hover:border-fuchsia-400 shadow-[0_0_10px_transparent] hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {isPlaying && (
        <div className="flex justify-center gap-1 h-8 items-center mt-2">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-fuchsia-500 rounded-t-sm shadow-[0_0_8px_rgba(217,70,239,0.8)]"
              animate={{ height: [4, Math.random() * 24 + 8, 4] }}
              transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
