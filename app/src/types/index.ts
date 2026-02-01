export interface Level {
  id: number;
  name: string;
  description: string;
  exercises: string[];
  unlockRequirement: {
    wpm: number;
    accuracy: number;
  };
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errors: number;
  timeElapsed: number;
  streak: number;
  maxStreak: number;
}

export interface LevelProgress {
  levelId: number;
  bestWpm: number;
  bestAccuracy: number;
  stars: number;
  completed: boolean;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'finished';

export interface KeyState {
  key: string;
  isPressed: boolean;
  isCorrect?: boolean;
}
