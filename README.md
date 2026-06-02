# 🥀 Wack-A-Mole | Retro Neon Arcade

A beautiful, high-fidelity, and responsive browser-based Wack-A-Mole (Wake-A-Mole) arcade game. Featuring a stunning glassmorphic neon layout, dynamic micro-animations, customizable difficulties, and synthesized retro sound effects.

## 🚀 Live Demo & Launching
To play the game, simply open the `index.html` file in any modern web browser.

---

## 💎 Features
- **Aesthetic Cyberpunk Design**: Dark-themed UI with glassmorphic cards, vivid neon accents (cyan, pink, gold, green), and deep radial gradients.
- **Dynamic Micro-Animations**: Smooth spring-like pop animations for moles, realistic 3D circular holes with inset shadows, and satisfying visual whack feedback.
- **Interactive Audio**: Real-time synthesized arcade audio generated dynamically using the browser's native **Web Audio API** (includes standard Mute/Unmute toggle). No external assets or files required.
- **Difficulty Selector**: Switch between **Easy**, **Medium**, and **Hard** speeds to test your reaction time.
- **High-Score Persistence**: Saves your record local to your browser using `localStorage`, displaying it instantly next to your current score.
- **Countdown Timer**: 30-second countdown with an animated progress bar to raise the stakes.

---

## 🛠️ Tech Stack
- **HTML5**: Structured semantic layout.
- **CSS3 (Modern Vanilla)**: Flexbox, CSS Grid, keyframes, transitions, neon filter drops, and custom variable-based dark themes.
- **JavaScript (ES6+)**: Custom game state management, interval loop handling, dynamic style updates, and Web Audio API synth generator.

---

## 🎮 How to Play
1. Open `index.html`.
2. (Optional) Choose a difficulty: **Easy**, **Medium**, or **Hard** (Default is Medium).
3. Click the **Start Game** button. A synth countdown melody will trigger, and the timer bar will start.
4. Click on the emerging 🦔 (mole) as fast as you can.
   - Successful hits will play a high coin melody, increment your score, and reset the hole.
   - Misses (clicking empty holes) will play a low buzzer sound.
5. Try to beat the **High Score** before the 30-second timer runs out!
6. Click **Stop Game** at any time to pause or end the session.

---

## 📂 File Structure
```
Wake-a-mole/
├── index.html   # Main page layout and buttons
├── style.css    # Retro arcade neon themes, animations & layout styles
├── script.js    # Core game mechanics, timers, score logic & Audio Synthesizer
└── README.md    # Documentation
```
