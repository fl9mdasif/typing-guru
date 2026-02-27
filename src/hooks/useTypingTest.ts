import { useState, useCallback, useRef, useEffect } from 'react';
import type { TypingStats, GameState, Level } from '@/types';

interface UseTypingTestProps {
  level: Level;
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
  timeElapsed: number;
  mistakeIndices: Set<number>;
  currentStreak: number;
  currentExerciseIndex: number;
  totalExercises: number;
  exerciseJustCompleted: boolean;
}

export const useTypingTest = ({
  level,
  onComplete,
}: UseTypingTestProps): UseTypingTestReturn => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [targetText, setTargetText] = useState<string>(level.exercises[0] || '');

  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mistakeIndices, setMistakeIndices] = useState<Set<number>>(new Set());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [exerciseJustCompleted, setExerciseJustCompleted] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Accumulated stats across all exercises in the level session
  const accumulatedRef = useRef({
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errors: 0,
    maxStreak: 0,
  });

  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errors: 0,
    timeElapsed: 0,
    streak: 0,
    maxStreak: 0,
  });

  const getElapsedSeconds = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    const now = Date.now();
    return Math.floor((now - startTimeRef.current - totalPausedTimeRef.current) / 1000);
  }, []);

  const buildStats = useCallback(
    (streak: number, elapsedSec?: number): TypingStats => {
      const acc = accumulatedRef.current;
      const secs = elapsedSec ?? getElapsedSeconds();
      const elapsedMinutes = secs / 60;
      const wpm =
        elapsedMinutes > 0
          ? Math.round((acc.correctKeystrokes / 5) / elapsedMinutes)
          : 0;
      const accuracy =
        acc.totalKeystrokes > 0
          ? Math.round((acc.correctKeystrokes / acc.totalKeystrokes) * 100)
          : 100;
      return {
        wpm,
        accuracy,
        totalKeystrokes: acc.totalKeystrokes,
        correctKeystrokes: acc.correctKeystrokes,
        errors: acc.errors,
        timeElapsed: secs,
        streak,
        maxStreak: acc.maxStreak,
      };
    },
    [getElapsedSeconds]
  );

  // Start the elapsed-time timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(getElapsedSeconds());
      setStats((prev) => buildStats(prev.streak));
    }, 500);
  }, [getElapsedSeconds, buildStats]);

  const startTest = useCallback(() => {
    setGameState('playing');
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    startTimer();
  }, [startTimer]);

  const pauseTest = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      pauseTimeRef.current = Date.now();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [gameState]);

  const resumeTest = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
      if (pauseTimeRef.current) {
        totalPausedTimeRef.current += Date.now() - pauseTimeRef.current;
        pauseTimeRef.current = null;
      }
      startTimer();
    }
  }, [gameState, startTimer]);

  const resetTest = useCallback(() => {
    setGameState('menu');
    setUserInput('');
    setCurrentIndex(0);
    setCurrentExerciseIndex(0);
    setTargetText(level.exercises[0] || '');
    setMistakeIndices(new Set());
    setCurrentStreak(0);
    setTimeElapsed(0);
    setExerciseJustCompleted(false);
    accumulatedRef.current = { totalKeystrokes: 0, correctKeystrokes: 0, errors: 0, maxStreak: 0 };
    setStats({
      wpm: 0,
      accuracy: 100,
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
    if (timerRef.current) clearInterval(timerRef.current);
  }, [level.exercises]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState !== 'playing') return;

      const expectedChar = targetText[currentIndex];
      const isCorrect = key === expectedChar;

      // Update accumulated stats
      accumulatedRef.current.totalKeystrokes += 1;
      if (isCorrect) {
        accumulatedRef.current.correctKeystrokes += 1;
      } else {
        accumulatedRef.current.errors += 1;
      }

      setCurrentStreak((prevStreak) => {
        const newStreak = isCorrect ? prevStreak + 1 : 0;
        accumulatedRef.current.maxStreak = Math.max(accumulatedRef.current.maxStreak, newStreak);
        return newStreak;
      });

      if (isCorrect) {
        const nextInputIndex = currentIndex + 1;
        setUserInput((prev) => prev + key);
        setCurrentIndex(nextInputIndex);

        // Check if this exercise is now complete
        if (nextInputIndex >= targetText.length) {
          // Brief flash of "exercise complete"
          setExerciseJustCompleted(true);
          setTimeout(() => setExerciseJustCompleted(false), 600);

          const nextExerciseIndex = currentExerciseIndex + 1;

          if (nextExerciseIndex < level.exercises.length) {
            // Advance to next exercise after a short delay (so user sees the flash)
            setTimeout(() => {
              setCurrentExerciseIndex(nextExerciseIndex);
              setTargetText(level.exercises[nextExerciseIndex]);
              setUserInput('');
              setCurrentIndex(0);
              setMistakeIndices(new Set());
            }, 600);
          } else {
            // All exercises done — level complete!
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('finished');
            const elapsed = getElapsedSeconds();
            setTimeElapsed(elapsed);
            // Use currentStreak + 1 because the state update is async
            setCurrentStreak((s) => {
              const finalStats = buildStats(s + 1, elapsed);
              setStats(finalStats);
              onComplete?.(finalStats);
              return s + 1;
            });
          }
        }
      } else {
        setMistakeIndices((prev) => new Set(prev).add(currentIndex));
      }
    },
    [
      gameState,
      targetText,
      currentIndex,
      currentExerciseIndex,
      level.exercises,
      buildStats,
      getElapsedSeconds,
      onComplete,
    ]
  );

  // Reset when level changes
  useEffect(() => {
    resetTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
    timeElapsed,
    mistakeIndices,
    currentStreak,
    currentExerciseIndex,
    totalExercises: level.exercises.length,
    exerciseJustCompleted,
  };
};
