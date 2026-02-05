import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";
import { StudyBadge } from "../StudyBadge.jsx";

// ============================================
// SUCCESS RATE SLIDE - 2.9x More Likely
// V13: Removed phone mockup, cleaner centered layout
// ============================================

// Microphone icon with animated pulse rings
const MicrophoneIcon = ({ size = 120, glow, frame }) => {
  // Pulsing animation for the rings
  const pulse1 = Math.sin(frame * 0.15) * 0.5 + 0.5;
  const pulse2 = Math.sin(frame * 0.15 + 1) * 0.5 + 0.5;
  const pulse3 = Math.sin(frame * 0.15 + 2) * 0.5 + 0.5;

  // Scale bounce for microphone
  const micBounce = 1 + Math.sin(frame * 0.1) * 0.02;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Pulse rings behind microphone */}
      <circle
        cx="50"
        cy="40"
        r={25 + pulse1 * 15}
        fill="none"
        stroke={COLORS.burntOrange}
        strokeWidth="2"
        opacity={0.3 * (1 - pulse1)}
      />
      <circle
        cx="50"
        cy="40"
        r={25 + pulse2 * 20}
        fill="none"
        stroke={COLORS.burntOrange}
        strokeWidth="2"
        opacity={0.25 * (1 - pulse2)}
      />
      <circle
        cx="50"
        cy="40"
        r={25 + pulse3 * 25}
        fill="none"
        stroke={COLORS.burntOrange}
        strokeWidth="2"
        opacity={0.2 * (1 - pulse3)}
      />

      {/* Microphone body */}
      <g transform={`translate(50, 40) scale(${micBounce}) translate(-50, -40)`}>
        <rect x="38" y="15" width="24" height="40" rx="12" fill={COLORS.burntOrange} />
        {/* Microphone stand arc */}
        <path
          d="M28 45 Q28 70 50 70 Q72 70 72 45"
          stroke={COLORS.burntOrange}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Stand */}
        <line x1="50" y1="70" x2="50" y2="85" stroke={COLORS.burntOrange} strokeWidth="5" strokeLinecap="round" />
        <line x1="35" y1="85" x2="65" y2="85" stroke={COLORS.burntOrange} strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export const SuccessRateSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 200, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.5, 1], [0.7, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Count up animation for 2.9x
  const countDelay = 10;
  const countProgress = interpolate(relativeFrame, [countDelay, countDelay + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const easedCount = 1 - Math.pow(1 - countProgress, 3);
  const displayMultiplier = (2.9 * easedCount).toFixed(1);

  const glow = glowPulse(frame, 0.05, 0.6, 1);

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
      {/* Microphone icon with animated pulse */}
      <div style={{ marginBottom: 25 }}>
        <MicrophoneIcon size={130} glow={glow} frame={relativeFrame} />
      </div>

      {/* "Speak it out" label */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: COLORS.burntOrange,
          marginBottom: 30,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        Speak it out
      </div>

      {/* HUGE 2.9x stat */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 200,
          color: COLORS.burntOrange,
          textShadow: `0 4px 30px rgba(74, 200, 245, ${0.3 + glow * 0.2})`,
          lineHeight: 0.9,
        }}
      >
        {displayMultiplier}x
      </div>

      {/* Headline */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: COLORS.charcoal,
          marginTop: 15,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        MORE LIKELY TO NOT SCROLL
      </div>

      {/* Explanation text */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 32,
          color: COLORS.charcoal,
          marginTop: 35,
          textAlign: "center",
          maxWidth: 850,
          lineHeight: 1.4,
          opacity: 0.85,
        }}
      >
        Speaking your reason creates a mental{" "}
        <span style={{ color: COLORS.burntOrange, fontWeight: 700 }}>"speed bump"</span>{" "}
        that interrupts the autopilot loop.
      </div>

      {/* Study Badge - V14: BIGGER */}
      <div style={{ marginTop: 45 }}>
        <StudyBadge
          title="NYU Implementation Intentions"
          citation="Gollwitzer & Sheeran, 2006"
          scale={1.3}
        />
      </div>
    </AbsoluteFill>
  );
};
