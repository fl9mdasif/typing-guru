import React from 'react';
import { cn } from '@/lib/utils';
import type { TypingStats, Level } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, Target, Clock, Flame, Star, RotateCcw, ChevronRight, Trophy } from 'lucide-react';
import { calculateStars } from '@/data/levels';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TypingStats;
  level: Level;
  onRetry: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  highlight?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({
  icon,
  label,
  value,
  unit,
  color,
  highlight = false,
}) => (
  <div
    className={cn(
      'flex items-center justify-between p-3 rounded-lg',
      highlight ? 'bg-slate-800/80' : 'bg-slate-900/50'
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
        {icon}
      </div>
      <span className="text-slate-300">{label}</span>
    </div>
    <div className="text-right">
      <span className={cn('text-2xl font-bold', highlight ? 'text-white' : 'text-slate-200')}>
        {value}
        {unit && <span className="text-sm ml-1 text-slate-400">{unit}</span>}
      </span>
    </div>
  </div>
);

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  stats,
  level,
  onRetry,
  onNextLevel,
  hasNextLevel,
}) => {
  const stars = calculateStars(stats.wpm, stats.accuracy, level);
  // Check if player met requirements to complete this level (earn at least 1 star)
  const isLevelCompleted = stars >= 1;

  const getPerformanceMessage = () => {
    if (stars === 3) return { text: 'Perfect! Outstanding performance!', color: 'text-yellow-400' };
    if (stars === 2) return { text: 'Great job! Keep it up!', color: 'text-green-400' };
    if (stars === 1) return { text: 'Good effort! Practice makes perfect!', color: 'text-blue-400' };
    return { text: 'Keep practicing! You\'ll get there!', color: 'text-slate-400' };
  };

  const performance = getPerformanceMessage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Level Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-12 h-12 transition-all duration-500',
                  star <= stars
                    ? 'text-yellow-400 fill-yellow-400 scale-100'
                    : 'text-slate-700 scale-90'
                )}
                style={{
                  transitionDelay: `${star * 100}ms`,
                }}
              />
            ))}
          </div>
          <p className={cn('text-lg font-medium', performance.color)}>
            {performance.text}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-6">
          <StatRow
            icon={<Zap className="w-5 h-5 text-white" />}
            label="Words Per Minute"
            value={stats.wpm}
            color="bg-yellow-500"
            highlight
          />
          <StatRow
            icon={<Target className="w-5 h-5 text-white" />}
            label="Accuracy"
            value={stats.accuracy}
            unit="%"
            color="bg-green-500"
          />
          <StatRow
            icon={<Clock className="w-5 h-5 text-white" />}
            label="Time Elapsed"
            value={`${stats.timeElapsed}s`}
            color="bg-blue-500"
          />
          <StatRow
            icon={<Flame className="w-5 h-5 text-white" />}
            label="Best Streak"
            value={stats.maxStreak}
            color="bg-orange-500"
          />
        </div>

        {/* Unlock status */}
        {isLevelCompleted && hasNextLevel && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
            <Trophy className="w-8 h-8 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Next Level Unlocked!</p>
              <p className="text-sm text-slate-400">
                You&apos;ve unlocked the next challenge!
              </p>
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="text-xs text-slate-500 mb-6 text-center">
          Level Requirements: {level.unlockRequirement.wpm} WPM,{' '}
          {level.unlockRequirement.accuracy}% Accuracy
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex-1 border-slate-700 hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          {hasNextLevel && isLevelCompleted && (
            <Button
              onClick={onNextLevel}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Next Level
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
