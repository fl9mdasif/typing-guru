import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
}

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  progress: number;
}

export const useTimer = ({
  initialTime,
  onTimeUp,
}: UseTimerProps): UseTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onTimeUp]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      pausedTimeRef.current = Date.now();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      pausedTimeRef.current = null;

      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isPaused, onTimeUp]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(initialTime);
    pausedTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [initialTime]);

  const progress = ((initialTime - timeRemaining) / initialTime) * 100;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    progress,
  };
};
