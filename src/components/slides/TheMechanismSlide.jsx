import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";
import { StudyBadge } from "../StudyBadge.jsx";

// ============================================
// THE MECHANISM SLIDE - React → Respond Visual
// V13: Replaced confusing brain diagram with clear before/after
// ============================================

export const TheMechanismSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 180, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.5, 1], [0.8, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Transition animation for React → Respond (V14: slower transition, hold longer)
  const transitionDelay = 25;
  const transitionDuration = 45;
  const transitionProgress = interpolate(
    relativeFrame,
    [transitionDelay, transitionDelay + transitionDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Left side (React/Impulse) dims
  const reactOpacity = interpolate(transitionProgress, [0, 0.5, 1], [1, 0.9, 0.4]);
  const reactScale = interpolate(transitionProgress, [0, 1], [1, 0.9]);

  // Right side (Respond/Choice) lights up
  const respondOpacity = interpolate(transitionProgress, [0, 0.5, 1], [0.4, 0.8, 1]);
  const respondScale = interpolate(transitionProgress, [0.3, 1], [0.9, 1], { extrapolateLeft: "clamp" });

  // Arrow animation
  const arrowProgress = interpolate(transitionProgress, [0.2, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.04, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 40px",
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Main headline */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 56,
          color: COLORS.charcoal,
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 50,
        }}
      >
        Speak the urge. <span style={{ color: COLORS.burntOrange }}>Kill the impulse.</span>
      </div>

      {/* React → Respond Visual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          marginBottom: 50,
        }}
      >
        {/* LEFT: React (Impulse) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: reactOpacity,
            transform: `scale(${reactScale})`,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              backgroundColor: "rgba(220, 80, 80, 0.15)",
              border: "4px solid rgba(220, 80, 80, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: transitionProgress < 0.5
                ? `0 0 ${30 * glow}px rgba(220, 80, 80, 0.4)`
                : "none",
            }}
          >
            <span style={{ fontSize: 80 }}>😤</span>
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 800,
              fontSize: 32,
              color: "rgba(220, 80, 80, 0.9)",
              marginTop: 16,
            }}
          >
            REACT
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              color: COLORS.charcoal,
              opacity: 0.6,
              marginTop: 4,
            }}
          >
            (Impulse)
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(arrowProgress, [0, 0.3, 1], [0.3, 0.7, 1]),
          }}
        >
          <svg width="100" height="60" viewBox="0 0 100 60">
            <defs>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(220, 80, 80, 0.6)" />
                <stop offset="100%" stopColor={COLORS.burntOrange} />
              </linearGradient>
            </defs>
            {/* Arrow line */}
            <line
              x1="0"
              y1="30"
              x2={interpolate(arrowProgress, [0, 1], [0, 70])}
              y2="30"
              stroke="url(#arrowGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Arrow head */}
            <polygon
              points="70,20 90,30 70,40"
              fill={COLORS.burntOrange}
              opacity={arrowProgress}
            />
          </svg>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: COLORS.burntOrange,
              marginTop: 8,
              opacity: arrowProgress,
            }}
          >
            Your voice
          </div>
        </div>

        {/* RIGHT: Respond (Choice) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: respondOpacity,
            transform: `scale(${respondScale})`,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              backgroundColor: `rgba(74, 200, 245, ${0.1 + transitionProgress * 0.15})`,
              border: `4px solid ${COLORS.burntOrange}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: transitionProgress > 0.5
                ? `0 0 ${35 * glow}px rgba(74, 200, 245, ${0.3 + transitionProgress * 0.3})`
                : "none",
            }}
          >
            <span style={{ fontSize: 80 }}>🧠</span>
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 800,
              fontSize: 32,
              color: COLORS.burntOrange,
              marginTop: 16,
              textShadow: transitionProgress > 0.5
                ? `0 0 ${15 * glow}px rgba(74, 200, 245, 0.4)`
                : "none",
            }}
          >
            RESPOND
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              color: COLORS.charcoal,
              opacity: 0.6,
              marginTop: 4,
            }}
          >
            (Choice)
          </div>
        </div>
      </div>

      {/* Explanation text */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 28,
          color: COLORS.charcoal,
          textAlign: "center",
          maxWidth: 700,
          lineHeight: 1.5,
          marginBottom: 40,
          opacity: 0.85,
        }}
      >
        Your voice shifts control from{" "}
        <span style={{ color: "rgba(220, 80, 80, 0.9)", fontWeight: 700 }}>impulse</span> to{" "}
        <span style={{ color: COLORS.burntOrange, fontWeight: 700 }}>choice</span>
      </div>

      {/* Study Badge - V14: BIGGER */}
      <StudyBadge
        title="UCLA Affect Labeling Research"
        citation="Lieberman et al., 2007"
        scale={1.3}
      />
    </AbsoluteFill>
  );
};
