import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { FontLoader } from "./fonts.jsx";
import { SPRINGS } from "./animations.jsx";
import { ExcuseCardDramatic } from "./GlowCard.jsx";
import { SnapText, StaggerText, ImpactText, CountUp } from "./KineticText.jsx";
import { TriggerBadge, TriggerPieChart, SocialIcons, Spooli, TRIGGERS } from "./AppUI.jsx";

// Excuses with more variety
const EXCUSES = [
  "i need to stalk my ex's new girl!!!!!",
  "Just peeing and scrolling while i'm peeing honestly",
  "I am so bored during this work call I need to scroll",
  "Going onto X to feed my mind with slop",
  "Just woke up and I wanna see what's going on",
  "Just wanna scroll one more time before i go to sleep",
  "I need to look at X because nothing ever happens",
  "i need to like my dads instagram post",
  "i want to play fortnite bc i'm broed",
  "Logging onto twitter to see if something else happened",
  "I need to stalk my best friends ex boy friend",
  "I'm gonna just reach out to the friend that I have on TikTok",
];

// Background with animated gradient
const AnimatedBackground = () => {
  const frame = useCurrentFrame();

  // Subtle gradient shift
  const hue1 = 30 + Math.sin(frame * 0.01) * 5;
  const hue2 = 35 + Math.cos(frame * 0.015) * 5;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(
          ${135 + Math.sin(frame * 0.005) * 10}deg,
          hsl(${hue1}, 60%, 96%) 0%,
          hsl(${hue2}, 55%, 94%) 50%,
          hsl(${hue1 + 5}, 50%, 95%) 100%
        )`,
      }}
    />
  );
};

// Floating particles for atmosphere
const Particles = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 15 }, (_, i) => ({
    x: (i * 73) % 100,
    y: (i * 47 + frame * 0.3) % 120 - 10,
    size: 3 + (i % 4) * 2,
    opacity: 0.1 + (i % 3) * 0.05,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "#8AC9E1",
            opacity: p.opacity,
            filter: "blur(1px)",
          }}
        />
      ))}
    </>
  );
};

// Scene 1: Opening hook
const SceneOpening = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <Spooli startFrame={startFrame} size={120} />
      <div style={{ height: 40 }} />
      <StaggerText
        text="What people tell us"
        startFrame={startFrame + 15}
        fontSize={38}
        color="#3D3D3D"
        staggerDelay={3}
      />
      <div style={{ height: 16 }} />
      <StaggerText
        text="to unlock their phones"
        startFrame={startFrame + 35}
        fontSize={32}
        color="#8AC9E1"
        weight={600}
        staggerDelay={3}
      />
    </AbsoluteFill>
  );
};

// Scene 2: Excuse rapid-fire
const SceneExcuses = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Show excuses in rapid succession
  const excuseTimings = EXCUSES.slice(0, 8).map((excuse, i) => ({
    text: excuse,
    startFrame: startFrame + i * 55,
    exitFrame: startFrame + i * 55 + 50,
  }));

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      {excuseTimings.map((excuse, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ExcuseCardDramatic
            text={excuse.text}
            startFrame={excuse.startFrame}
            exitFrame={excuse.exitFrame}
            index={i}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// Scene 3: Triggers reveal
const SceneTriggersReveal = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Fade in whole scene
  const sceneOpacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: sceneOpacity,
        padding: 30,
      }}
    >
      {/* Header */}
      <div style={{ position: "absolute", top: 120 }}>
        <SnapText
          startFrame={startFrame}
          fontSize={32}
          color="#3D3D3D"
          weight={700}
        >
          Why do they reach?
        </SnapText>
      </div>

      {/* Pie chart in center */}
      <div style={{ marginTop: 40 }}>
        <TriggerPieChart startFrame={startFrame + 20} size={300} />
      </div>

      {/* Trigger badges floating around */}
      <TriggerBadge
        trigger={TRIGGERS[0]}
        startFrame={startFrame + 50}
        x={60}
        y={200}
        scale={0.9}
      />
      <TriggerBadge
        trigger={TRIGGERS[1]}
        startFrame={startFrame + 58}
        x={280}
        y={150}
        scale={0.85}
      />
      <TriggerBadge
        trigger={TRIGGERS[2]}
        startFrame={startFrame + 66}
        x={180}
        y={420}
        scale={0.8}
      />
    </AbsoluteFill>
  );
};

// Scene 4: Stats finale
const SceneStats = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const sceneOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: sceneOpacity,
        padding: 40,
      }}
    >
      <SnapText
        startFrame={startFrame}
        fontSize={28}
        color="#666666"
        weight={600}
      >
        We've collected
      </SnapText>

      <div style={{ height: 30 }} />

      <CountUp
        value="3,313"
        startFrame={startFrame + 15}
        duration={40}
        fontSize={80}
        color="#FE723F"
      />

      <SnapText
        startFrame={startFrame + 20}
        fontSize={24}
        color="#3D3D3D"
        weight={600}
        delay={10}
      >
        excuses
      </SnapText>

      <div style={{ height: 50 }} />

      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <CountUp
            value="9.1"
            startFrame={startFrame + 50}
            duration={30}
            fontSize={48}
            color="#8AC9E1"
            suffix=" days"
          />
          <SnapText
            startFrame={startFrame + 55}
            fontSize={16}
            color="#666666"
            weight={500}
            delay={15}
          >
            screen time requested
          </SnapText>
        </div>

        <div style={{ textAlign: "center" }}>
          <CountUp
            value="179"
            startFrame={startFrame + 60}
            duration={30}
            fontSize={48}
            color="#8AC9E1"
          />
          <SnapText
            startFrame={startFrame + 65}
            fontSize={16}
            color="#666666"
            weight={500}
            delay={15}
          >
            users
          </SnapText>
        </div>
      </div>

      <div style={{ height: 60 }} />

      <SocialIcons startFrame={startFrame + 90} />

      {/* Spool branding */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Spooli startFrame={startFrame + 100} size={50} />
        <SnapText
          startFrame={startFrame + 105}
          fontSize={36}
          color="#3D3D3D"
          weight={700}
        >
          Spool
        </SnapText>
      </div>
    </AbsoluteFill>
  );
};

// Transition flash
const FlashTransition = ({ frame: triggerFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - triggerFrame;

  if (relativeFrame < 0 || relativeFrame > 10) return null;

  const opacity = interpolate(relativeFrame, [0, 3, 10], [0, 0.8, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#FFFFFF",
        opacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};

// Main composition
export const ExcuseTickerDramatic = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Scene timings (in frames)
  const SCENE_OPENING_START = 0;
  const SCENE_EXCUSES_START = 90;
  const SCENE_TRIGGERS_START = 550;
  const SCENE_STATS_START = 750;

  // Scene visibility
  const showOpening = frame < SCENE_EXCUSES_START + 30;
  const showExcuses = frame >= SCENE_EXCUSES_START - 10 && frame < SCENE_TRIGGERS_START + 30;
  const showTriggers = frame >= SCENE_TRIGGERS_START - 10 && frame < SCENE_STATS_START + 30;
  const showStats = frame >= SCENE_STATS_START - 10;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FontLoader />
      <AnimatedBackground />
      <Particles />

      {/* Scenes */}
      {showOpening && <SceneOpening startFrame={SCENE_OPENING_START} />}
      {showExcuses && <SceneExcuses startFrame={SCENE_EXCUSES_START} />}
      {showTriggers && <SceneTriggersReveal startFrame={SCENE_TRIGGERS_START} />}
      {showStats && <SceneStats startFrame={SCENE_STATS_START} />}

      {/* Transition flashes */}
      <FlashTransition frame={SCENE_EXCUSES_START} />
      <FlashTransition frame={SCENE_TRIGGERS_START} />
      <FlashTransition frame={SCENE_STATS_START} />
    </AbsoluteFill>
  );
};
