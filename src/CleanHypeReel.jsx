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
  HeroSpool,
  VerticalStatsStack,
  Vignette,
  BackgroundSpool,
  ReactiveMascot,
  OutroMascot,
} from "./CleanComponents.jsx";

// ============================================
// EXCUSES
// ============================================

const EXCUSES = [
  "i need to stalk my ex's new girl!!!!!",
  "Just peeing and scrolling while i'm peeing honestly",
  "I am so bored during this work call I need to scroll",
  "This is my scrolling time let me in",
  "Going onto X to feed my mind with slop",
  "Just woke up and I wanna see what's going on",
  "i wanna see tiktok cuz i hate hate",
  "Just wanna scroll one more time before i go to sleep",
  "i want to scroll before i go brush my teeth",
  "I need to look at X because nothing ever happens",
  "i need to like my dads instagram post",
  "I have to post a meme on my Instagram page",
  "i want to play fortnite bc i'm broed",
  "Logging onto twitter to see if something else happened", // 14th - The Brake
];

// Calculate timings
const EXCUSE_TIMINGS = calculateSCurveTiming(EXCUSES, 70);
const LAST_EXCUSE = EXCUSE_TIMINGS[EXCUSE_TIMINGS.length - 1];
const TICKER_END = LAST_EXCUSE.startFrame + LAST_EXCUSE.duration;
const STATS_START = TICKER_END + 20;

// Get blur phase timing
const BLUR_PHASE_START = EXCUSE_TIMINGS[3]?.startFrame || 150;
const BLUR_PHASE_END = EXCUSE_TIMINGS[12]?.startFrame + EXCUSE_TIMINGS[12]?.duration || 300;

// ============================================
// DARK BACKGROUND
// ============================================

const DarkBackground = () => {
  const frame = useCurrentFrame();

  const gridDrift = frame * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.black,
        overflow: "hidden",
      }}
    >
      {/* Subtle center glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.accentBlue}08 0%, transparent 60%)`,
        }}
      />

      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          right: -40,
          bottom: -40,
          backgroundImage: `
            linear-gradient(rgba(138, 201, 225, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 201, 225, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
          transform: `translateY(${gridDrift % 70}px)`,
        }}
      />
    </div>
  );
};

// ============================================
// INTRO SCENE
// ============================================

const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spool entry
  const spoolProgress = spring({
    frame,
    fps,
    config: { stiffness: 150, damping: 18 },
  });

  const spoolScale = interpolate(spoolProgress, [0, 0.7, 1], [0, 1.1, 1]);
  const spoolOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Text entries
  const text1Frame = Math.max(0, frame - 18);
  const text1Progress = spring({ frame: text1Frame, fps, config: { stiffness: 140, damping: 16 } });

  const text2Frame = Math.max(0, frame - 32);
  const text2Progress = spring({ frame: text2Frame, fps, config: { stiffness: 140, damping: 16 } });

  const glow = glowPulse(frame, 0.06, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      {/* Spool */}
      <div
        style={{
          fontSize: 110,
          opacity: spoolOpacity,
          transform: `scale(${spoolScale})`,
          filter: `drop-shadow(0 0 30px ${COLORS.accentBlue}55)`,
          marginBottom: 24,
        }}
      >
        🧵
      </div>

      {/* Title */}
      <div
        style={{
          opacity: interpolate(text1Progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(text1Progress, [0, 0.7, 1], [0.7, 1.05, 1])}) translateY(${interpolate(text1Progress, [0, 1], [25, 0])}px)`,
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 36,
          color: COLORS.white,
          textAlign: "center",
          textShadow: `0 0 25px ${COLORS.accentBlue}44`,
        }}
      >
        Real excuses people tell
      </div>

      <div
        style={{
          opacity: interpolate(text2Progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(text2Progress, [0, 0.7, 1], [0.7, 1.05, 1])}) translateY(${interpolate(text2Progress, [0, 1], [20, 0])}px)`,
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 28,
          color: COLORS.accentBlue,
          textAlign: "center",
          marginTop: 10,
          textShadow: `0 0 ${20 * glow}px ${COLORS.accentBlue}77`,
        }}
      >
        to unlock their phones
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// EXCUSE TICKER SCENE
// ============================================

const ExcuseTickerScene = () => {
  const frame = useCurrentFrame();

  // Intro fade out
  const introOpacity = interpolate(frame, [55, 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic vignette during blur phase
  const vignette = vignetteIntensity(frame, BLUR_PHASE_START, BLUR_PHASE_END);

  // Determine current excuse index for mascot reaction
  let currentExcuseIndex = 0;
  for (let i = 0; i < EXCUSE_TIMINGS.length; i++) {
    const timing = EXCUSE_TIMINGS[i];
    if (frame >= timing.startFrame && frame < timing.startFrame + timing.duration) {
      currentExcuseIndex = i;
      break;
    }
    if (frame >= timing.startFrame + timing.duration) {
      currentExcuseIndex = i;
    }
  }

  // Mascot opacity - fade in after intro, fade out before stats
  const mascotOpacity = interpolate(frame, [70, 100, STATS_START - 30, STATS_START - 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Intro fades */}
      {frame < 90 && (
        <div style={{ opacity: introOpacity }}>
          <IntroScene />
        </div>
      )}

      {/* Mascot behind cards - reacts to excuses */}
      {frame >= 70 && frame < STATS_START && (
        <ReactiveMascot currentExcuseIndex={currentExcuseIndex} opacity={mascotOpacity} />
      )}

      {/* Excuse cards */}
      {EXCUSE_TIMINGS.map((timing, i) => (
        <CleanExcuseCard
          key={i}
          text={timing.text}
          startFrame={timing.startFrame}
          duration={timing.duration}
          velocity={timing.velocity}
          isBrake={timing.isBrake}
        />
      ))}

      {/* Vignette during blur phase */}
      <Vignette intensity={vignette} />
    </>
  );
};

// ============================================
// STATS FINALE SCENE (Vertical Stack with Mascot)
// ============================================

const StatsFinaleScene = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Scene fade in
  const sceneOpacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Enhanced background glow that intensifies
  const glowIntensity = interpolate(relativeFrame, [0, 30, 60], [0.3, 0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
      }}
    >
      {/* Enhanced halo/bloom behind stats */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          width: 900,
          height: 900,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.accentBlue}${Math.round(glowIntensity * 25).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          padding: "80px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {/* TOP: Jumping Mascot with bounce */}
        <div style={{ paddingTop: 100, marginBottom: 60 }}>
          <OutroMascot startFrame={startFrame} />
        </div>

        {/* CENTER: Vertical Stats Stack - Sequential Slam */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <VerticalStatsStack startFrame={startFrame + 15} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// FINAL EXCUSE ZOOM OUT (replaces flash)
// ============================================

const FinalExcuseZoomOut = ({ triggerFrame, text }) => {
  const frame = useCurrentFrame();

  const { scale, opacity } = zoomOutTransition(frame, triggerFrame, 25);

  if (opacity <= 0) return null;

  const glow = glowPulse(frame, 0.08, 0.5, 0.9);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${scale * 1.28})`,
        opacity,
        width: "92%",
        maxWidth: 520,
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.glass,
          borderRadius: 28,
          border: `2px solid ${COLORS.glassBorder}`,
          padding: "42px 44px",
          backdropFilter: "blur(18px)",
          boxShadow: `
            0 0 ${35 * glow}px ${COLORS.accentBlue}${Math.round(glow * 55).toString(16).padStart(2, '0')},
            0 0 ${70 * glow}px ${COLORS.accentBlue}${Math.round(glow * 30).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.18)
          `,
        }}
      >
        <div
          style={{
            width: 50,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.accentBlue,
            marginBottom: 18,
            boxShadow: `0 0 16px ${COLORS.accentBlue}`,
          }}
        />
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 34,
            color: COLORS.white,
            margin: 0,
            lineHeight: 1.4,
            textShadow: "0 3px 10px rgba(0,0,0,0.5)",
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const CleanHypeReel = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Get the last excuse text for zoom-out
  const lastExcuseText = EXCUSES[EXCUSES.length - 1];

  // Scene visibility
  const showTicker = frame < STATS_START + 10;
  const showStats = frame >= STATS_START - 5;
  const showZoomOut = frame >= STATS_START - 5 && frame < STATS_START + 25;

  // Ticker fade out (quicker, before zoom starts)
  const tickerOpacity = frame >= STATS_START - 20
    ? interpolate(frame, [STATS_START - 20, STATS_START - 5], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  // Background blur and glow when stats appear (depth of field)
  const bgBlurred = frame >= STATS_START - 5;
  const bgGlowIntensity = interpolate(frame, [STATS_START - 5, STATS_START + 30], [0.035, 0.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FontLoader />
      <DarkBackground />

      {/* Background Spool with depth of field and enhanced glow */}
      <BackgroundSpool blurred={bgBlurred} opacity={bgGlowIntensity} />

      {/* Ticker scene */}
      {showTicker && (
        <div style={{ opacity: tickerOpacity }}>
          <ExcuseTickerScene />
        </div>
      )}

      {/* Zoom-out transition (final excuse scales up and fades) */}
      {showZoomOut && (
        <FinalExcuseZoomOut triggerFrame={STATS_START - 5} text={lastExcuseText} />
      )}

      {/* Stats Finale (vertical stack) */}
      {showStats && <StatsFinaleScene startFrame={STATS_START} />}
    </AbsoluteFill>
  );
};
