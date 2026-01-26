import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ExcuseCard, DIRECTIONS } from "./ExcuseCard.jsx";
import { StatsReveal } from "./StatsReveal.jsx";
import { FontLoader } from "./fonts.jsx";

// Real excuses from Spool users
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

// Header component
const Header = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const y = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
    },
  });

  const translateY = interpolate(y, [0, 1], [-50, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: "0 20px",
      }}
    >
      {/* Spooli watching */}
      <div
        style={{
          fontSize: 50,
          marginBottom: 16,
        }}
      >
        🧵
      </div>

      <h1
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 30,
          color: "#3D3D3D",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        Real excuses people give
      </h1>
      <h2
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: "#8AC9E1",
          margin: "8px 0 0 0",
        }}
      >
        to unlock their phones
      </h2>
    </div>
  );
};

// Floating decoration elements
const FloatingEmoji = ({ emoji, x, y, delay, size = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const floatY = Math.sin((frame + delay) * 0.05) * 10;
  const opacity = interpolate(frame, [delay, delay + 30], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: size,
        opacity,
        transform: `translateY(${floatY}px)`,
      }}
    >
      {emoji}
    </div>
  );
};

export const ExcuseTicker = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate excuse timing - show excuses for the first ~80% of video
  const excusePhaseEnd = durationInFrames * 0.78;
  const statsStart = excusePhaseEnd;

  // Generate excuse cards with varied timing and positions
  const excuseCards = EXCUSES.slice(0, 12).map((excuse, index) => {
    // Stagger start times
    const startFrame = 40 + index * 70;

    // Vary Y positions (keeping them in the middle area)
    const baseY = 320;
    const yVariation = (index % 3 - 1) * 80;
    const yPosition = baseY + yVariation;

    // Cycle through animation directions
    const directions = [DIRECTIONS.LEFT, DIRECTIONS.RIGHT, DIRECTIONS.POP];
    const direction = directions[index % 3];

    return {
      text: excuse,
      startFrame,
      yPosition,
      direction,
      duration: 85,
    };
  });

  // Background fade for stats section
  const bgDarken = interpolate(
    frame,
    [statsStart - 30, statsStart],
    [0, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FDF6EE",
        overflow: "hidden",
      }}
    >
      <FontLoader />
      {/* Subtle background pattern/decoration */}
      <FloatingEmoji emoji="📱" x="10%" y="15%" delay={0} size={24} />
      <FloatingEmoji emoji="💭" x="85%" y="25%" delay={20} size={28} />
      <FloatingEmoji emoji="😅" x="8%" y="70%" delay={40} size={26} />
      <FloatingEmoji emoji="🫠" x="88%" y="65%" delay={60} size={24} />
      <FloatingEmoji emoji="📵" x="15%" y="85%" delay={80} size={22} />
      <FloatingEmoji emoji="⏰" x="82%" y="80%" delay={100} size={24} />

      {/* Header - visible during excuse phase */}
      {frame < statsStart && <Header />}

      {/* Excuse cards */}
      {frame < statsStart + 30 &&
        excuseCards.map((card, index) => (
          <ExcuseCard
            key={index}
            text={card.text}
            startFrame={card.startFrame}
            duration={card.duration}
            direction={card.direction}
            yPosition={card.yPosition}
          />
        ))}

      {/* Overlay for transition */}
      {bgDarken > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(253, 246, 238, ${bgDarken})`,
          }}
        />
      )}

      {/* Stats reveal at the end */}
      <StatsReveal startFrame={statsStart} />

      {/* Bottom branding */}
      {frame > 30 && frame < statsStart - 30 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#3D3D3D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span>Spool</span>
            <span style={{ color: "#8AC9E1" }}>🧵</span>
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#666666",
              marginTop: 4,
            }}
          >
            mindful screen time
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
