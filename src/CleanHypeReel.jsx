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
  TheLoopSlide,
  TheBreakSlide,
  TheMechanismSlide,
  WallOfImpactSlide,
  SuccessRateSlide,
  RadialClockSlide,
  WhatYouGetSlide,
  ReviewsSlide,
  DownloadCard,
} from "./CleanComponents.jsx";

// ============================================
// EXCUSES WITH USERNAMES
// ============================================

const EXCUSES = [
  // Hook Excuses (0.9s each) - #1-3
  { username: "Maya", text: "i need to stalk my ex's new girl!!!!!", emoji: "👀" },
  { username: "Jake", text: "Just peeing and scrolling while i'm peeing honestly", emoji: "🚽" },
  { username: "Sophia", text: "Going onto X to feed my mind with slop", emoji: "🧠" },
  // Acceleration Phase - #4-15
  { username: "Marcus", text: "I am so bored during this work call I need to scroll", emoji: "😴" },
  { username: "Vedika", text: "i want to scroll before i go brush my teeth", emoji: "🪥" },
  { username: "Ryan", text: "Please let me back in I wanna watch Italian brain rot memes", emoji: "🍝" },
  { username: "Aisha", text: "OK OK OK OK hear me out I need to talk to my friend", emoji: "💬" },
  { username: "Julia", text: "I GOT INTO UT AUSTIN AND I WANNA BRAG", emoji: "🎉" },
  { username: "Noah", text: "I was having an absolutely titillating jolly good time on Instagram", emoji: "📸" },
  { username: "Lily", text: "i wanna see tiktok cuz i hate hate", emoji: "😤" },
  { username: "Anonymous", text: "Yo my algorithm is feeding me some good videos right now", emoji: "🎯" },
  { username: "Ethan", text: "I'm bored and I don't feel like doing my work", emoji: "😩" },
  { username: "Chloe", text: "Real quick just wanna doom scroll LinkedIn now", emoji: "💼" },
  { username: "Tyler", text: "I need to look at X because nothing ever happens", emoji: "🙄" },
  { username: "Priya", text: "Please please I just wanna play the game", emoji: "🎮" },
  // Hard Brake / Final Excuse (1.2s hold) - #16
  { username: "Derek", text: "It's been a long day and I just wanna look at some furry online", emoji: "🐾🤮" },
];

// Extract just texts for timing calculation
const EXCUSE_TEXTS = EXCUSES.map(e => e.text);

// Calculate timings with gap for card overlap fix (start after intro + typewriter)
const EXCUSE_TIMINGS = calculateSCurveTiming(EXCUSE_TEXTS, 145);
const LAST_EXCUSE = EXCUSE_TIMINGS[EXCUSE_TIMINGS.length - 1];
const LAST_EXCUSE_START = LAST_EXCUSE.startFrame; // When final excuse appears
const TICKER_END = LAST_EXCUSE.startFrame + LAST_EXCUSE.duration;

// V14 TIMING - Extended key screens for better readability
const LOOP_DURATION = 120; // 4.0s for "THE LOOP"
const BREAK_DURATION = 105; // 3.5s for "THE BREAK"
const MECHANISM_DURATION = 120; // 4.0s for React→Respond (V14: extended)
const WALL_OF_IMPACT_DURATION = 90; // 3.0s for combined stats
// DELETED: Scientific Speedbump title card
// DELETED: ClinicalProofSlide1 (duplicate "Label the Urge")
// DELETED: ClinicalProofSlide2 (Tokyo Rail - confusing)
const SUCCESS_RATE_DURATION = 120; // 4.0s for Success Rate (V14: extended)
const CLOCK_DURATION = 120; // 4.0s for late nights (V14: extended)
const WHAT_YOU_GET_DURATION = 120; // 4.0s for feature cards (V14: extended)
const REVIEW_DURATION = 180; // 6.0s for reviews (V14: extended)
const CTA_DURATION = 90; // 3.0s for CTA

// New sequence starts after excuses
const LOOP_START = TICKER_END + 30;
const BREAK_START = LOOP_START + LOOP_DURATION;
const MECHANISM_START = BREAK_START + BREAK_DURATION;

// Stats section follows the Loop → Break → Mechanism
const STATS_START = MECHANISM_START + MECHANISM_DURATION;

// 1. Wall of Impact (combined 3,500+ and 110+ days)
const WALL_OF_IMPACT_START = STATS_START;

// 2. Success Rate (simplified - no more confusing screens in between)
const SUCCESS_RATE_START = WALL_OF_IMPACT_START + WALL_OF_IMPACT_DURATION;

// 3. Late Nights Clock
const CLOCK_START = SUCCESS_RATE_START + SUCCESS_RATE_DURATION;

// 4. What You Get (V13 NEW - feature cards)
const WHAT_YOU_GET_START = CLOCK_START + CLOCK_DURATION;

// 5. Reviews (with header)
const REVIEW_START = WHAT_YOU_GET_START + WHAT_YOU_GET_DURATION;

// 6. CTA
const DOWNLOAD_START = REVIEW_START + REVIEW_DURATION;

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

  // Typewriter effect for title
  const titleText = "Real moments of clarity";
  const titleStartFrame = 25;
  const charsPerFrame = 0.8; // Speed of typing
  const titleCharsToShow = Math.min(
    titleText.length,
    Math.max(0, Math.floor((frame - titleStartFrame) * charsPerFrame))
  );
  const displayTitle = titleText.slice(0, titleCharsToShow);
  const showTitleCursor = frame >= titleStartFrame && titleCharsToShow < titleText.length;

  // Typewriter effect for subtitle
  const subtitleText = "before the scroll";
  const subtitleStartFrame = titleStartFrame + Math.ceil(titleText.length / charsPerFrame) + 5;
  const subtitleCharsToShow = Math.min(
    subtitleText.length,
    Math.max(0, Math.floor((frame - subtitleStartFrame) * charsPerFrame))
  );
  const displaySubtitle = subtitleText.slice(0, subtitleCharsToShow);
  const showSubtitleCursor = frame >= subtitleStartFrame && subtitleCharsToShow < subtitleText.length;

  // Cursor blink
  const cursorVisible = Math.floor(frame / 8) % 2 === 0;

  // Container fade in
  const containerOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pop effect when typing completes
  const titleComplete = titleCharsToShow >= titleText.length;
  const subtitleComplete = subtitleCharsToShow >= subtitleText.length;

  const titleScale = titleComplete
    ? interpolate(frame - (titleStartFrame + Math.ceil(titleText.length / charsPerFrame)), [0, 5, 10], [1, 1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const subtitleScale = subtitleComplete
    ? interpolate(frame - (subtitleStartFrame + Math.ceil(subtitleText.length / charsPerFrame)), [0, 5, 10], [1, 1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

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

      {/* Text container */}
      <div
        style={{
          opacity: containerOpacity,
          textAlign: "center",
          maxWidth: 700,
        }}
      >
        {/* Title - typewriter effect */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 60,
            color: COLORS.charcoal,
            lineHeight: 1.3,
            transform: `scale(${titleScale})`,
            minHeight: 80,
          }}
        >
          {displayTitle}
          {showTitleCursor && cursorVisible && (
            <span style={{ color: COLORS.burntOrange }}>|</span>
          )}
        </div>

        {/* Subtitle - typewriter effect with burnt orange */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            fontSize: 48,
            color: COLORS.burntOrange,
            marginTop: 20,
            transform: `scale(${subtitleScale})`,
            minHeight: 60,
            textShadow: subtitleComplete ? `0 0 20px rgba(232, 93, 4, 0.3)` : "none",
          }}
        >
          {displaySubtitle}
          {showSubtitleCursor && cursorVisible && (
            <span style={{ color: COLORS.burntOrange }}>|</span>
          )}
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

  // Intro fade out (extended to let typewriter finish + hold)
  const introOpacity = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic vignette during blur phase (subtle on cream)
  const vignette = vignetteIntensity(frame, BLUR_PHASE_START, BLUR_PHASE_END) * 0.3;

  // Disclaimer appears when excuses start showing (after intro)
  const disclaimerOpacity = interpolate(frame, [145, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Intro fades */}
      {frame < 150 && (
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
          emoji={EXCUSES[i].emoji}
          startFrame={timing.startFrame}
          duration={timing.duration}
          velocity={timing.velocity}
          isBrake={timing.isBrake}
        />
      ))}

      {/* Disclaimer at the bottom - "real excuses recorded in Spool" */}
      {frame >= 145 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: disclaimerOpacity,
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            fontSize: 20,
            color: COLORS.charcoal,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            padding: "10px 24px",
            borderRadius: 30,
            border: `2px solid ${COLORS.burntOrange}`,
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          Real excuses recorded in Spool
        </div>
      )}

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
        transform: `translate(-50%, -50%) scale(${finalScale * 1.40})`,
        opacity: finalOpacity,
        width: "95%",
        maxWidth: 620,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Emoji ABOVE the card - bigger */}
      <div
        style={{
          textAlign: "center",
          fontSize: 80,
          marginBottom: 16,
        }}
      >
        {lastExcuse.emoji}
      </div>
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 32,
          border: `2px solid ${COLORS.burntOrange}`,
          padding: "48px 50px",
          boxShadow: `
            0 6px 25px rgba(232, 93, 4, 0.18),
            0 10px 50px rgba(232, 93, 4, 0.12),
            0 0 ${30 * glow}px rgba(232, 93, 4, ${glow * 0.25})
          `,
          width: "100%",
        }}
      >
        {/* Username with indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: COLORS.burntOrange,
            }}
          />
          <span
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 22,
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
            fontSize: 38,
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
        socialProof="Join over 600+ users."
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

  // Scene visibility - V11 simplified flow
  const showTicker = frame < LAST_EXCUSE_START + 10; // Ticker ends when last excuse appears
  const showZoomOut = frame >= LAST_EXCUSE_START && frame < LOOP_START + 15;

  // Loop → Break → Mechanism sequence (after excuses, before stats)
  const showLoop = frame >= LOOP_START && frame < BREAK_START + 12;
  const showBreak = frame >= BREAK_START && frame < MECHANISM_START + 12;
  const showMechanism = frame >= MECHANISM_START && frame < WALL_OF_IMPACT_START + 12;

  // 1. Wall of Impact (combined stats)
  const showWallOfImpact = frame >= WALL_OF_IMPACT_START && frame < SUCCESS_RATE_START + 12;

  // 2. Success Rate (directly after Wall of Impact - no more confusing screens)
  const showSuccessRate = frame >= SUCCESS_RATE_START && frame < CLOCK_START + 12;

  // 3. Late Nights Clock
  const showClock = frame >= CLOCK_START && frame < WHAT_YOU_GET_START + 12;

  // 4. What You Get (V13 NEW)
  const showWhatYouGet = frame >= WHAT_YOU_GET_START && frame < REVIEW_START + 12;

  // 5. Reviews (with header)
  const showReviews = frame >= REVIEW_START && frame < DOWNLOAD_START + 12;

  // 6. CTA
  const showDownload = frame >= DOWNLOAD_START - 10;

  // Fade transitions - V11 simplified flow
  const tickerOpacity = frame >= LAST_EXCUSE_START - 5
    ? interpolate(frame, [LAST_EXCUSE_START - 5, LAST_EXCUSE_START + 10], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // Loop → Break → Mechanism fade transitions
  const loopOpacity = frame >= BREAK_START - 10
    ? interpolate(frame, [BREAK_START - 10, BREAK_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  const breakOpacity = frame >= MECHANISM_START - 10
    ? interpolate(frame, [MECHANISM_START - 10, MECHANISM_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  const mechanismOpacity = frame >= WALL_OF_IMPACT_START - 10
    ? interpolate(frame, [WALL_OF_IMPACT_START - 10, WALL_OF_IMPACT_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // Wall of Impact fades into Success Rate (no more confusing screens)
  const wallOpacity = frame >= SUCCESS_RATE_START - 12
    ? interpolate(frame, [SUCCESS_RATE_START - 12, SUCCESS_RATE_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // Success Rate fades into Clock
  const successRateOpacity = frame >= CLOCK_START - 12
    ? interpolate(frame, [CLOCK_START - 12, CLOCK_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // Clock fades into What You Get
  const clockOpacity = frame >= WHAT_YOU_GET_START - 12
    ? interpolate(frame, [WHAT_YOU_GET_START - 12, WHAT_YOU_GET_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // What You Get fades into Reviews (V13 NEW)
  const whatYouGetOpacity = frame >= REVIEW_START - 12
    ? interpolate(frame, [REVIEW_START - 12, REVIEW_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // Reviews fades into CTA
  const reviewsOpacity = frame >= DOWNLOAD_START - 12
    ? interpolate(frame, [DOWNLOAD_START - 12, DOWNLOAD_START], [1, 0], { extrapolateRight: "clamp" })
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

      {/* THE LOOP - Autopilot Loop Animation */}
      {showLoop && (
        <div style={{ opacity: loopOpacity }}>
          <TheLoopSlide startFrame={LOOP_START} />
        </div>
      )}

      {/* THE BREAK - Voice Waveform Breaks Loop */}
      {showBreak && (
        <div style={{ opacity: breakOpacity }}>
          <TheBreakSlide startFrame={BREAK_START} />
        </div>
      )}

      {/* THE MECHANISM - Brain Animation */}
      {showMechanism && (
        <div style={{ opacity: mechanismOpacity }}>
          <TheMechanismSlide startFrame={MECHANISM_START} />
        </div>
      )}

      {/* 1. Wall of Impact (Combined Stats) */}
      {showWallOfImpact && (
        <div style={{ opacity: wallOpacity }}>
          <WallOfImpactSlide startFrame={WALL_OF_IMPACT_START} />
        </div>
      )}

      {/* 2. Success Rate (larger, clearer copy) */}
      {showSuccessRate && (
        <div style={{ opacity: successRateOpacity }}>
          <SuccessRateSlide startFrame={SUCCESS_RATE_START} />
        </div>
      )}

      {/* 3. Late Nights Clock */}
      {showClock && (
        <div style={{ opacity: clockOpacity }}>
          <RadialClockSlide startFrame={CLOCK_START} />
        </div>
      )}

      {/* 4. What You Get - Feature Cards (V13 NEW) */}
      {showWhatYouGet && (
        <div style={{ opacity: whatYouGetOpacity }}>
          <WhatYouGetSlide startFrame={WHAT_YOU_GET_START} />
        </div>
      )}

      {/* 5. Reviews (with header + clean animation) */}
      {showReviews && (
        <div style={{ opacity: reviewsOpacity }}>
          <ReviewsSlide startFrame={REVIEW_START} />
        </div>
      )}

      {/* Download CTA */}
      {showDownload && <DownloadScene startFrame={DOWNLOAD_START} />}
    </AbsoluteFill>
  );
};
