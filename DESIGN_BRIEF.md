# Spool Advertisement Design Brief v4

This document contains the full design specification used to create the Spool hype reel video.

---

## 0. Hook / Intro

**Format:** Spooli mascot waving, then "Real excuses people tell to unlock their phones" text, then excuse cards floating on clean cream background.

No iPhone mockup — cards should be full-width and prominent.

---

## 1. Curated Excuse Content

Each excuse card includes the user's first name for authenticity.

### Hook Excuses (0.9s each)
| # | Card Text |
|---|-----------|
| 1 | **Daneal:** "i need to stalk my ex's new girl!!!!!" |
| 2 | **Praf:** "Just peeing and scrolling while i'm peeing honestly" |
| 3 | **Daneal:** "Going onto X to feed my mind with slop" |

### Acceleration Phase Excuses
| # | Card Text |
|---|-----------|
| 4 | **Daneal:** "I am so bored during this work call I need to scroll" |
| 5 | **Vedika:** "i want to scroll before i go brush my teeth" |
| 6 | **Jainam:** "Please let me back in I wanna watch Italian brain rot memes" |
| 7 | **Daneal:** "OK OK OK OK hear me out I need to talk to my friend" |
| 8 | **Julia:** "I GOT INTO UT AUSTIN AND I WANNA BRAG" |
| 9 | **Praf:** "I was having an absolutely titillating jolly good time on Instagram" |
| 10 | **Daneal:** "i wanna see tiktok cuz i hate hate" |
| 11 | **Anonymous:** "Yo my algorithm is feeding me some good videos right now" |
| 12 | **Vedika:** "I'm bored and I don't feel like doing my work" |
| 13 | **Praf:** "Real quick just wanna doom scroll LinkedIn now" |
| 14 | **Daneal:** "I need to look at X because nothing ever happens" |
| 15 | **Jainam:** "Please please I just wanna play the game" |

### Hard Brake / Final Excuse (1.2s hold)
| # | Card Text |
|---|-----------|
| 16 | **Praf:** "It's been a long day and I just wanna look at some furry online" |

---

## 2. Visual Aesthetic: "Cream & Burnt Orange"

* **Theme:** Warm, Modern, Lifestyle-Tech.
* **Background Color:** Warm, off-white cream (`#FDF6EE`).
* **Primary Accent Color:** Burnt Orange (`#E85D04`) — used for:
   * Card borders (1px solid)
   * Text highlighting and emphasis
   * Glow/bloom effect around cards
   * Statistics numbers
   * Progress bars and chart fills
* **Card Styling:**
   * Opaque white cards (`#FFFFFF`)
   * 1px burnt orange border
   * Soft burnt orange drop-shadow
   * Small username label at top-left of card in burnt orange (e.g., "Daneal:")
* **Typography Color:**
   * Primary Text: Dark charcoal (`#2D2D2D`)
   * Accent Text & Stats: Burnt Orange (`#E85D04`)
   * Username labels: Burnt Orange, bold, smaller font size

---

## 3. Character & Mascot Integration

* **Intro:** `spooli_wave.png` on cream background with "Real excuses people tell" text.
* **Ticker Phase:** Clean cream background, excuse cards floating (no mascot).
* **Stats Phase:** `spooli_jumping.png` appears with each stat slide.
* **Outro CTA:** `spooli_jumping.png` at top.

---

## 4. Animation Physics & Pacing

### Excuse Cards
* **Intro Hang:** First 3 excuses hold for **0.9 seconds each**.
* **Acceleration:** After excuse #3, exponentially increase speed (S-curve).
* **Blur Effect:** Apply `filter: blur()` during high-speed, cards fly through Z-axis.
* **Hard Brake:** Final excuse (#16) holds for **1.2 seconds**.

### Card Transition Fix
Cards should NOT overlap during acceleration. The implementation uses:
1. **Sequential timing:** Previous card exits (opacity: 0) BEFORE next card enters
2. **Hard cut for fast cards:** High-velocity cards have quick opacity drop (30% of exit duration)
3. **Proper z-index:** New cards always appear on top

---

## 5. Full-Screen Stats Sequence

Each stat gets its own full-screen moment with breathing room.

### Stat Slide 1: Excuses Count
* **Layout:** Centered, full-screen
* **Top:** `spooli_jumping.png` (small, top 20% of screen)
* **Center:** Large number "3,312" in burnt orange (count up from 0)
* **Below number:** "EXCUSES RECORDED" in charcoal
* **Duration:** 2.5s (including count-up animation)
* **Transition:** Scale-zoom out

### Stat Slide 2: Time Saved
* **Layout:** Centered, full-screen
* **Center:** Large "9.1" in burnt orange (count up from 0)
* **Below number:** "DAYS GIVEN BACK TO OUR USERS" in charcoal
* **Subtext:** "(That's 218 hours saved)" in smaller burnt orange
* **Duration:** 2.5s
* **Transition:** Scale-zoom out

### Stat Slide 3: Peak Excuse Time
* **Layout:** Full-screen infographic
* **Headline:** "When do people make excuses?" in charcoal (52px)
* **Visual:** Horizontal bar chart with thick bars (45px height):
   * Late Night (12am-6am): **35%** ← longest bar, burnt orange, BOLD
   * Evening (6pm-12am): 31%
   * Afternoon (12pm-6pm): 22%
   * Morning (6am-12pm): 12%
* **Bar styling:**
   * Full-width container (85% of screen width)
   * Burnt orange fill with glow on top bar
   * Percentage numbers large (32px) next to bars
* **Punchline text:** "35% of excuses happen when you should be sleeping 😴" (34px, burnt orange)
* **Duration:** 3.0s
* **Animation:** Bars grow from left to right sequentially

---

## 6. CTA Outro

* **Layout:** Full-screen, centered
* **Top:** `spooli_jumping.png`
* **App Name:** "Spool" in large charcoal text (72px)
* **Tagline:** "Unwind wisely 🧵" in burnt orange (32px)
* **Social Proof:** "Join over 500+ users." in burnt orange, large and prominent (42px)
* **Button:** "Download on the App Store" badge
* **Duration:** 3.0s (hold for action)

---

## 7. Technical Remotion Constraints

* **Spring Config:** `stiffness: 250`, `damping: 20`
* **Responsive Padding:** Use `AbsoluteFill` with centered flex layouts
* **Count-up Animation:** Use `interpolate()` for smooth number animations
* **Font:** Quicksand (Google Fonts)
* **Resolution:** 1080x1920 (9:16 vertical)
* **FPS:** 30
* **Duration:** 900 frames (30 seconds)

---

## 8. Excuse Card Format

Each card displays:
```
┌────────────────────────────────┐
│ 🔸 Daneal                      │
│                                │
│ "i need to stalk my ex's       │
│  new girl!!!!!"                │
│                                │
└────────────────────────────────┘
```

* Username in burnt orange, bold, top-left with small indicator dot
* Excuse text in charcoal, larger font, centered
* Quotation marks included
* Card has burnt orange border and subtle shadow

---

## 9. File Structure

```
public/
├── spooli_wave.png       # Waving mascot (intro)
├── spooli_jumping.png    # Jumping mascot (stats, CTA)
├── spooli_shock.png      # Shocked mascot (optional)
└── smirk.png             # Smirking mascot (optional)

src/
├── CleanHypeReel.jsx     # Main composition, timing, excuses array
├── CleanComponents.jsx   # UI components, colors, stat slides
├── cleanAnimations.jsx   # Spring configs, S-curve timing, animations
└── fonts.jsx             # Quicksand font loader
```

---

## 10. How to Recreate

1. Clone the repository
2. Run `npm install`
3. Run `npx remotion studio` to preview
4. Modify `EXCUSES` array in `CleanHypeReel.jsx` to change excuse content
5. Modify stat values in `CleanComponents.jsx` stat slide components
6. Modify colors in `COLORS` object in `CleanComponents.jsx`
7. Run `npx remotion render src/index.js MyVideo out/video.mp4 --overwrite` to export
