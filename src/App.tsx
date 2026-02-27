import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { TypingStats, LevelProgress, Achievement } from '@/types';
import { levels, initialProgress, achievements as initialAchievements, calculateStars } from '@/data/levels';
import { useTypingTest } from '@/hooks/useTypingTest';
import { TypingArea } from '@/components/TypingArea';
import { VirtualKeyboard } from '@/components/VirtualKeyboard';
import { StatsPanel } from '@/components/StatsPanel';
import { LevelSelector } from '@/components/LevelSelector';
import { ResultsModal } from '@/components/ResultsModal';
import { Achievements } from '@/components/Achievements';
import { SpeedTest } from '@/components/SpeedTest';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Trophy, Keyboard, Gauge } from 'lucide-react';
import { Toaster, toast } from 'sonner';

function App() {
  // App view: 'game' | 'speedtest'
  const [activeView, setActiveView] = useState<'game' | 'speedtest'>('game');

  // Game state
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'finished'>('menu');
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Progress and achievements
  const [progress, setProgress] = useState<LevelProgress[]>(initialProgress);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  // Get current level
  const currentLevel = levels.find((l) => l.id === currentLevelId) || levels[0];

  // Check and unlock achievements
  const checkAchievements = useCallback((stats: TypingStats) => {
    setAchievements((prev) => {
      const newAchievements = [...prev];

      // First Steps
      if (!newAchievements.find((a) => a.id === 'first-steps')?.unlocked) {
        const achievement = newAchievements.find((a) => a.id === 'first-steps');
        if (achievement) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          toast.success('Achievement Unlocked: First Steps!');
        }
      }

      // Speed Demon (50 WPM)
      if (stats.wpm >= 50 && !newAchievements.find((a) => a.id === 'speed-demon')?.unlocked) {
        const achievement = newAchievements.find((a) => a.id === 'speed-demon');
        if (achievement) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          toast.success('Achievement Unlocked: Speed Demon!');
        }
      }

      // Keyboard King (80 WPM)
      if (stats.wpm >= 80 && !newAchievements.find((a) => a.id === 'keyboard-king')?.unlocked) {
        const achievement = newAchievements.find((a) => a.id === 'keyboard-king');
        if (achievement) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          toast.success('Achievement Unlocked: Keyboard King!');
        }
      }

      // Accuracy Master (100% accuracy)
      if (stats.accuracy === 100 && !newAchievements.find((a) => a.id === 'accuracy-master')?.unlocked) {
        const achievement = newAchievements.find((a) => a.id === 'accuracy-master');
        if (achievement) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          toast.success('Achievement Unlocked: Accuracy Master!');
        }
      }

      // Streak Master (50 key streak)
      if (stats.maxStreak >= 50 && !newAchievements.find((a) => a.id === 'streak-master')?.unlocked) {
        const achievement = newAchievements.find((a) => a.id === 'streak-master');
        if (achievement) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          toast.success('Achievement Unlocked: Streak Master!');
        }
      }

      // Home Row Hero (levels 1-13)
      const completedLevels = progress.filter((p) => p.completed).map((p) => p.levelId);
      if (
        Array.from({ length: 13 }, (_, i) => i + 1).every((id) => completedLevels.includes(id)) &&
        !newAchievements.find((a) => a.id === 'home-row-hero')?.unlocked
      ) {
        const achievement = newAchievements.find((a) => a.id === 'home-row-hero');
        if (achievement) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          toast.success('Achievement Unlocked: Home Row Hero!');
        }
      }

      return newAchievements;
    });
  }, [progress]);

  // Handle test completion
  const handleComplete = useCallback((stats: TypingStats) => {
    setShowResults(true);

    // Update progress
    setProgress((prev) => {
      const newProgress = [...prev];
      const levelProgress = newProgress.find((p) => p.levelId === currentLevelId);

      if (levelProgress) {
        // Update best stats
        levelProgress.bestWpm = Math.max(levelProgress.bestWpm, stats.wpm);
        levelProgress.bestAccuracy = Math.max(levelProgress.bestAccuracy, stats.accuracy);

        // Calculate stars
        const stars = calculateStars(stats.wpm, stats.accuracy, currentLevel);
        levelProgress.stars = Math.max(levelProgress.stars, stars);

        // Mark as completed if requirements met
        const isCompleted =
          stats.wpm >= currentLevel.unlockRequirement.wpm &&
          stats.accuracy >= currentLevel.unlockRequirement.accuracy;

        if (isCompleted && !levelProgress.completed) {
          levelProgress.completed = true;
          toast.success(`Level ${currentLevelId} completed!`);
        }

        // Unlock next level
        const nextLevel = newProgress.find((p) => p.levelId === currentLevelId + 1);
        if (nextLevel && isCompleted && !nextLevel.unlocked) {
          nextLevel.unlocked = true;
          toast.success(`Level ${currentLevelId + 1} unlocked!`);
        }
      }

      return newProgress;
    });

    // Check achievements
    checkAchievements(stats);
  }, [currentLevelId, currentLevel, checkAchievements]);

  // Typing test hook
  const {
    targetText,
    userInput,
    currentIndex,
    stats,
    startTest,
    pauseTest,
    resumeTest,
    resetTest,
    handleKeyPress,
    timeElapsed,
    mistakeIndices,
    currentStreak,
    currentExerciseIndex,
    totalExercises,
    exerciseJustCompleted,
  } = useTypingTest({
    level: currentLevel,
    onComplete: handleComplete,
  });

  // Control handlers
  const handleStart = () => {
    setGameState('playing');
    startTest();
  };

  const handlePause = () => {
    setGameState('paused');
    pauseTest();
  };

  const handleResume = () => {
    setGameState('playing');
    resumeTest();
  };

  const handleReset = () => {
    setGameState('menu');
    setShowResults(false);
    resetTest();
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setShowLevelSelector(false);
    handleReset();
  };

  const handleNextLevel = () => {
    const nextLevelId = currentLevelId + 1;
    if (nextLevelId <= levels.length) {
      setCurrentLevelId(nextLevelId);
      setShowResults(false);
      handleReset();
    }
  };

  const handleRetry = () => {
    setShowResults(false);
    handleReset();
  };

  // Get next key for keyboard highlighting
  const nextKey = targetText[currentIndex] || '';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Keyboard className="w-6 h-6 text-white" />
              </div>
              <a href="/">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  TypeMaster
                </h1>
                <p className="text-xs text-slate-400">Master the keyboard</p>
              </a>
            </div>

            <div className="flex items-center gap-3">

              <Button
                variant="outline"
                onClick={() => {
                  setActiveView('speedtest');
                  setShowLevelSelector(false);
                }}
                className={cn(
                  'border-slate-700 hover:bg-slate-800 bg-transparent',
                  activeView === 'speedtest' && 'bg-slate-800 border-blue-500 text-blue-400'
                )}
              >
                <Gauge className="w-4 h-4 mr-2 text-blue-400" />
                Test your TypingSpeed
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setActiveView('game');
                  setShowLevelSelector(!showLevelSelector);
                }}
                className={cn(
                  'border-slate-700 hover:bg-slate-800 bg-transparent',
                  showLevelSelector && activeView === 'game' && 'bg-slate-800 border-slate-600'
                )}
              >
                <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                Typing Game
              </Button>

              <Achievements achievements={achievements} />

            </div>
          </div>
        </div>
      </header>


      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeView === 'speedtest' ? (
          <SpeedTest />
        ) : showLevelSelector ? (
          <LevelSelector
            levels={levels}
            progress={progress}
            currentLevelId={currentLevelId}
            onSelectLevel={handleSelectLevel}
          />
        ) : (
          <div className="space-y-8">
            {/* Level info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {currentLevel.name}
              </h2>
              <p className="text-slate-400">{currentLevel.description}</p>
              <div className="flex justify-center gap-4 mt-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  Level {currentLevelId}/{levels.length}
                </span>
                <span className={cn(
                  'px-3 py-1 rounded-full capitalize',
                  currentLevel.difficulty === 'beginner' && 'bg-green-500/20 text-green-400',
                  currentLevel.difficulty === 'easy' && 'bg-blue-500/20 text-blue-400',
                  currentLevel.difficulty === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                  currentLevel.difficulty === 'hard' && 'bg-orange-500/20 text-orange-400',
                  currentLevel.difficulty === 'expert' && 'bg-red-500/20 text-red-400',
                )}>
                  {currentLevel.difficulty}
                </span>

                {/* Exercise progress — only visible during active session */}
                {gameState !== 'menu' && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                    Exercise {currentExerciseIndex + 1} / {totalExercises}
                  </span>
                )}
              </div>

              {/* Exercise progress bar */}
              {gameState !== 'menu' && (
                <div className="mt-4 max-w-md mx-auto">
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out rounded-full"
                      style={{
                        width: `${((currentExerciseIndex) / totalExercises) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stats panel */}
            <StatsPanel
              stats={stats}
              timeElapsed={timeElapsed}
            />

            {/* Typing area */}
            <TypingArea
              targetText={targetText}
              userInput={userInput}
              currentIndex={currentIndex}
              gameState={gameState}
              mistakeIndices={mistakeIndices}
              currentStreak={currentStreak}
              onKeyPress={handleKeyPress}
              exerciseJustCompleted={exerciseJustCompleted}
            />



            {/* Controls */}
            <div className="flex justify-center gap-4">
              {gameState === 'menu' && (
                <Button
                  onClick={handleStart}
                  className="bg-blue-500 hover:bg-blue-600 px-8"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}

              {gameState === 'playing' && (
                <Button
                  variant="outline"
                  onClick={handlePause}
                  className="border-slate-700 hover:bg-slate-800 bg-green-400"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}

              {gameState === 'paused' && (
                <Button
                  onClick={handleResume}
                  className="bg-blue-500 hover:bg-blue-600"
                >
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

            {/* Virtual keyboard */}
            <VirtualKeyboard
              currentKey={userInput.slice(-1)}
              nextKey={nextKey}
              levelId={currentLevelId}
            />

          </div>
        )}
      </main>

      {/* Results modal */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        stats={stats}
        level={currentLevel}
        onRetry={handleRetry}
        onNextLevel={handleNextLevel}
        hasNextLevel={currentLevelId < levels.length}
      />
    </div>
  );
}

export default App;
