# Spool Hype Reel Video

Animated promotional video for the Spool iOS app, built with [Remotion](https://remotion.dev).

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Preview the Video

```bash
npx remotion studio
```

Then open **http://localhost:3000** in your browser.

### 3. Export the Video

```bash
npx remotion render src/index.js MyVideo out/spool-hype-reel.mp4
```

The exported video will be saved to the `out/` folder.

---

## Project Structure

```
src/
├── index.js              # Entry point
├── Root.jsx              # Composition config (duration, fps, resolution)
├── CleanHypeReel.jsx     # Main video composition
├── CleanComponents.jsx   # UI components (cards, stats, mascot)
├── cleanAnimations.jsx   # Animation utilities (springs, timing)
└── fonts.jsx             # Font loading

public/
├── spooli_shock.png      # Mascot - shocked expression
├── smirk.png             # Mascot - smirking expression
└── spooli_jumping.png    # Mascot - jumping (used in outro)
```

---

## Video Specs

- **Resolution:** 1080x1920 (9:16 vertical, optimized for TikTok/Reels)
- **Duration:** 20 seconds (600 frames)
- **FPS:** 30

---

## Customization

### Change Excuses

Edit the `EXCUSES` array in `src/CleanHypeReel.jsx`:

```jsx
const EXCUSES = [
  "Your excuse text here",
  "Another excuse",
  // ...
];
```

### Change Stats

Edit the `stats` array in `src/CleanComponents.jsx` inside `VerticalStatsStack`:

```jsx
const stats = [
  { value: "3,313", label: "Excuses", color: COLORS.accentOrange, delay: 0 },
  { value: "9.1", label: "Days Saved", color: COLORS.accentBlue, delay: 10 },
  { value: "179", label: "Users", color: COLORS.accentBlue, delay: 20 },
];
```

### Change Colors

Edit `COLORS` in `src/CleanComponents.jsx`:

```jsx
const COLORS = {
  black: "#000000",
  accentBlue: "#8AC9E1",
  accentOrange: "#FE723F",
  white: "#FFFFFF",
  // ...
};
```

### Swap Mascot Images

Replace the PNG files in the `public/` folder with your own images, keeping the same filenames.

---

## Requirements

- Node.js 18+
- npm or yarn

---

## Troubleshooting

**Blank screen on localhost:3000?**
- Make sure you ran `npm install` first
- Check terminal for any error messages

**Video not exporting?**
- Ensure ffmpeg is available (Remotion bundles it, but check for errors)
- Try with `--overwrite` flag if file already exists

---

Built with Remotion + React
