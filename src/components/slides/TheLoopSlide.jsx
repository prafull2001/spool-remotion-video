import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// THE LOOP SLIDE - Autopilot Loop Animation
// ============================================

export const TheLoopSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 180, damping: 20 },
  });

  const scale = interpolate(entryProgress, [0, 0.5, 1], [0, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // V11: Extended to 4 seconds (120 frames) - 2.5 rotations (900 degrees) with hold at end
  const pulseAngle = interpolate(relativeFrame, [10, 100], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  // Loop nodes
  const nodes = [
    { emoji: "😩", label: "URGE", angle: -90 },
    { emoji: "👆", label: "THUMB", angle: 0 },
    { emoji: "📱", label: "SCROLL", angle: 90 },
    { emoji: "😔", label: "REGRET", angle: 180 },
  ];

  const loopRadius = 140;
  const centerX = 200;
  const centerY = 200;

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
      {/* Loop container */}
      <div style={{ position: "relative", width: 400, height: 400, marginBottom: 20 }}>
        <svg width={400} height={400}>
          {/* Circular path with arrows */}
          <circle
            cx={centerX}
            cy={centerY}
            r={loopRadius}
            fill="none"
            stroke={COLORS.burntOrange}
            strokeWidth={4}
            strokeDasharray="15 8"
            opacity={0.6}
            style={{ filter: `drop-shadow(0 0 ${10 * glow}px rgba(232, 93, 4, 0.4))` }}
          />

          {/* Arrow heads at each quadrant */}
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = centerX + loopRadius * Math.cos(rad);
            const y = centerY + loopRadius * Math.sin(rad);
            const rotation = angle + 90;
            return (
              <polygon
                key={i}
                points="0,-8 6,4 -6,4"
                fill={COLORS.burntOrange}
                transform={`translate(${x}, ${y}) rotate(${rotation})`}
                opacity={0.8}
              />
            );
          })}

          {/* Traveling pulse */}
          <circle
            cx={centerX + loopRadius * Math.cos((pulseAngle * Math.PI) / 180)}
            cy={centerY + loopRadius * Math.sin((pulseAngle * Math.PI) / 180)}
            r={12}
            fill={COLORS.burntOrange}
            style={{ filter: `drop-shadow(0 0 15px rgba(232, 93, 4, 0.8))` }}
          />
        </svg>

        {/* Node labels */}
        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = centerX + (loopRadius + 50) * Math.cos(rad);
          const y = centerY + (loopRadius + 50) * Math.sin(rad);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 4 }}>{node.emoji}</div>
              <div
                style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: COLORS.charcoal,
                  opacity: 0.8,
                }}
              >
                {node.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main text */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: COLORS.charcoal,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Your brain runs this loop <span style={{ color: COLORS.burntOrange }}>150x</span> a day.
      </div>

      {/* Subtext */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 26,
          color: COLORS.charcoal,
          opacity: 0.6,
          marginTop: 15,
          textAlign: "center",
        }}
      >
        On complete autopilot.
      </div>
    </AbsoluteFill>
  );
};
