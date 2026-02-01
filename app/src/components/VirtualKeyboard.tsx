import React from 'react';
import { cn } from '@/lib/utils';

interface VirtualKeyboardProps {
  currentKey?: string;
  nextKey?: string;
  levelId?: number;
}

interface KeyData {
  key: string;
  finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
  hand: 'left' | 'right';
  homeRow?: boolean;
}

const keyboardLayout: KeyData[][] = [
  [
    { key: '`', finger: 'pinky', hand: 'left' },
    { key: '1', finger: 'pinky', hand: 'left' },
    { key: '2', finger: 'ring', hand: 'left' },
    { key: '3', finger: 'middle', hand: 'left' },
    { key: '4', finger: 'index', hand: 'left' },
    { key: '5', finger: 'index', hand: 'left' },
    { key: '6', finger: 'index', hand: 'right' },
    { key: '7', finger: 'index', hand: 'right' },
    { key: '8', finger: 'middle', hand: 'right' },
    { key: '9', finger: 'ring', hand: 'right' },
    { key: '0', finger: 'pinky', hand: 'right' },
    { key: '-', finger: 'pinky', hand: 'right' },
    { key: '=', finger: 'pinky', hand: 'right' },
    { key: 'Backspace', finger: 'pinky', hand: 'right' },
  ],
  [
    { key: 'Tab', finger: 'pinky', hand: 'left' },
    { key: 'q', finger: 'pinky', hand: 'left' },
    { key: 'w', finger: 'ring', hand: 'left' },
    { key: 'e', finger: 'middle', hand: 'left' },
    { key: 'r', finger: 'index', hand: 'left' },
    { key: 't', finger: 'index', hand: 'left' },
    { key: 'y', finger: 'index', hand: 'right' },
    { key: 'u', finger: 'index', hand: 'right' },
    { key: 'i', finger: 'middle', hand: 'right' },
    { key: 'o', finger: 'ring', hand: 'right' },
    { key: 'p', finger: 'pinky', hand: 'right' },
    { key: '[', finger: 'pinky', hand: 'right' },
    { key: ']', finger: 'pinky', hand: 'right' },
    { key: '\\', finger: 'pinky', hand: 'right' },
  ],
  [
    { key: 'Caps', finger: 'pinky', hand: 'left' },
    { key: 'a', finger: 'pinky', hand: 'left', homeRow: true },
    { key: 's', finger: 'ring', hand: 'left', homeRow: true },
    { key: 'd', finger: 'middle', hand: 'left', homeRow: true },
    { key: 'f', finger: 'index', hand: 'left', homeRow: true },
    { key: 'g', finger: 'index', hand: 'left' },
    { key: 'h', finger: 'index', hand: 'right' },
    { key: 'j', finger: 'index', hand: 'right', homeRow: true },
    { key: 'k', finger: 'middle', hand: 'right', homeRow: true },
    { key: 'l', finger: 'ring', hand: 'right', homeRow: true },
    { key: ';', finger: 'pinky', hand: 'right', homeRow: true },
    { key: "'", finger: 'pinky', hand: 'right' },
    { key: 'Enter', finger: 'pinky', hand: 'right' },
  ],
  [
    { key: 'Shift', finger: 'pinky', hand: 'left' },
    { key: 'z', finger: 'pinky', hand: 'left' },
    { key: 'x', finger: 'ring', hand: 'left' },
    { key: 'c', finger: 'middle', hand: 'left' },
    { key: 'v', finger: 'index', hand: 'left' },
    { key: 'b', finger: 'index', hand: 'left' },
    { key: 'n', finger: 'index', hand: 'right' },
    { key: 'm', finger: 'index', hand: 'right' },
    { key: ',', finger: 'middle', hand: 'right' },
    { key: '.', finger: 'ring', hand: 'right' },
    { key: '/', finger: 'pinky', hand: 'right' },
    { key: 'Shift', finger: 'pinky', hand: 'right' },
  ],
  [
    { key: 'Ctrl', finger: 'pinky', hand: 'left' },
    { key: 'Win', finger: 'thumb', hand: 'left' },
    { key: 'Alt', finger: 'thumb', hand: 'left' },
    { key: ' ', finger: 'thumb', hand: 'left' },
    { key: 'Alt', finger: 'thumb', hand: 'right' },
    { key: 'Win', finger: 'thumb', hand: 'right' },
    { key: 'Menu', finger: 'pinky', hand: 'right' },
    { key: 'Ctrl', finger: 'pinky', hand: 'right' },
  ],
];

const fingerColors: Record<string, string> = {
  pinky: 'bg-purple-500',
  ring: 'bg-blue-500',
  middle: 'bg-green-500',
  index: 'bg-yellow-500',
  thumb: 'bg-orange-500',
};

const fingerGlowColors: Record<string, string> = {
  pinky: 'shadow-purple-500/50',
  ring: 'shadow-blue-500/50',
  middle: 'shadow-green-500/50',
  index: 'shadow-yellow-500/50',
  thumb: 'shadow-orange-500/50',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentKey,
  nextKey,
  levelId = 1,
}) => {
  const normalizeKey = (key: string): string => {
    return key.toLowerCase();
  };

  const isKeyActive = (keyData: KeyData): boolean => {
    const normalizedNext = nextKey ? normalizeKey(nextKey) : '';
    const normalizedCurrent = currentKey ? normalizeKey(currentKey) : '';
    const normalizedKey = normalizeKey(keyData.key);

    // For levels 1-2, highlight F and J (home row anchors)
    if (levelId <= 2) {
      return normalizedKey === 'f' || normalizedKey === 'j';
    }

    // For levels 3-5, highlight home row keys
    if (levelId <= 5 && keyData.homeRow) {
      return true;
    }

    // Highlight the next key to press
    if (normalizedNext && normalizedKey === normalizedNext) {
      return true;
    }

    // Highlight currently pressed key
    if (normalizedCurrent && normalizedKey === normalizedCurrent) {
      return true;
    }

    return false;
  };

  const getKeyClass = (keyData: KeyData): string => {
    const isActive = isKeyActive(keyData);
    const isHomeRow = keyData.homeRow;

    let baseClass =
      'relative flex items-center justify-center rounded-lg font-mono text-sm font-medium transition-all duration-150';

    // Size classes
    if (keyData.key === ' ') {
      baseClass = cn(baseClass, 'w-48 h-12');
    } else if (['Backspace', 'Tab', 'Caps', 'Enter', 'Shift'].includes(keyData.key)) {
      baseClass = cn(baseClass, 'w-20 h-12');
    } else if (['Ctrl', 'Alt', 'Win', 'Menu'].includes(keyData.key)) {
      baseClass = cn(baseClass, 'w-16 h-12');
    } else {
      baseClass = cn(baseClass, 'w-12 h-12');
    }

    // Color classes
    if (isActive) {
      const fingerColor = fingerColors[keyData.finger];
      const glowColor = fingerGlowColors[keyData.finger];
      baseClass = cn(
        baseClass,
        fingerColor,
        'text-white shadow-lg',
        glowColor,
        'scale-110 z-10'
      );
    } else if (isHomeRow) {
      baseClass = cn(
        baseClass,
        'bg-slate-700 text-slate-300 border-2 border-slate-600'
      );
    } else {
      baseClass = cn(
        baseClass,
        'bg-slate-800 text-slate-400 border border-slate-700'
      );
    }

    return baseClass;
  };

  // Finger guide labels
  const fingerGuideLabels = [
    { label: 'LP', color: 'text-purple-400', desc: 'Left Pinky' },
    { label: 'LR', color: 'text-blue-400', desc: 'Left Ring' },
    { label: 'LM', color: 'text-green-400', desc: 'Left Middle' },
    { label: 'LI', color: 'text-yellow-400', desc: 'Left Index' },
    { label: 'RI', color: 'text-yellow-400', desc: 'Right Index' },
    { label: 'RM', color: 'text-green-400', desc: 'Right Middle' },
    { label: 'RR', color: 'text-blue-400', desc: 'Right Ring' },
    { label: 'RP', color: 'text-purple-400', desc: 'Right Pinky' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Finger guide */}
      <div className="flex justify-center gap-2 mb-4 text-xs">
        {fingerGuideLabels.map((guide, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded bg-slate-800/50',
              guide.color
            )}
            title={guide.desc}
          >
            <span className="font-bold">{guide.label}</span>
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
        {keyboardLayout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              'flex gap-1.5',
              rowIndex === 1 && 'pl-6',
              rowIndex === 2 && 'pl-8',
              rowIndex === 3 && 'pl-12',
              rowIndex === 4 && 'justify-center'
            )}
          >
            {row.map((keyData, keyIndex) => (
              <div
                key={`${rowIndex}-${keyIndex}`}
                className={getKeyClass(keyData)}
              >
                {/* Home row indicator */}
                {keyData.homeRow && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-slate-500/50" />
                )}
                
                {/* Key label */}
                <span className={keyData.key.length > 1 ? 'text-xs' : ''}>
                  {keyData.key}
                </span>

                {/* Finger indicator for active keys */}
                {isKeyActive(keyData) && (
                  <div
                    className={cn(
                      'absolute -top-1 -right-1 w-3 h-3 rounded-full',
                      fingerColors[keyData.finger]
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-700 border border-slate-600" />
          <span>Home Row</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span>Next Key</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span>Bump Key</span>
        </div>
      </div>
    </div>
  );
};
