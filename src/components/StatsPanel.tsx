import React from 'react';
import { cn } from '@/lib/utils';
import type { TypingStats } from '@/types';
import { Zap, Target, Keyboard, Flame, Clock, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  stats: TypingStats;
  timeElapsed: number;
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
  timeElapsed,
  className,
}) => {
  const mins = Math.floor(timeElapsed / 60);
  const secs = timeElapsed % 60;

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>

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
            Elapsed: <span className="text-blue-400 font-medium">{mins}:{secs.toString().padStart(2, '0')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
