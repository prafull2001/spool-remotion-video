import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRINGS, pulseGlow } from "./animations.jsx";

export const GlowCard = ({
  children,
  startFrame = 0,
  glowColor = "#8AC9E1",
  glowIntensity = 0.6,
  width = "85%",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Snap-in animation with overshoot
  const scaleProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRINGS.snappy,
  });

  // Overshoot effect
  const scale = interpolate(
    scaleProgress,
    [0, 0.6, 1],
    [0.3, 1.08, 1]
  );

  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Y slide from bottom
  const translateY = interpolate(
    scaleProgress,
    [0, 1],
    [60, 0]
  );

  // Pulsing glow
  const glowPulse = pulseGlow(frame, 0.08, 0.4, glowIntensity);

  return (
    <div
      style={{
        width,
        maxWidth: 400,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: "24px 28px",
          boxShadow: `
            0 4px 12px rgba(0,0,0,0.08),
            0 0 40px rgba(138, 201, 225, ${glowPulse}),
            0 0 80px rgba(138, 201, 225, ${glowPulse * 0.5})
          `,
          border: "2px solid rgba(138, 201, 225, 0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Inner glow highlight */}
        <div
          style={{
            position: "absolute",
            top: -50,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 100,
            background: `radial-gradient(ellipse, rgba(138, 201, 225, ${glowPulse * 0.3}) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        {children}
      </div>
    </div>
  );
};

// Excuse card with dramatic entrance
export const ExcuseCardDramatic = ({
  text,
  startFrame = 0,
  exitFrame = null,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Exit animation
  const effectiveExitFrame = exitFrame || startFrame + 90;
  const isExiting = frame > effectiveExitFrame;

  if (frame > effectiveExitFrame + 20) return null;

  // Entry spring
  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRINGS.snappy,
  });

  // Exit animation
  const exitProgress = isExiting
    ? interpolate(frame, [effectiveExitFrame, effectiveExitFrame + 15], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;

  const scale = interpolate(entryProgress, [0, 0.7, 1], [0.5, 1.05, 1]) * (1 - exitProgress * 0.3);
  const opacity = Math.min(1, entryProgress * 2) * (1 - exitProgress);
  const translateY = interpolate(entryProgress, [0, 1], [80, 0]) - exitProgress * 50;
  const rotate = interpolate(entryProgress, [0, 1], [-5, 0]) + exitProgress * 3;

  // Subtle float
  const float = Math.sin((frame + index * 20) * 0.05) * 3;

  return (
    <div
      style={{
        opacity,
        transform: `
          scale(${scale})
          translateY(${translateY + float}px)
          rotate(${rotate}deg)
        `,
        width: "88%",
        maxWidth: 420,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: "22px 26px",
          boxShadow: `
            0 8px 24px rgba(0,0,0,0.1),
            0 0 60px rgba(138, 201, 225, 0.4)
          `,
          border: "2px solid rgba(138, 201, 225, 0.4)",
        }}
      >
        {/* Blue accent dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#8AC9E1",
            marginBottom: 12,
            boxShadow: "0 0 10px rgba(138, 201, 225, 0.8)",
          }}
        />
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 500,
            fontSize: 24,
            color: "#3D3D3D",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};
