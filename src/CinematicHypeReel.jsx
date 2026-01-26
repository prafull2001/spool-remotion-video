import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FontLoader } from "./fonts.jsx";
import { calculateExcuseTimings, glowPulse } from "./cinematicAnimations.jsx";
import {
  COLORS,
  GhostedExcuses,
  FlyThroughExcuseCard,
  HapticFlashOverlay,
  ScreenShakeWrapper,
  SlamStat,
  ParallaxUICard,
  MiniPieChart,
  AmbientSpool,
} from "./CinematicComponents.jsx";

// All 18 excuses
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
  "To see if my friend sent me something",
  "Logging onto twitter to see if something else happened",
];

// Calculate all timings upfront
const EXCUSE_TIMINGS = calculateExcuseTimings(EXCUSES, 80);
const TICKER_END_FRAME = EXCUSE_TIMINGS[EXCUSE_TIMINGS.length - 1].startFrame + 60;
const STATS_START = TICKER_END_FRAME + 30;
const OUTRO_START = STATS_START + 120;

// ============================================
// DARK BACKGROUND WITH GRID
// ============================================

const DarkBackground = () => {
  const frame = useCurrentFrame();

  // Subtle movement
  const gridOffset = frame * 0.2;

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
      {/* Radial gradient - reacts to excuse impacts */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 1200,
          height: 1200,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${COLORS.accentBlue}0a 0%, transparent 50%)`,
        }}
      />

      {/* Animated grid */}
      <div
        style={{
          position: "absolute",
          top: -50,
          left: -50,
          right: -50,
          bottom: -50,
          backgroundImage: `
            linear-gradient(rgba(138, 201, 225, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 201, 225, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: `translateY(${gridOffset % 80}px)`,
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

  // Spool icon animation
  const spoolProgress = spring({
    frame,
    fps,
    config: { stiffness: 200, damping: 12 },
  });

  const spoolScale = interpolate(spoolProgress, [0, 0.6, 1], [0, 1.3, 1]);
  const spoolOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Text animations
  const text1Progress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { stiffness: 180, damping: 14 },
  });

  const text2Progress = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { stiffness: 180, damping: 14 },
  });

  const glow = glowPulse(frame, 0.08, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Spool icon with bloom */}
      <div
        style={{
          fontSize: 130,
          opacity: spoolOpacity,
          transform: `scale(${spoolScale})`,
          filter: `drop-shadow(0 0 40px ${COLORS.accentBlue}66) drop-shadow(0 0 80px ${COLORS.accentBlue}33)`,
          marginBottom: 30,
        }}
      >
        🧵
      </div>

      {/* Title text */}
      <div
        style={{
          opacity: interpolate(text1Progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(text1Progress, [0, 0.7, 1], [0.5, 1.1, 1])}) translateY(${interpolate(text1Progress, [0, 1], [30, 0])}px)`,
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 40,
          color: COLORS.white,
          textAlign: "center",
          textShadow: `0 0 30px ${COLORS.accentBlue}55`,
        }}
      >
        Real excuses people tell
      </div>

      <div
        style={{
          opacity: interpolate(text2Progress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(text2Progress, [0, 0.7, 1], [0.5, 1.1, 1])}) translateY(${interpolate(text2Progress, [0, 1], [20, 0])}px)`,
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 32,
          color: COLORS.accentBlue,
          textAlign: "center",
          marginTop: 12,
          textShadow: `0 0 ${25 * glow}px ${COLORS.accentBlue}88`,
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

  // Get all trigger frames for shake/flash effects
  const triggerFrames = EXCUSE_TIMINGS.map((t) => t.startFrame);

  // Fade out intro
  const introOpacity = interpolate(frame, [60, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Intro fades out */}
      {frame < 100 && (
        <div style={{ opacity: introOpacity }}>
          <IntroScene />
        </div>
      )}

      {/* Ghosted background excuses */}
      {frame >= 60 && frame < TICKER_END_FRAME + 50 && (
        <GhostedExcuses
          excuses={EXCUSES}
          opacity={interpolate(frame, [60, 100], [0, 0.08], { extrapolateRight: "clamp" })}
        />
      )}

      {/* Screen shake wrapper for all excuse cards */}
      <ScreenShakeWrapper triggerFrames={triggerFrames} intensity={12}>
        {EXCUSE_TIMINGS.map((timing, i) => (
          <FlyThroughExcuseCard
            key={i}
            text={timing.text}
            startFrame={timing.startFrame}
            duration={timing.duration}
            isFinal={timing.isFinal}
          />
        ))}
      </ScreenShakeWrapper>

      {/* Haptic flash overlay */}
      <HapticFlashOverlay triggerFrames={triggerFrames} />
    </>
  );
};

// ============================================
// STATS SCENE
// ============================================

const StatsScene = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Scene fade in
  const sceneOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // "We've collected" text
  const headerProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 150, damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: sceneOpacity,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 250,
          opacity: interpolate(headerProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headerProgress, [0, 1], [30, 0])}px)`,
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 26,
          color: "rgba(255,255,255,0.7)",
          textShadow: `0 0 15px ${COLORS.accentBlue}44`,
        }}
      >
        We've collected
      </div>

      {/* Main slam stat */}
      <SlamStat
        value="3313"
        label="excuses"
        startFrame={startFrame + 15}
        color={COLORS.accentOrange}
      />

      {/* Secondary stats */}
      <div
        style={{
          position: "absolute",
          bottom: 350,
          display: "flex",
          gap: 80,
        }}
      >
        <SecondaryStatItem
          value="9.1"
          suffix=" days"
          label="screen time requested"
          startFrame={startFrame + 60}
        />
        <SecondaryStatItem
          value="179"
          label="users"
          startFrame={startFrame + 75}
        />
      </div>
    </AbsoluteFill>
  );
};

const SecondaryStatItem = ({ value, suffix = "", label, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 200, damping: 14 },
  });

  const scale = interpolate(progress, [0, 0.6, 1], [0.5, 1.1, 1]);
  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.06, 0.6, 1);

  return (
    <div
      style={{
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 48,
          color: COLORS.accentBlue,
          textShadow: `0 0 ${20 * glow}px ${COLORS.accentBlue}88`,
        }}
      >
        {value}{suffix}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: "rgba(255,255,255,0.6)",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============================================
// OUTRO SCENE (Layered 3D Parallax)
// ============================================

const OutroScene = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const sceneOpacity = interpolate(relativeFrame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glow = glowPulse(frame, 0.05, 0.7, 1);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Layer 0: Back - Spool icon */}
      <ParallaxUICard startFrame={startFrame} layer={0} totalLayers={3} width={280}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 80,
              filter: `drop-shadow(0 0 30px ${COLORS.accentBlue}66)`,
            }}
          >
            🧵
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: COLORS.white,
              marginTop: 10,
              textShadow: `0 0 15px ${COLORS.accentBlue}55`,
            }}
          >
            Spool
          </div>
        </div>
      </ParallaxUICard>

      {/* Layer 1: Middle - Screen time card */}
      <ParallaxUICard startFrame={startFrame} layer={1} totalLayers={3} width={320}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 64,
              color: COLORS.accentOrange,
              textShadow: `0 0 ${25 * glow}px ${COLORS.accentOrange}77`,
            }}
          >
            8%
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              marginTop: 8,
            }}
          >
            screen time left
          </div>
        </div>
      </ParallaxUICard>

      {/* Layer 2: Front - Triggers pie chart */}
      <ParallaxUICard startFrame={startFrame} layer={2} totalLayers={3} width={260}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MiniPieChart size={140} />
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
            }}
          >
            Your Triggers
          </div>
        </div>
      </ParallaxUICard>

      {/* Branding at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: interpolate(relativeFrame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: COLORS.white,
            textShadow: `0 0 20px ${COLORS.accentBlue}55`,
          }}
        >
          <span>Spool</span>
          <span style={{ filter: `drop-shadow(0 0 15px ${COLORS.accentBlue})` }}>🧵</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const CinematicHypeReel = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Scene visibility
  const showTicker = frame < STATS_START + 30;
  const showStats = frame >= STATS_START - 20 && frame < OUTRO_START + 30;
  const showOutro = frame >= OUTRO_START - 20;

  // Stats fade
  const statsFade = frame >= OUTRO_START - 20
    ? interpolate(frame, [OUTRO_START - 20, OUTRO_START], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FontLoader />
      <DarkBackground />

      {/* Ambient background Spool */}
      <AmbientSpool opacity={0.04} />

      {/* Ticker scene (includes intro) */}
      {showTicker && <ExcuseTickerScene />}

      {/* Stats scene */}
      {showStats && (
        <div style={{ opacity: statsFade }}>
          <StatsScene startFrame={STATS_START} />
        </div>
      )}

      {/* Outro scene */}
      {showOutro && <OutroScene startFrame={OUTRO_START} />}

      {/* Transition flashes */}
      <HapticFlashOverlay triggerFrames={[STATS_START, OUTRO_START]} />
    </AbsoluteFill>
  );
};
