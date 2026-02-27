import React from 'react';
import { cn } from '@/lib/utils';
import type { TypingStats } from '@/types';
import { Zap, Target, Keyboard, Flame, Clock, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  stats: TypingStats;
  timeRemaining: number;
  totalTime: number;
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  glowColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  unit,
  color,
  glowColor,
}) => (
  <div
    className={cn(
      'relative flex flex-col items-center p-4 rounded-xl',
      'bg-slate-900/50 border border-slate-800',
      'transition-all duration-300 hover:scale-105'
    )}
  >
    <div
      className={cn(
        'absolute inset-0 rounded-xl opacity-20',
        glowColor
      )}
    />
    <div className={cn('mb-2', color)}>{icon}</div>
    <div className="text-2xl font-bold text-white">
      {value}
      {unit && <span className="text-sm ml-1 text-slate-400">{unit}</span>}
    </div>
    <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
  </div>
);

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  timeRemaining,
  totalTime,
  className,
}) => {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Timer bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Time Remaining</span>
          </div>
          <span
            className={cn(
              'text-2xl font-mono font-bold transition-colors',
              isLowTime ? 'text-red-500 animate-pulse' : 'text-white'
            )}
          >
            {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-1000 rounded-full',
              isLowTime
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            )}
            style={{ width: `${100 - progress}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          label="WPM"
          value={stats.wpm}
          color="text-yellow-400"
          glowColor="bg-yellow-500"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Accuracy"
          value={stats.accuracy}
          unit="%"
          color="text-green-400"
          glowColor="bg-green-500"
        />
        <StatCard
          icon={<Keyboard className="w-6 h-6" />}
          label="Keystrokes"
          value={stats.totalKeystrokes}
          color="text-blue-400"
          glowColor="bg-blue-500"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Best Streak"
          value={stats.maxStreak}
          color="text-orange-400"
          glowColor="bg-orange-500"
        />
      </div>

      {/* Additional stats row */}
      <div className="flex justify-center gap-8 mt-4 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>
            Errors: <span className="text-red-400 font-medium">{stats.errors}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span>
            Time: <span className="text-blue-400 font-medium">{stats.timeElapsed}s</span>
          </span>
        </div>
      </div>
    </div>
  );
};
