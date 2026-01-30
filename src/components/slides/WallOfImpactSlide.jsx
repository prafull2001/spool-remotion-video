import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// WALL OF IMPACT - Combined Stats (Results First)
// ============================================

export const WallOfImpactSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 250, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.5, 1], [0.7, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Rapid count-up for sessions (0.3s = 9 frame delay)
  const countDelay = 9;
  const sessionsProgress = interpolate(relativeFrame, [countDelay + 5, countDelay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sessionsEased = 1 - Math.pow(1 - sessionsProgress, 3);
  const sessionsValue = Math.round(3500 * sessionsEased).toLocaleString();

  // Rapid count-up for days (staggered)
  const daysProgress = interpolate(relativeFrame, [countDelay + 15, countDelay + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const daysEased = 1 - Math.pow(1 - daysProgress, 3);
  const daysValue = Math.round(110 * daysEased);

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Mascot */}
      <Img
        src={staticFile("spooli_jumping.png")}
        style={{
          width: 140,
          height: "auto",
          marginBottom: 30,
          filter: `drop-shadow(0 8px 25px rgba(232, 93, 4, ${glow * 0.3}))`,
        }}
      />

      {/* Sessions stat */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 140,
          color: COLORS.burntOrange,
          textShadow: `0 0 ${30 * glow}px rgba(232, 93, 4, ${glow * 0.5})`,
          lineHeight: 1,
        }}
      >
        {sessionsValue}+
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 36,
          color: COLORS.charcoal,
          textTransform: "uppercase",
          letterSpacing: 3,
          marginTop: 10,
        }}
      >
        SCROLLING SESSIONS INTERRUPTED
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 28,
          color: "#3B82F6",
          marginTop: 8,
        }}
      >
        with Spool
      </div>

      {/* Divider */}
      <div
        style={{
          width: 120,
          height: 4,
          backgroundColor: COLORS.burntOrange,
          borderRadius: 2,
          marginTop: 35,
          marginBottom: 35,
          opacity: 0.6,
        }}
      />

      {/* Days stat */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 120,
          color: COLORS.burntOrange,
          textShadow: `0 0 ${25 * glow}px rgba(232, 93, 4, ${glow * 0.4})`,
          lineHeight: 1,
        }}
      >
        {daysValue}+
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          color: COLORS.charcoal,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginTop: 10,
        }}
      >
        DAYS SAVED
      </div>
    </AbsoluteFill>
  );
};
