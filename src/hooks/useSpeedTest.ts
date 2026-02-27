import { useState, useCallback, useRef, useEffect } from 'react';
import type { TypingStats } from '@/types';
import { getRandomText } from '@/data/speedTestTexts';
import type { SpeedTestText } from '@/data/speedTestTexts';

interface UseSpeedTestProps {
    timeLimit: number;
    onComplete?: (stats: TypingStats) => void;
}

interface UseSpeedTestReturn {
    targetText: string;
    currentText: SpeedTestText;
    userInput: string;
    currentIndex: number;
    stats: TypingStats;
    gameState: 'menu' | 'playing' | 'paused' | 'finished';
    startTest: () => void;
    pauseTest: () => void;
    resumeTest: () => void;
    resetTest: () => void;
    newText: () => void;
    handleKeyPress: (key: string) => void;
    timeRemaining: number;
    mistakeIndices: Set<number>;
    currentStreak: number;
}

export const useSpeedTest = ({
    timeLimit,
    onComplete,
}: UseSpeedTestProps): UseSpeedTestReturn => {
    const [currentText, setCurrentText] = useState<SpeedTestText>(() => getRandomText());
    const [userInput, setUserInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'finished'>('menu');
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [mistakeIndices, setMistakeIndices] = useState<Set<number>>(new Set());
    const [currentStreak, setCurrentStreak] = useState(0);

    const startTimeRef = useRef<number | null>(null);
    const pauseTimeRef = useRef<number | null>(null);
    const totalPausedTimeRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    const calculateStats = useCallback(
        (streak: number): TypingStats => {
            if (!startTimeRef.current) return { ...stats, streak };
            const now = Date.now();
            const elapsedMs = now - startTimeRef.current - totalPausedTimeRef.current;
            const elapsedMinutes = elapsedMs / 60000;
            const wpm =
                elapsedMinutes > 0
                    ? Math.round((stats.correctKeystrokes / 5) / elapsedMinutes)
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
                timeElapsed: Math.floor(elapsedMs / 1000),
                streak,
                maxStreak: stats.maxStreak,
            };
        },
        [stats]
    );

    const finishTest = useCallback(
        (streak: number) => {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('finished');
            setStats((prev) => {
                if (!startTimeRef.current) return prev;
                const now = Date.now();
                const elapsedMs = now - startTimeRef.current - totalPausedTimeRef.current;
                const elapsedMinutes = elapsedMs / 60000;
                const wpm =
                    elapsedMinutes > 0
                        ? Math.round((prev.correctKeystrokes / 5) / elapsedMinutes)
                        : 0;
                const accuracy =
                    prev.totalKeystrokes > 0
                        ? Math.round((prev.correctKeystrokes / prev.totalKeystrokes) * 100)
                        : 100;
                const finalStats: TypingStats = {
                    wpm,
                    accuracy,
                    totalKeystrokes: prev.totalKeystrokes,
                    correctKeystrokes: prev.correctKeystrokes,
                    errors: prev.errors,
                    timeElapsed: Math.floor(elapsedMs / 1000),
                    streak,
                    maxStreak: prev.maxStreak,
                };
                onComplete?.(finalStats);
                return finalStats;
            });
        },
        [onComplete]
    );

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setCurrentStreak((s) => {
                        finishTest(s);
                        return s;
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [finishTest]);

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
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState('menu');
        setUserInput('');
        setCurrentIndex(0);
        setTimeRemaining(timeLimit);
        setMistakeIndices(new Set());
        setCurrentStreak(0);
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
    }, [timeLimit]);

    const newText = useCallback(() => {
        resetTest();
        setCurrentText(getRandomText());
    }, [resetTest]);

    const handleKeyPress = useCallback(
        (key: string) => {
            if (gameState !== 'playing') return;
            const targetText = currentText.text;
            const expectedChar = targetText[currentIndex];
            const isCorrect = key === expectedChar;

            setStats((prev) => {
                const newCorrect = isCorrect ? prev.correctKeystrokes + 1 : prev.correctKeystrokes;
                const newTotal = prev.totalKeystrokes + 1;
                const newErrors = isCorrect ? prev.errors : prev.errors + 1;
                const newMaxStreak = isCorrect
                    ? Math.max(prev.maxStreak, currentStreak + 1)
                    : prev.maxStreak;
                return {
                    ...prev,
                    totalKeystrokes: newTotal,
                    correctKeystrokes: newCorrect,
                    errors: newErrors,
                    maxStreak: newMaxStreak,
                };
            });

            if (isCorrect) {
                setUserInput((prev) => prev + key);
                setCurrentIndex((prev) => prev + 1);
                setCurrentStreak((prev) => prev + 1);

                // Completed the full text before time runs out
                if (currentIndex + 1 >= targetText.length) {
                    finishTest(currentStreak + 1);
                }
            } else {
                setMistakeIndices((prev) => new Set(prev).add(currentIndex));
                setCurrentStreak(0);
            }
        },
        [gameState, currentText.text, currentIndex, currentStreak, finishTest]
    );

    // Update live WPM periodically
    useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => {
                setStats((prev) => {
                    if (!startTimeRef.current) return prev;
                    const now = Date.now();
                    const elapsedMs = now - startTimeRef.current - totalPausedTimeRef.current;
                    const elapsedMinutes = elapsedMs / 60000;
                    const wpm =
                        elapsedMinutes > 0
                            ? Math.round((prev.correctKeystrokes / 5) / elapsedMinutes)
                            : 0;
                    const accuracy =
                        prev.totalKeystrokes > 0
                            ? Math.round((prev.correctKeystrokes / prev.totalKeystrokes) * 100)
                            : 100;
                    return { ...prev, wpm, accuracy, timeElapsed: Math.floor(elapsedMs / 1000) };
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [gameState]);

    useEffect(() => {
        setTimeRemaining(timeLimit);
    }, [timeLimit]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        targetText: currentText.text,
        currentText,
        userInput,
        currentIndex,
        stats,
        gameState,
        startTest,
        pauseTest,
        resumeTest,
        resetTest,
        newText,
        handleKeyPress,
        timeRemaining,
        mistakeIndices,
        currentStreak,
    };
};
