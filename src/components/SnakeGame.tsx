import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keys if focusing on an input or button outside the game
      if (document.activeElement?.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) {
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling when using arrows
      }

      if (!isPlaying && !isGameOver && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setIsPlaying(true);
        return;
      }

      if (isGameOver && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        resetGame();
        return;
      }

      if (!isPlaying) return;

      const currentDir = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const gameLoop = setInterval(moveSnake, speed);

    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, food, score, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full justify-between items-center text-cyan-400 font-mono text-xl px-4 py-3 bg-slate-900 border border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="opacity-80">SCORE:</span>
          <span className="font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{score}</span>
        </div>
        <div className="flex items-center gap-2 text-fuchsia-400">
          <Trophy size={20} />
          <span className="opacity-80">HI:</span>
          <span className="font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-slate-950/80 border-2 border-cyan-400 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.4)]"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
        }}
      >
        {/* Grid Background Lines (Optional, adds to neon vibe) */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
               backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
             }}
        />

        {/* Food */}
        <motion.div
          className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.9)]"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute rounded-sm ${
                isHead 
                  ? 'bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,1)] z-10' 
                  : 'bg-cyan-500/80 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
              }`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
                transform: 'scale(0.9)',
                transition: 'left 0.1s linear, top 0.1s linear' // smooth movement
              }}
            >
              {isHead && (
                <div className="w-full h-full relative">
                  <div className="absolute w-1.5 h-1.5 bg-slate-900 rounded-full top-1 left-1/2 -translate-x-1/2" />
                </div>
              )}
            </div>
          );
        })}

        {/* Overlay for start/game over */}
        <AnimatePresence>
          {(!isPlaying || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] mb-2">GAME OVER</h2>
                  <p className="text-cyan-300 font-mono mb-8">FINAL SCORE: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 mx-auto bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-full font-bold transition-all border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-105"
                  >
                    <RefreshCw size={20} />
                    PLAY AGAIN
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-4 rounded-full font-bold text-xl transition-all border border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.7)] hover:scale-105"
                >
                  <Play size={24} fill="currentColor" />
                  START GAME
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-cyan-500/70 text-sm font-mono flex items-center gap-4">
        <span>Use <strong className="text-cyan-400">W A S D</strong> or <strong className="text-cyan-400">ARROWS</strong></span>
      </div>
    </div>
  );
}
