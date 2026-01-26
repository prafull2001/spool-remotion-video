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
npx remotion render src/index.js MyVideo out/spool-hype-reel.mp4 --overwrite
```

The exported video will be saved to the `out/` folder.

---

## Video Overview

The video showcases real user excuses for unlocking their phones, followed by app statistics and a download CTA.

### Flow

1. **Intro** (~3s): Waving Spooli mascot + "Real excuses people tell to unlock their phones"
2. **Excuse Ticker** (~7s): 16 excuse cards with usernames, accelerating from slow to fast
3. **Final Excuse Brake** (~1.2s): Last excuse holds and zooms out
4. **Stat Slides** (~8s):
   - "3,312 EXCUSES RECORDED" with count-up animation
   - "9.1 DAYS GIVEN BACK TO OUR USERS"
   - Peak Excuse Time bar chart (35% Late Night)
5. **CTA** (~3s): "Spool - Unwind wisely" + App Store badge

---

## Project Structure

```
src/
├── index.js              # Entry point
├── Root.jsx              # Composition config (duration, fps, resolution)
├── CleanHypeReel.jsx     # Main video composition
├── CleanComponents.jsx   # UI components (cards, stats, mascot)
├── cleanAnimations.jsx   # Animation utilities (springs, timing)
└── fonts.jsx             # Font loading (Quicksand)

public/
├── spooli_wave.png       # Mascot - waving (intro)
├── spooli_jumping.png    # Mascot - jumping (stats & CTA)
├── spooli_shock.png      # Mascot - shocked expression
└── smirk.png             # Mascot - smirking expression
```

---

## Video Specs

- **Resolution:** 1080x1920 (9:16 vertical, optimized for TikTok/Reels)
- **Duration:** 30 seconds (900 frames)
- **FPS:** 30

---

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Cream | `#FDF6EE` | Background |
| Burnt Orange | `#E85D04` | Accent, borders, stats |
| Charcoal | `#2D2D2D` | Primary text |
| White | `#FFFFFF` | Card backgrounds |

### Typography

- **Font:** Quicksand (Google Fonts)
- **Weights:** 500 (body), 600 (labels), 700 (headings), 800 (stats)

### Animation

- **Spring Config:** `stiffness: 250, damping: 20`
- **Excuse Pacing:** S-curve with exponential acceleration
- **Card Transitions:** Fly-through with velocity-based motion blur

---

## Customization

### Change Excuses

Edit the `EXCUSES` array in `src/CleanHypeReel.jsx`:

```jsx
const EXCUSES = [
  { username: "Name", text: "Your excuse text here" },
  { username: "Other", text: "Another excuse" },
  // ...
];
```

### Change Stats

Edit the stat slide components in `src/CleanComponents.jsx`:
- `ExcusesStatSlide` - Total excuses count
- `TimeSavedStatSlide` - Days saved
- `PeakExcuseTimeSlide` - Time-of-day bar chart

### Change CTA

Edit the `DownloadScene` in `src/CleanHypeReel.jsx`:

```jsx
<DownloadCard
  startFrame={DOWNLOAD_START}
  appName="Spool"
  tagline="Unwind wisely 🧵"
  socialProof="Join over 500+ users."
/>
```

### Swap Mascot Images

Replace the PNG files in the `public/` folder with your own images, keeping the same filenames.

---

## Design Brief

For the full design specification used to create this video, see [DESIGN_BRIEF.md](./DESIGN_BRIEF.md).

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

**Cards overlapping during acceleration?**
- Check `flyThroughClean` in `cleanAnimations.jsx` - exit opacity should drop quickly for high-velocity cards

---

Built with Remotion + React
