import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// THE BREAK SLIDE - Voice Waveform Breaks Loop
// ============================================

export const TheBreakSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Waveform slash animation (enters from left)
  const waveformProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 300, damping: 18, mass: 0.8 },
  });
  const waveformX = interpolate(waveformProgress, [0, 1], [-400, 0]);

  // Loop break animation (starts after waveform enters)
  const breakDelay = 8;
  const breakProgress = interpolate(relativeFrame, [breakDelay, breakDelay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loopOpacity = 1 - breakProgress;
  const loopSpread = breakProgress * 80;

  // V11: Text stagger - main text appears first, subtext 0.5s (15 frames) later
  const mainTextOpacity = interpolate(relativeFrame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtextOpacity = interpolate(relativeFrame, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  // Waveform bars (animated)
  const waveformBars = Array.from({ length: 20 }, (_, i) => {
    const baseHeight = 20 + Math.sin(i * 0.8) * 15;
    const animatedHeight = baseHeight + Math.sin((frame * 0.3) + i * 0.5) * 12;
    return Math.max(8, animatedHeight);
  });

  const centerX = 200;
  const centerY = 200;
  const loopRadius = 120;

  // Loop segment positions (break apart)
  const segments = [
    { angle: -90, dx: 0, dy: -1 },
    { angle: 0, dx: 1, dy: 0 },
    { angle: 90, dx: 0, dy: 1 },
    { angle: 180, dx: -1, dy: 0 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Loop container (breaking apart) */}
      <div style={{ position: "relative", width: 400, height: 400, marginBottom: 20 }}>
        <svg width={400} height={400}>
          {/* Loop segments (breaking) */}
          {segments.map((seg, i) => {
            const startAngle = seg.angle - 45;
            const endAngle = seg.angle + 45;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + loopRadius * Math.cos(startRad);
            const y1 = centerY + loopRadius * Math.sin(startRad);
            const x2 = centerX + loopRadius * Math.cos(endRad);
            const y2 = centerY + loopRadius * Math.sin(endRad);

            const offsetX = seg.dx * loopSpread;
            const offsetY = seg.dy * loopSpread;

            return (
              <path
                key={i}
                d={`M ${x1 + offsetX} ${y1 + offsetY} A ${loopRadius} ${loopRadius} 0 0 1 ${x2 + offsetX} ${y2 + offsetY}`}
                fill="none"
                stroke={COLORS.burntOrange}
                strokeWidth={4}
                opacity={loopOpacity * 0.6}
              />
            );
          })}
        </svg>

        {/* Waveform slashing through */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(calc(-50% + ${waveformX}px), -50%)`,
            display: "flex",
            alignItems: "center",
            gap: 3,
            height: 80,
          }}
        >
          {waveformBars.map((height, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height,
                backgroundColor: COLORS.burntOrange,
                borderRadius: 3,
                boxShadow: `0 0 ${8 * glow}px rgba(232, 93, 4, 0.5)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main text - V11: staggered appearance */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 56,
          color: COLORS.charcoal,
          textAlign: "center",
          marginTop: 10,
          opacity: mainTextOpacity,
          transform: `translateY(${interpolate(mainTextOpacity, [0, 1], [20, 0])}px)`,
        }}
      >
        One sentence <span style={{ color: COLORS.burntOrange }}>breaks it.</span>
      </div>

      {/* Subtext - V11: appears 0.5s after main text */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 26,
          color: COLORS.burntOrange,
          marginTop: 20,
          textAlign: "center",
          opacity: subtextOpacity,
          transform: `translateY(${interpolate(subtextOpacity, [0, 1], [15, 0])}px)`,
        }}
      >
        Your voice activates your prefrontal cortex.
      </div>
    </AbsoluteFill>
  );
};
