import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div 
        className="relative bg-slate-900 border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-lg overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`rounded-sm ${i === 0 ? 'bg-[#00aaff] shadow-[0_0_15px_#00aaff]' : 'bg-[#0066cc]'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10"
            >
              <h2 className="text-4xl font-bold text-pink-500 mb-4 tracking-tighter italic">GAME OVER</h2>
              <p className="text-cyan-400 mb-6 font-mono">FINAL SCORE: {score}</p>
              <button 
                onClick={resetGame}
                className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_15px_#06b6d4]"
              >
                RESTART
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10"
            >
              <h2 className="text-5xl font-black text-cyan-400 mb-8 tracking-tighter italic uppercase">PAUSED</h2>
              <button 
                onClick={() => setIsPaused(false)}
                className="px-10 py-3 bg-pink-500 text-white font-black rounded-full hover:bg-pink-400 transition-all shadow-[0_0_30px_#ec4899] uppercase tracking-widest active:scale-95"
              >
                RESUME
              </button>
              <p className="mt-8 text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em]">Press Space to toggle</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex gap-8 text-xs font-mono text-slate-400 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-sm shadow-[0_0_5px_#06b6d4]"></div>
          <span>Snake</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_5px_#ec4899]"></div>
          <span>Food</span>
        </div>
      </div>
    </div>
  );
}
