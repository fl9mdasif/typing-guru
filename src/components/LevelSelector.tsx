import React from 'react';
import { cn } from '@/lib/utils';
import type { Level, LevelProgress } from '@/types';
import { Lock, Star, CheckCircle, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LevelSelectorProps {
  levels: Level[];
  progress: LevelProgress[];
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
}

const difficultyColors: Record<string, { bg: string; border: string; text: string }> = {
  beginner: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  easy: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  hard: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  expert: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
};

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  progress,
  currentLevelId,
  onSelectLevel,
}) => {
  const getLevelProgress = (levelId: number): LevelProgress | undefined => {
    return progress.find((p) => p.levelId === levelId);
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= count
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-slate-600'
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Select Level</h2>
      <p className="text-slate-400 mb-6">
        Complete levels to unlock new challenges. Earn stars based on your performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map((level, index) => {
          const levelProgress = getLevelProgress(level.id);
          const isUnlocked = levelProgress?.unlocked ?? false;
          const isCompleted = levelProgress?.completed ?? false;
          const isSelected = currentLevelId === level.id;
          const difficultyStyle = difficultyColors[level.difficulty];

          return (
            <div
              key={level.id}
              onClick={() => isUnlocked && onSelectLevel(level.id)}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300',
                isUnlocked
                  ? 'cursor-pointer hover:scale-[1.02]'
                  : 'cursor-not-allowed opacity-60',
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : isUnlocked
                  ? cn('border-slate-700 bg-slate-900/50 hover:border-slate-600')
                  : 'border-slate-800 bg-slate-900/30',
                isCompleted && 'border-green-500/30'
              )}
            >
              {/* Level number badge */}
              <div
                className={cn(
                  'absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isUnlocked
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isUnlocked ? (
                  level.id
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="ml-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-white">{level.name}</h3>
                    <p className="text-sm text-slate-400">{level.description}</p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-medium uppercase',
                      difficultyStyle.bg,
                      difficultyStyle.text
                    )}
                  >
                    {level.difficulty}
                  </span>
                </div>

                {/* Requirements */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span>Requires: {level.unlockRequirement.wpm} WPM</span>
                  <span>{level.unlockRequirement.accuracy}% Accuracy</span>
                </div>

                {/* Progress */}
                {levelProgress && levelProgress.bestWpm > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Best: {levelProgress.bestWpm} WPM</span>
                      <span className="text-slate-400">
                        {levelProgress.bestAccuracy}% accuracy
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        (levelProgress.bestWpm / (level.unlockRequirement.wpm + 20)) * 100,
                        100
                      )}
                      className="h-1.5"
                    />
                  </div>
                )}

                {/* Stars and arrow */}
                <div className="flex justify-between items-center">
                  {renderStars(levelProgress?.stars ?? 0)}
                  {isSelected && (
                    <ChevronRight className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </div>

              {/* Connection line to next level */}
              {index < levels.length - 1 && index % 2 === 0 && (
                <div className="hidden md:block absolute -right-2 top-1/2 w-4 h-0.5 bg-slate-700" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span>Stars earned</span>
        </div>
      </div>
    </div>
  );
};
