import React from 'react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative bg-transparent border-slate-700 hover:bg-slate-800 hover:border-slate-600"
        >
          <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
          Achievements
          <span className="ml-2 text-xs text-slate-400">
            {unlockedCount}/{totalCount}
          </span>
          {unlockedCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Achievements
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-medium">
              {unlockedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300',
                achievement.unlocked
                  ? 'bg-slate-800/50 border-yellow-500/30'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                  achievement.unlocked
                    ? 'bg-yellow-500/20'
                    : 'bg-slate-800'
                )}
              >
                {achievement.unlocked ? (
                  achievement.icon
                ) : (
                  <Lock className="w-5 h-5 text-slate-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4
                  className={cn(
                    'font-bold',
                    achievement.unlocked ? 'text-white' : 'text-slate-500'
                  )}
                >
                  {achievement.name}
                </h4>
                <p className="text-sm text-slate-400">{achievement.description}</p>
                {achievement.unlockedAt && (
                  <p className="text-xs text-yellow-500/70 mt-1">
                    Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Status indicator */}
              {achievement.unlocked && (
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
