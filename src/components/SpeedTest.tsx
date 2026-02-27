import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSpeedTest } from '@/hooks/useSpeedTest';
import { TypingArea } from '@/components/TypingArea';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';
import { StatsPanel } from '@/components/StatsPanel';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Play, Pause, RotateCcw, RefreshCw, Timer, CheckCircle2 } from 'lucide-react';
import type { TypingStats } from '@/types';

const TIME_LIMITS = [30, 60, 120];

interface SpeedTestResultsProps {
    stats: TypingStats;
    onRetry: () => void;
    onNewText: () => void;
}

const SpeedTestResults: React.FC<SpeedTestResultsProps> = ({ stats, onRetry, onNewText }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Speed Test Complete!</h2>
                <p className="text-slate-400 mt-1">Here are your results</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-400">{stats.wpm}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">WPM</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{stats.accuracy}%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Accuracy</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">{stats.totalKeystrokes}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Keystrokes</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Errors</div>
                </div>
            </div>

            {/* WPM rating */}
            <div className="mb-6 text-center">
                <span className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold',
                    stats.wpm < 30 && 'bg-red-500/20 text-red-400',
                    stats.wpm >= 30 && stats.wpm < 50 && 'bg-orange-500/20 text-orange-400',
                    stats.wpm >= 50 && stats.wpm < 70 && 'bg-yellow-500/20 text-yellow-400',
                    stats.wpm >= 70 && stats.wpm < 100 && 'bg-blue-500/20 text-blue-400',
                    stats.wpm >= 100 && 'bg-green-500/20 text-green-400',
                )}>
                    {stats.wpm < 30 && '🐢 Beginner'}
                    {stats.wpm >= 30 && stats.wpm < 50 && '🚶 Developing'}
                    {stats.wpm >= 50 && stats.wpm < 70 && '🚴 Intermediate'}
                    {stats.wpm >= 70 && stats.wpm < 100 && '🚗 Advanced'}
                    {stats.wpm >= 100 && '⚡ Expert Typist'}
                </span>
            </div>

            <div className="flex gap-3">
                <Button onClick={onRetry} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
                <Button
                    onClick={onNewText}
                    variant="outline"
                    className="flex-1 border-slate-600 hover:bg-slate-800 bg-transparent"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Text
                </Button>
            </div>
        </div>
    </div>
);

export const SpeedTest: React.FC = () => {
    const [timeLimit, setTimeLimit] = useState(60);
    const [showResults, setShowResults] = useState(false);
    const [finalStats, setFinalStats] = useState<TypingStats | null>(null);

    const handleComplete = (stats: TypingStats) => {
        setFinalStats(stats);
        setShowResults(true);
    };

    const {
        targetText,
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
    } = useSpeedTest({ timeLimit, onComplete: handleComplete });

    const handleReset = () => {
        setShowResults(false);
        setFinalStats(null);
        resetTest();
    };

    const handleNewText = () => {
        setShowResults(false);
        setFinalStats(null);
        newText();
    };

    const nextKey = targetText[currentIndex] || '';
    const isLowTime = timeRemaining <= 10;
    const timeProgress = (timeRemaining / timeLimit) * 100;

    return (
        <div className="space-y-8">
            {/* Title + text info */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">Speed Test</h2>
                <p className="text-slate-400">
                    Type as fast and accurately as you can before time runs out
                </p>
                <div className="flex justify-center gap-3 mt-3 text-sm flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                        📝 {currentText.title}
                    </span>
                    <span className={cn(
                        'px-3 py-1 rounded-full capitalize',
                        currentText.difficulty === 'easy' && 'bg-green-500/20 text-green-400',
                        currentText.difficulty === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                        currentText.difficulty === 'hard' && 'bg-red-500/20 text-red-400',
                    )}>
                        {currentText.difficulty}
                    </span>
                </div>

                {/* Countdown timer bar */}
                {gameState !== 'menu' && (
                    <div className="mt-4 max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Timer className="w-3 h-3" /> Time Remaining
                            </span>
                            <span className={cn(
                                'text-lg font-mono font-bold transition-colors',
                                isLowTime ? 'text-red-500 animate-pulse' : 'text-white'
                            )}>
                                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all duration-1000 rounded-full',
                                    isLowTime
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                )}
                                style={{ width: `${timeProgress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            <StatsPanel stats={stats} timeElapsed={stats.timeElapsed} />

            {/* Typing area */}
            <TypingArea
                targetText={targetText}
                userInput={userInput}
                currentIndex={currentIndex}
                gameState={gameState}
                mistakeIndices={mistakeIndices}
                currentStreak={currentStreak}
                onKeyPress={handleKeyPress}
            />

            {/* Virtual keyboard */}
            <VirtualKeyboard currentKey={userInput.slice(-1)} nextKey={nextKey} levelId={0} />

            {/* Controls */}
            <div className="flex justify-center gap-4 flex-wrap">
                {gameState === 'menu' && (
                    <>
                        <Select
                            value={timeLimit.toString()}
                            onValueChange={(v) => setTimeLimit(Number(v))}
                        >
                            <SelectTrigger className="w-32 border-slate-700 bg-slate-900">
                                <Timer className="w-4 h-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {TIME_LIMITS.map((t) => (
                                    <SelectItem key={t} value={t.toString()}>
                                        {t}s
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={startTest} className="bg-blue-500 hover:bg-blue-600 px-8">
                            <Play className="w-4 h-4 mr-2" />
                            Start
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleNewText}
                            className="border-slate-700 hover:bg-slate-800 bg-transparent"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            New Text
                        </Button>
                    </>
                )}

                {gameState === 'playing' && (
                    <Button
                        variant="outline"
                        onClick={pauseTest}
                        className="border-slate-700 hover:bg-slate-800 bg-green-500"
                    >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                    </Button>
                )}

                {gameState === 'paused' && (
                    <Button onClick={resumeTest} className="bg-blue-500 hover:bg-blue-600">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                    </Button>
                )}

                {(gameState === 'playing' || gameState === 'paused') && (
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="border-slate-700 bg-red-500 hover:bg-slate-800"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                )}
            </div>

            {/* Results modal */}
            {showResults && finalStats && (
                <SpeedTestResults
                    stats={finalStats}
                    onRetry={handleReset}
                    onNewText={handleNewText}
                />
            )}
        </div>
    );
};
