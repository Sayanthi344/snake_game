import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
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
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 120);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-[#050505] border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF] w-full max-w-2xl relative">
      <div className="flex justify-between w-full items-center px-2 border-b-2 border-[#FF00FF] pb-4">
        <div className="flex items-center gap-2 text-[#00FFFF]">
          <Terminal size={24} />
          <span className="font-mono text-2xl font-bold tracking-widest">DATA_YIELD: {score.toString().padStart(4, '0')}</span>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 border-2 border-[#00FFFF] bg-[#050505] hover:bg-[#00FFFF] hover:text-[#050505] text-[#00FFFF] transition-none"
        >
          {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
        </button>
      </div>

      <div 
        className="relative bg-[#050505] border-2 border-[#FF00FF] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute ${i === 0 ? 'bg-[#00FFFF] z-10' : 'bg-[#00FFFF]/70'}`}
            style={{
              width: '20px',
              height: '20px',
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
            }}
          >
            {i === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#050505]" />
              </div>
            )}
          </div>
        ))}

        {/* Food */}
        <div
          className="absolute bg-[#FF00FF] animate-pulse"
          style={{
            width: '20px',
            height: '20px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        >
          <div className="w-full h-full border-2 border-[#050505]" />
        </div>

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-[#050505]/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-[#FF00FF] text-5xl font-mono mb-6 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-[#00FFFF] font-sans text-xl mb-8">SEGM_FAULT // CORE_DUMPED</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 bg-[#FF00FF] text-[#050505] font-mono text-xl py-3 px-8 border-2 border-[#00FFFF] hover:bg-[#00FFFF] transition-none"
            >
              <RotateCcw size={24} />
              REBOOT_SYS
            </button>
          </div>
        )}

        {/* Start/Pause Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-[#050505]/80 flex flex-col items-center justify-center z-20">
            <button 
              onClick={() => setIsPaused(false)}
              className="bg-[#050505] border-4 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#050505] font-mono text-2xl py-4 px-10 transition-none shadow-[4px_4px_0px_#FF00FF]"
            >
              INIT_SEQUENCE
            </button>
          </div>
        )}
      </div>

      <div className="text-[#FF00FF] text-lg font-sans uppercase tracking-widest w-full text-center border-t-2 border-[#00FFFF] pt-4">
        STATUS: {isGameOver ? 'OFFLINE' : isPaused ? 'STANDBY' : 'EXECUTING'}
      </div>
    </div>
  );
}

