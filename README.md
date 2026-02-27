# ⌨️ Typing Guru

A modern, progressive touch-typing trainer built with **React + TypeScript + Vite**. Learn proper touch-typing from scratch through structured lessons, or benchmark your speed with the built-in Speed Test.

![TypeMaster](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss)

---

## 📸 Preview

![Typing Guru Screenshot](https://i.ibb.co.com/svSbVFpC/home.png)

> **Tip:** Take a screenshot of the app and save it as `public/preview.png` to display it here.



## ✨ Features

### 🎮 Typing Game (Progressive Lessons)
- **27 structured levels** built on proper touch-typing methodology
- Each key is introduced **individually** before being combined with others
- Exercises use **pure key sequences** (no real words) for muscle memory training
- **Auto-advances** through all exercises in a level when each is typed correctly
- Live progress bar showing **Exercise X / N** within each level
- Levels unlock sequentially — complete one to unlock the next
- **Visual flash** animation on each exercise completion

### ⚡ Speed Test Mode
- **10 curated passages** across easy, medium, and hard difficulty
- Choose a time limit: **30s / 60s / 120s**
- Live WPM and accuracy tracking
- Results screen with a **skill rating** (Beginner → Expert Typist)
- Shuffle to a new passage at any time

### 📊 Live Statistics
- Words Per Minute (WPM)
- Accuracy %
- Total keystrokes
- Error count
- Best streak tracker
- Elapsed time

### 🏆 Achievements
- First Steps, Speed Demon, Accuracy Master, Streak Master, Home Row Hero, Top Row Titan, Keyboard King

### ⌨️ Virtual Keyboard
- On-screen keyboard highlights the **next key** to press
- Shows the key just typed for confirmation

---

## 🗂️ Level Structure

| Levels | Row | Keys Covered |
|--------|-----|-------------|
| 1 – 3 | Home Row | `j`, `f`, `j+f` |
| 4 – 6 | Home Row | `d`, `k`, `d+k` |
| 7 – 8 | Home Row | `s`, `l` |
| 9 – 10 | Home Row | `a`, `;` |
| 11 – 13 | Home Row | Full ASDF, Full JKL;, Both hands |
| 14 – 18 | Top Row | `t+y`, `r+u`, `e+i`, `w+o`, `q+p` |
| 19 | Top Row | Full QWERTY row |
| 20 – 22 | Bottom Row | `v+b`, `c+n`, `x+m` |
| 23 – 24 | Bottom Row | `z`, Full ZXCVBNM |
| 25 – 27 | Combined | Home+Top, Home+Bottom, All three rows |

> All exercises are **non-word key sequences** — designed for finger independence, not vocabulary.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/typing-guru.git
cd typing-guru

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [Lucide React](https://lucide.dev/) | Icons |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── TypingArea.tsx       # Text display with character highlighting
│   ├── VirtualKeyboard.tsx  # On-screen keyboard visualization
│   ├── StatsPanel.tsx       # Live stats (WPM, accuracy, streak, elapsed)
│   ├── SpeedTest.tsx        # Speed Test mode page
│   ├── LevelSelector.tsx    # Level picker grid
│   ├── ResultsModal.tsx     # End-of-level results screen
│   └── Achievements.tsx     # Achievement badges display
├── hooks/
│   ├── useTypingTest.ts     # Game mode logic (sequential exercises)
│   └── useSpeedTest.ts      # Speed test logic (time-based)
├── data/
│   ├── levels.ts            # All 27 level definitions + achievements
│   └── speedTestTexts.ts    # 10 typing passages for Speed Test
└── types/
    └── index.ts             # Shared TypeScript interfaces
```

---

## 🎯 How to Play

### Typing Game
1. Click **Typing Game** in the header
2. Select a level from the **Levels** panel (or start with Level 1)
3. Click **Start** and type each exercise shown on screen
4. Type correctly → auto-advances to the next exercise
5. Complete all exercises to finish the level and unlock the next
6. Reset anytime with the **Reset** button

### Speed Test
1. Click **Test your Typing Speed** in the header
2. Choose a time limit (30s / 60s / 120s)
3. Click **Start** and type the passage as fast as you can
4. Time expires → see your WPM, accuracy, and skill rating
5. Hit **New Text** for a different passage

---

## 📄 License

MIT © 2026 Typing Guru
