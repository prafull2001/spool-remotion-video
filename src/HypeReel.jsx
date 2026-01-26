import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { FontLoader } from "./fonts.jsx";
import { parallaxDrift, neonPulse } from "./darkAnimations.jsx";
import {
  COLORS,
  FlyThroughCard,
  SpoolIcon,
  FastCountStat,
  TiltedUICard,
  MiniPieChart,
  SnapText,
  GlassCard,
} from "./DarkComponents.jsx";

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
  "I have to post a meme on my Instagram page to get my company growing",
  "i want to play fortnite bc i'm broed",
  "To see if my friend sent me something",
  "Need to check a brand collaboration request for my food blog",
  "I want to see how the videos i posted are doing",
  "Logging onto twitter to see if something else happened",
  "It's morning I'm ready to wake up and I want some time",
];

// Animated dark background with subtle grid
const DarkBackground = () => {
  const frame = useCurrentFrame();
  const drift = parallaxDrift(frame, 0.08);

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
      {/* Subtle radial gradient */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 800,
          height: 800,
          transform: `translate(-50%, -50%) translate(${drift.x}px, ${drift.y}px)`,
          background: `radial-gradient(circle, ${COLORS.accentBlue}08 0%, transparent 60%)`,
        }}
      />

      {/* Floating ambient Spool in background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          fontSize: 400,
          opacity: 0.03,
          transform: `
            translate(-50%, -50%)
            rotate(${drift.rotation * 2}deg)
            translate(${drift.x * 0.5}px, ${drift.y * 0.5}px)
          `,
          filter: "blur(2px)",
        }}
      >
        🧵
      </div>

      {/* Grid lines (very subtle) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(138, 201, 225, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 201, 225, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translate(${drift.x * 0.2}px, ${drift.y * 0.2}px)`,
        }}
      />
    </div>
  );
};

// Scene 1: Intro with snap-zoom Spool
const SceneIntro = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SpoolIcon startFrame={0} size={140} />

      <div style={{ height: 50 }} />

      <div style={{ textAlign: "center" }}>
        <SnapText startFrame={20} fontSize={42} delay={0}>
          Real excuses
        </SnapText>
        <div style={{ height: 12 }} />
        <SnapText startFrame={20} fontSize={32} color={COLORS.accentBlue} delay={8}>
          people tell Spool
        </SnapText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Rapid-fire excuse ticker with Z-axis fly-through
const SceneExcuseTicker = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rapid fire timing - each excuse visible for ~28 frames, new one every 30 frames
  const excuseTimings = EXCUSES.map((text, i) => ({
    text,
    startFrame: startFrame + i * 30,
    holdDuration: 28,
  }));

  return (
    <AbsoluteFill>
      {excuseTimings.map((excuse, i) => (
        <FlyThroughCard
          key={i}
          text={excuse.text}
          startFrame={excuse.startFrame}
          holdDuration={excuse.holdDuration}
          index={i}
        />
      ))}
    </AbsoluteFill>
  );
};

// Scene 3: Stats with fast count
const SceneStats = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Scene fade in
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        padding: 40,
      }}
    >
      {/* Header */}
      <SnapText startFrame={startFrame} fontSize={28} color="rgba(255,255,255,0.6)">
        We've collected
      </SnapText>

      <div style={{ height: 40 }} />

      {/* Main stat */}
      <FastCountStat
        value="3313"
        label="excuses"
        startFrame={startFrame + 10}
        color={COLORS.accentOrange}
      />

      <div style={{ height: 60 }} />

      {/* Secondary stats row */}
      <div style={{ display: "flex", gap: 60 }}>
        <FastCountStat
          value="9.1"
          label="days requested"
          startFrame={startFrame + 40}
          suffix=" days"
          color={COLORS.accentBlue}
        />
        <FastCountStat
          value="179"
          label="users"
          startFrame={startFrame + 55}
          color={COLORS.accentBlue}
        />
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: 3D tilted UI outro
const SceneOutro = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        gap: 40,
        padding: 40,
      }}
    >
      {/* Dashboard mockup - tilted left */}
      <TiltedUICard
        startFrame={startFrame}
        tiltX={10}
        tiltY={-12}
        width={340}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🧵</div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 48,
              color: COLORS.accentOrange,
              textShadow: `0 0 20px ${COLORS.accentOrange}66`,
            }}
          >
            8%
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            screen time left
          </div>
        </div>
      </TiltedUICard>

      {/* Pie chart - tilted right */}
      <TiltedUICard
        startFrame={startFrame + 15}
        tiltX={8}
        tiltY={10}
        width={280}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MiniPieChart size={160} />
        </div>
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Your Triggers
        </div>
      </TiltedUICard>

      {/* Branding */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <SnapText startFrame={startFrame + 40} fontSize={40}>
          Spool
        </SnapText>
        <div
          style={{
            fontSize: 40,
            opacity: interpolate(relativeFrame, [45, 55], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: `drop-shadow(0 0 15px ${COLORS.accentBlue})`,
          }}
        >
          🧵
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Flash transition
const FlashTransition = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - triggerFrame;

  if (relativeFrame < 0 || relativeFrame > 8) return null;

  const opacity = interpolate(relativeFrame, [0, 2, 8], [0, 0.9, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.white,
        opacity,
        zIndex: 1000,
        pointerEvents: "none",
      }}
    />
  );
};

// Main composition
export const HypeReel = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Scene timings
  const INTRO_START = 0;
  const INTRO_END = 70;

  const TICKER_START = 60;
  const TICKER_END = TICKER_START + (EXCUSES.length * 30) + 30; // ~610

  const STATS_START = 620;
  const STATS_END = 780;

  const OUTRO_START = 770;

  // Visibility flags with crossfade
  const showIntro = frame < INTRO_END + 20;
  const showTicker = frame >= TICKER_START - 10 && frame < TICKER_END + 20;
  const showStats = frame >= STATS_START - 10 && frame < STATS_END + 20;
  const showOutro = frame >= OUTRO_START - 10;

  // Intro fade out
  const introOpacity = interpolate(
    frame,
    [INTRO_END - 10, INTRO_END + 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ticker fade
  const tickerOpacity = frame < TICKER_START
    ? 0
    : frame > TICKER_END
      ? interpolate(frame, [TICKER_END, TICKER_END + 15], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  // Stats fade
  const statsOpacity = frame < STATS_START
    ? 0
    : frame > STATS_END
      ? interpolate(frame, [STATS_END, STATS_END + 15], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  return (
    <AbsoluteFill>
      <FontLoader />
      <DarkBackground />

      {/* Intro */}
      {showIntro && (
        <div style={{ opacity: introOpacity }}>
          <SceneIntro />
        </div>
      )}

      {/* Ticker */}
      {showTicker && (
        <div style={{ opacity: tickerOpacity }}>
          <SceneExcuseTicker startFrame={TICKER_START} />
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <div style={{ opacity: statsOpacity }}>
          <SceneStats startFrame={STATS_START} />
        </div>
      )}

      {/* Outro */}
      {showOutro && <SceneOutro startFrame={OUTRO_START} />}

      {/* Flash transitions */}
      <FlashTransition triggerFrame={TICKER_START} />
      <FlashTransition triggerFrame={STATS_START} />
      <FlashTransition triggerFrame={OUTRO_START} />
    </AbsoluteFill>
  );
};
