import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// TYPE OR SPEAK SLIDE
// V20: New slide explaining the core mechanic
// ============================================

// Keyboard icon component
const KeyboardIcon = ({ size = 80, color }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70">
    {/* Keyboard body */}
    <rect x="5" y="10" width="90" height="50" rx="8" fill={color} opacity="0.15" stroke={color} strokeWidth="3" />
    {/* Keys row 1 */}
    <rect x="12" y="18" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="28" y="18" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="44" y="18" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="60" y="18" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="76" y="18" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    {/* Keys row 2 */}
    <rect x="15" y="32" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="31" y="32" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="47" y="32" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    <rect x="63" y="32" width="12" height="10" rx="2" fill={color} opacity="0.6" />
    {/* Spacebar */}
    <rect x="25" y="46" width="50" height="10" rx="2" fill={color} opacity="0.8" />
  </svg>
);

// Microphone icon component
const MicIcon = ({ size = 80, color, frame }) => {
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: `scale(${pulse})` }}>
      {/* Mic body */}
      <rect x="28" y="10" width="24" height="35" rx="12" fill={color} />
      {/* Stand arc */}
      <path
        d="M20 35 Q20 55 40 55 Q60 55 60 35"
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Stand */}
      <line x1="40" y1="55" x2="40" y2="70" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="70" x2="52" y2="70" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

export const TypeOrSpeakSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Entry animation
  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 180, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.5, 1], [0.8, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Icon animations
  const keyboardDelay = 15;
  const keyboardProgress = spring({
    frame: Math.max(0, relativeFrame - keyboardDelay),
    fps,
    config: { stiffness: 200, damping: 16 },
  });
  const keyboardY = interpolate(keyboardProgress, [0, 1], [30, 0]);
  const keyboardOpacity = interpolate(keyboardProgress, [0, 1], [0, 1]);

  const micDelay = 25;
  const micProgress = spring({
    frame: Math.max(0, relativeFrame - micDelay),
    fps,
    config: { stiffness: 200, damping: 16 },
  });
  const micY = interpolate(micProgress, [0, 1], [30, 0]);
  const micOpacity = interpolate(micProgress, [0, 1], [0, 1]);

  // Text animation
  const textDelay = 35;
  const textProgress = spring({
    frame: Math.max(0, relativeFrame - textDelay),
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [20, 0]);

  const glow = glowPulse(frame, 0.04, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 50px",
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 64,
          color: COLORS.charcoal,
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        How it works
      </div>

      {/* Icons container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          marginBottom: 50,
        }}
      >
        {/* Keyboard */}
        <div
          style={{
            opacity: keyboardOpacity,
            transform: `translateY(${keyboardY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <KeyboardIcon size={120} color={COLORS.spoolBlue} />
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.spoolBlue,
              marginTop: 16,
            }}
          >
            Type
          </div>
        </div>

        {/* OR divider */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            fontSize: 32,
            color: COLORS.charcoal,
            opacity: 0.5,
          }}
        >
          or
        </div>

        {/* Microphone */}
        <div
          style={{
            opacity: micOpacity,
            transform: `translateY(${micY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MicIcon size={100} color={COLORS.spoolBlue} frame={relativeFrame} />
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.spoolBlue,
              marginTop: 16,
            }}
          >
            Speak
          </div>
        </div>
      </div>

      {/* Main instruction text */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 42,
            color: COLORS.charcoal,
            lineHeight: 1.4,
            marginBottom: 20,
          }}
        >
          Tell us{" "}
          <span style={{ color: COLORS.spoolBlue }}>why</span>{" "}
          you want access
        </div>
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 500,
            fontSize: 32,
            color: COLORS.charcoal,
            opacity: 0.75,
            lineHeight: 1.5,
          }}
        >
          to your blocked app
        </div>
      </div>

      {/* Subtle bottom decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: COLORS.spoolBlue,
          opacity: 0.8,
          textShadow: `0 0 ${10 * glow}px rgba(74, 200, 245, 0.3)`,
        }}
      >
        This creates a moment of reflection
      </div>
    </AbsoluteFill>
  );
};
