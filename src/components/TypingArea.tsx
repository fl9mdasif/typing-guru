import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { GameState } from '@/types';

interface TypingAreaProps {
  targetText: string;
  userInput: string;
  currentIndex: number;
  gameState: GameState;
  mistakeIndices: Set<number>;
  currentStreak: number;
  onKeyPress: (key: string) => void;
  exerciseJustCompleted?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  currentIndex,
  gameState,
  mistakeIndices,
  currentStreak,
  onKeyPress,
  exerciseJustCompleted = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (gameState !== 'playing') return;

      // Prevent default for special keys
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        return;
      }

      // Only handle single character keys
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        onKeyPress(e.key);
      }
    },
    [gameState, onKeyPress]
  );

  // Handle click to focus
  const handleClick = useCallback(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Render the text with proper styling
  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let charClass =
        'transition-all duration-100 inline-block min-w-[0.6em]';

      if (index < currentIndex) {
        // Already typed
        if (mistakeIndices.has(index)) {
          charClass = cn(
            charClass,
            'text-red-500 bg-red-500/10 rounded'
          );
        } else {
          charClass = cn(
            charClass,
            'text-green-500'
          );
        }
      } else if (index === currentIndex) {
        // Current character - cursor position
        charClass = cn(
          charClass,
          'text-yellow-400 bg-yellow-400/20 rounded animate-pulse border-b-2 border-yellow-400'
        );
      } else {
        // Not yet typed
        charClass = cn(
          charClass,
          'text-slate-500'
        );
      }

      return (
        <span key={index} className={charClass}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full max-w-4xl mx-auto p-8 rounded-2xl border-2 transition-all duration-300',
        gameState === 'playing'
          ? 'border-blue-500/50 bg-slate-900/50 shadow-lg shadow-blue-500/10'
          : 'border-slate-700 bg-slate-900/30',
        'cursor-text'
      )}
      onClick={handleClick}
    >
      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Streak indicator */}
      {currentStreak > 10 && gameState === 'playing' && !exerciseJustCompleted && (
        <div className="absolute -top-4 right-4 px-3 py-1 bg-orange-500 rounded-full text-white text-sm font-bold animate-bounce">
          🔥 {currentStreak} streak!
        </div>
      )}

      {/* Exercise complete flash */}
      {exerciseJustCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl z-10 animate-pulse">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">✓</span>
            <span className="text-xl font-bold text-green-400 tracking-wide">Exercise Complete!</span>
          </div>
        </div>
      )}

      {/* Main text display */}
      <div
        className={cn(
          'text-2xl md:text-3xl font-mono leading-relaxed tracking-wide',
          'select-none pointer-events-none'
        )}
      >
        {renderText()}
      </div>

      {/* Focus hint */}
      {gameState === 'playing' && (
        <div className="absolute bottom-2 right-4 text-xs text-slate-500">
          Click to focus
        </div>
      )}

      {/* Start hint */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-2xl">
          <div className="text-center">
            <p className="text-xl text-slate-300 mb-2">Click Start to begin</p>
            <p className="text-sm text-slate-500">
              Type the text shown above as fast and accurately as you can
            </p>
          </div>
        </div>
      )}

      {/* Paused overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl text-yellow-400 mb-2">⏸️ Paused</p>
            <p className="text-sm text-slate-400">Click Resume to continue</p>
          </div>
        </div>
      )}
    </div>
  );
};
