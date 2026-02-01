import { useState, useCallback, useRef, useEffect } from 'react';
import type { TypingStats, GameState, Level } from '@/types';

interface UseTypingTestProps {
  level: Level;
  timeLimit: number;
  onComplete?: (stats: TypingStats) => void;
}

interface UseTypingTestReturn {
  targetText: string;
  userInput: string;
  currentIndex: number;
  stats: TypingStats;
  gameState: GameState;
  startTest: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  resetTest: () => void;
  handleKeyPress: (key: string) => void;
  timeRemaining: number;
  mistakeIndices: Set<number>;
  currentStreak: number;
}

export const useTypingTest = ({
  level,
  timeLimit,
  onComplete,
}: UseTypingTestProps): UseTypingTestReturn => {
  // Select random exercise from level
  const [targetText] = useState(() => {
    const randomIndex = Math.floor(Math.random() * level.exercises.length);
    return level.exercises[randomIndex];
  });

  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [mistakeIndices, setMistakeIndices] = useState<Set<number>>(new Set());
  const [currentStreak, setCurrentStreak] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errors: 0,
    timeElapsed: 0,
    streak: 0,
    maxStreak: 0,
  });

  const calculateStats = useCallback((): TypingStats => {
    if (!startTimeRef.current) return stats;

    const now = Date.now();
    const elapsedMinutes =
      (now - startTimeRef.current - totalPausedTimeRef.current) / 60000;

    // Standard WPM calculation: (characters / 5) / minutes
    const wpm =
      elapsedMinutes > 0
        ? Math.round((userInput.length / 5) / elapsedMinutes)
        : 0;

    const accuracy =
      stats.totalKeystrokes > 0
        ? Math.round((stats.correctKeystrokes / stats.totalKeystrokes) * 100)
        : 100;

    return {
      wpm,
      accuracy,
      totalKeystrokes: stats.totalKeystrokes,
      correctKeystrokes: stats.correctKeystrokes,
      errors: stats.errors,
      timeElapsed: Math.floor(
        (now - startTimeRef.current - totalPausedTimeRef.current) / 1000
      ),
      streak: currentStreak,
      maxStreak: stats.maxStreak,
    };
  }, [userInput, stats, currentStreak]);

  const startTest = useCallback(() => {
    setGameState('playing');
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setGameState('finished');
          const finalStats = calculateStats();
          setStats(finalStats);
          onComplete?.(finalStats);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [calculateStats, onComplete]);

  const pauseTest = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      pauseTimeRef.current = Date.now();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [gameState]);

  const resumeTest = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
      if (pauseTimeRef.current) {
        totalPausedTimeRef.current += Date.now() - pauseTimeRef.current;
        pauseTimeRef.current = null;
      }

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setGameState('finished');
            const finalStats = calculateStats();
            setStats(finalStats);
            onComplete?.(finalStats);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [gameState, calculateStats, onComplete]);

  const resetTest = useCallback(() => {
    setGameState('menu');
    setUserInput('');
    setCurrentIndex(0);
    setTimeRemaining(timeLimit);
    setMistakeIndices(new Set());
    setCurrentStreak(0);
    setStats({
      wpm: 0,
      accuracy: 0,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      errors: 0,
      timeElapsed: 0,
      streak: 0,
      maxStreak: 0,
    });
    startTimeRef.current = null;
    pauseTimeRef.current = null;
    totalPausedTimeRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [timeLimit]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== 'playing') return;

      const expectedChar = targetText[currentIndex];
      const isCorrect = key === expectedChar;

      setStats((prev) => {
        const newMaxStreak = isCorrect
          ? Math.max(prev.maxStreak, currentStreak + 1)
          : prev.maxStreak;

        return {
          ...prev,
          totalKeystrokes: prev.totalKeystrokes + 1,
          correctKeystrokes: isCorrect
            ? prev.correctKeystrokes + 1
            : prev.correctKeystrokes,
          errors: isCorrect ? prev.errors : prev.errors + 1,
          maxStreak: newMaxStreak,
        };
      });

      if (isCorrect) {
        setUserInput((prev) => prev + key);
        setCurrentIndex((prev) => prev + 1);
        setCurrentStreak((prev) => prev + 1);

        // Check if completed
        if (currentIndex + 1 >= targetText.length) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setGameState('finished');
          const finalStats = calculateStats();
          setStats(() => ({ ...finalStats, streak: currentStreak + 1 }));
          onComplete?.(finalStats);
        }
      } else {
        setMistakeIndices((prev) => new Set(prev).add(currentIndex));
        setCurrentStreak(0);
      }
    },
    [gameState, targetText, currentIndex, calculateStats, onComplete, currentStreak]
  );

  // Update stats periodically during typing
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setStats(calculateStats());
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameState, calculateStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    targetText,
    userInput,
    currentIndex,
    stats,
    gameState,
    startTest,
    pauseTest,
    resumeTest,
    resetTest,
    handleKeyPress,
    timeRemaining,
    mistakeIndices,
    currentStreak,
  };
};
