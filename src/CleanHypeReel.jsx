import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FontLoader } from "./fonts.jsx";
import { calculateSCurveTiming, vignetteIntensity, glowPulse, zoomOutTransition } from "./cleanAnimations.jsx";
import {
  COLORS,
  CleanExcuseCard,
  Vignette,
  WavingMascot,
  ExcusesStatSlide,
  TimeSavedStatSlide,
  PeakExcuseTimeSlide,
  DownloadCard,
} from "./CleanComponents.jsx";

// ============================================
// EXCUSES WITH USERNAMES
// ============================================

const EXCUSES = [
  // Hook Excuses (0.9s each) - #1-3
  { username: "Daneal", text: "i need to stalk my ex's new girl!!!!!" },
  { username: "Praf", text: "Just peeing and scrolling while i'm peeing honestly" },
  { username: "Daneal", text: "Going onto X to feed my mind with slop" },
  // Acceleration Phase - #4-15
  { username: "Daneal", text: "I am so bored during this work call I need to scroll" },
  { username: "Vedika", text: "i want to scroll before i go brush my teeth" },
  { username: "Jainam", text: "Please let me back in I wanna watch Italian brain rot memes" },
  { username: "Daneal", text: "OK OK OK OK hear me out I need to talk to my friend" },
  { username: "Julia", text: "I GOT INTO UT AUSTIN AND I WANNA BRAG" },
  { username: "Praf", text: "I was having an absolutely titillating jolly good time on Instagram" },
  { username: "Daneal", text: "i wanna see tiktok cuz i hate hate" },
  { username: "Anonymous", text: "Yo my algorithm is feeding me some good videos right now" },
  { username: "Vedika", text: "I'm bored and I don't feel like doing my work" },
  { username: "Praf", text: "Real quick just wanna doom scroll LinkedIn now" },
  { username: "Daneal", text: "I need to look at X because nothing ever happens" },
  { username: "Jainam", text: "Please please I just wanna play the game" },
  // Hard Brake / Final Excuse (1.2s hold) - #16
  { username: "Praf", text: "It's been a long day and I just wanna look at some furry online" },
];

// Extract just texts for timing calculation
const EXCUSE_TEXTS = EXCUSES.map(e => e.text);

// Calculate timings with gap for card overlap fix (start after intro)
const EXCUSE_TIMINGS = calculateSCurveTiming(EXCUSE_TEXTS, 95);
const LAST_EXCUSE = EXCUSE_TIMINGS[EXCUSE_TIMINGS.length - 1];
const LAST_EXCUSE_START = LAST_EXCUSE.startFrame; // When final excuse appears
const TICKER_END = LAST_EXCUSE.startFrame + LAST_EXCUSE.duration;

// New timing for sequential stat slides (INCREASED durations per v4 spec)
const STAT_SLIDE_DURATION = 75; // 2.5s at 30fps
const STAT_3_DURATION = 90; // 3.0s for the chart slide
const CTA_DURATION = 90; // 3.0s for CTA hold
const STATS_START = TICKER_END + 30;
const STAT_1_START = STATS_START; // Excuses count
const STAT_2_START = STAT_1_START + STAT_SLIDE_DURATION; // Time saved
const STAT_3_START = STAT_2_START + STAT_SLIDE_DURATION; // Peak excuse time
const DOWNLOAD_START = STAT_3_START + STAT_3_DURATION; // CTA (no more Stat 4)

// Get blur phase timing
const BLUR_PHASE_START = EXCUSE_TIMINGS[3]?.startFrame || 150;
const BLUR_PHASE_END = EXCUSE_TIMINGS[14]?.startFrame + (EXCUSE_TIMINGS[14]?.duration || 10);

// ============================================
// CREAM BACKGROUND (Modern & Clean)
// ============================================

const CreamBackground = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.cream,
        overflow: "hidden",
      }}
    >
      {/* Subtle burnt orange center glow */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          width: 1000,
          height: 1000,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(232, 93, 4, 0.03) 0%, transparent 50%)`,
        }}
      />
    </div>
  );
};

// ============================================
// INTRO SCENE (with Waving Mascot - ORIGINAL FORMAT)
// ============================================

const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text entries
  const text1Frame = Math.max(0, frame - 25);
  const text1Progress = spring({ frame: text1Frame, fps, config: { stiffness: 140, damping: 16 } });

  const text2Frame = Math.max(0, frame - 40);
  const text2Progress = spring({ frame: text2Frame, fps, config: { stiffness: 140, damping: 16 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      {/* Waving Mascot */}
      <div style={{ marginBottom: 40 }}>
        <WavingMascot startFrame={0} />
      </div>

      {/* Text container - no border, larger text */}
      <div
        style={{
          opacity: interpolate(text1Progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(text1Progress, [0, 0.7, 1], [0.7, 1.05, 1])}) translateY(${interpolate(text1Progress, [0, 1], [25, 0])}px)`,
          textAlign: "center",
          maxWidth: 600,
        }}
      >
        {/* Title - larger charcoal text */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 56,
            color: COLORS.charcoal,
            lineHeight: 1.3,
          }}
        >
          Real excuses people tell
        </div>

        {/* Subtitle - burnt orange accent */}
        <div
          style={{
            opacity: interpolate(text2Progress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(text2Progress, [0, 1], [10, 0])}px)`,
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            fontSize: 44,
            color: COLORS.burntOrange,
            marginTop: 16,
          }}
        >
          to unlock their phones
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// EXCUSE TICKER SCENE (Full-width cards on cream)
// ============================================

const ExcuseTickerScene = () => {
  const frame = useCurrentFrame();

  // Intro fade out (extended for longer visibility)
  const introOpacity = interpolate(frame, [75, 95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic vignette during blur phase (subtle on cream)
  const vignette = vignetteIntensity(frame, BLUR_PHASE_START, BLUR_PHASE_END) * 0.3;

  return (
    <>
      {/* Intro fades */}
      {frame < 110 && (
        <div style={{ opacity: introOpacity }}>
          <IntroScene />
        </div>
      )}

      {/* Excuse cards with usernames - skip last one (handled by FinalExcuseZoomOut) */}
      {EXCUSE_TIMINGS.slice(0, -1).map((timing, i) => (
        <CleanExcuseCard
          key={i}
          username={EXCUSES[i].username}
          text={timing.text}
          startFrame={timing.startFrame}
          duration={timing.duration}
          velocity={timing.velocity}
          isBrake={timing.isBrake}
        />
      ))}

      {/* Subtle vignette during blur phase */}
      <Vignette intensity={vignette} />
    </>
  );
};

// ============================================
// FINAL EXCUSE ZOOM OUT
// ============================================

const FinalExcuseZoomOut = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - triggerFrame;
  if (relativeFrame < 0) return null;

  // Hold for 36 frames (1.2s like the brake), then zoom out
  const holdDuration = 36;
  const zoomStart = triggerFrame + holdDuration;

  // Entry animation (spring in)
  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 200, damping: 18 },
  });
  const entryScale = interpolate(entryProgress, [0, 0.6, 1], [0.3, 1.05, 1.0]);
  const entryOpacity = interpolate(relativeFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Zoom out (starts after hold)
  const { scale: zoomScale, opacity: zoomOpacity } = zoomOutTransition(frame, zoomStart, 25);

  // Combine: during hold use entry values, during zoom use zoom values
  const isZooming = frame >= zoomStart;
  const finalScale = isZooming ? zoomScale : entryScale;
  const finalOpacity = isZooming ? zoomOpacity : entryOpacity;

  if (finalOpacity <= 0) return null;

  const lastExcuse = EXCUSES[EXCUSES.length - 1];
  const glow = glowPulse(frame, 0.08, 0.5, 0.9);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${finalScale * 1.30})`,
        opacity: finalOpacity,
        width: "95%",
        maxWidth: 560,
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 28,
          border: `1px solid ${COLORS.burntOrange}`,
          padding: "42px 44px",
          boxShadow: `
            0 4px 20px rgba(232, 93, 4, 0.15),
            0 8px 40px rgba(232, 93, 4, 0.1),
            0 0 ${25 * glow}px rgba(232, 93, 4, ${glow * 0.2})
          `,
        }}
      >
        {/* Username with indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: COLORS.burntOrange,
            }}
          />
          <span
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: COLORS.burntOrange,
            }}
          >
            {lastExcuse.username}
          </span>
        </div>
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 34,
            color: COLORS.charcoal,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          "{lastExcuse.text}"
        </p>
      </div>
    </div>
  );
};

// ============================================
// DOWNLOAD SCENE
// ============================================

const DownloadScene = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Scene fade in
  const sceneOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DownloadCard
        startFrame={startFrame}
        appName="Spool"
        tagline="Unwind wisely 🧵"
        socialProof="Join over 500+ users."
      />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const CleanHypeReel = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Scene visibility
  const showTicker = frame < LAST_EXCUSE_START + 10; // Ticker ends when last excuse appears
  const showZoomOut = frame >= LAST_EXCUSE_START && frame < STATS_START + 15;

  // Individual stat slides (Stat 4 "Most Used Words" REMOVED per v4 spec)
  const showStat1 = frame >= STAT_1_START && frame < STAT_2_START + 15;
  const showStat2 = frame >= STAT_2_START && frame < STAT_3_START + 15;
  const showStat3 = frame >= STAT_3_START && frame < DOWNLOAD_START + 15;

  const showDownload = frame >= DOWNLOAD_START - 10;

  // Fade transitions - ticker fades when last excuse appears
  const tickerOpacity = frame >= LAST_EXCUSE_START - 5
    ? interpolate(frame, [LAST_EXCUSE_START - 5, LAST_EXCUSE_START + 10], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  const stat1Opacity = frame >= STAT_2_START - 10
    ? interpolate(frame, [STAT_2_START - 10, STAT_2_START + 5], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  const stat2Opacity = frame >= STAT_3_START - 10
    ? interpolate(frame, [STAT_3_START - 10, STAT_3_START + 5], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  const stat3Opacity = frame >= DOWNLOAD_START - 10
    ? interpolate(frame, [DOWNLOAD_START - 10, DOWNLOAD_START + 5], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FontLoader />
      <CreamBackground />

      {/* Ticker scene (intro + excuse cards) */}
      {showTicker && (
        <div style={{ opacity: tickerOpacity }}>
          <ExcuseTickerScene />
        </div>
      )}

      {/* Zoom-out transition (final excuse scales up and fades) */}
      {showZoomOut && <FinalExcuseZoomOut triggerFrame={LAST_EXCUSE_START} />}

      {/* Stat Slide 1: Excuses Count */}
      {showStat1 && (
        <div style={{ opacity: stat1Opacity }}>
          <ExcusesStatSlide startFrame={STAT_1_START} />
        </div>
      )}

      {/* Stat Slide 2: Time Saved */}
      {showStat2 && (
        <div style={{ opacity: stat2Opacity }}>
          <TimeSavedStatSlide startFrame={STAT_2_START} />
        </div>
      )}

      {/* Stat Slide 3: Peak Excuse Time */}
      {showStat3 && (
        <div style={{ opacity: stat3Opacity }}>
          <PeakExcuseTimeSlide startFrame={STAT_3_START} />
        </div>
      )}

      {/* Download CTA */}
      {showDownload && <DownloadScene startFrame={DOWNLOAD_START} />}
    </AbsoluteFill>
  );
};
