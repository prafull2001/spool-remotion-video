import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { glowPulse } from "../cleanAnimations.jsx";
import { COLORS } from "./colors.js";

// ============================================
// MASCOT IMAGES
// ============================================

export const MASCOT_IMAGES = {
  shock: staticFile("spooli_shock.png"),
  smirk: staticFile("smirk.png"),
  jumping: staticFile("spooli_jumping.png"),
  wave: staticFile("spooli_wave.png"),
};

// ============================================
// REACTIVE MASCOT (reacts to excuses)
// ============================================

const getMascotForIndex = (index) => {
  if (index < 3) return "smirk"; // Intro phase - smirking
  if (index < 8) return "shock"; // Mid acceleration - shocked
  return "smirk"; // Fast phase - back to smirk
};

export const ReactiveMascot = ({ currentExcuseIndex, opacity = 1 }) => {
  const frame = useCurrentFrame();

  const mascotKey = getMascotForIndex(currentExcuseIndex);
  const mascotSrc = MASCOT_IMAGES[mascotKey];

  // Subtle floating animation
  const floatY = Math.sin(frame * 0.05) * 8;
  const floatScale = 1 + Math.sin(frame * 0.03) * 0.02;

  // Glow pulse
  const glow = glowPulse(frame, 0.04, 0.4, 0.8);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${floatY}px) scale(${floatScale})`,
        opacity: opacity * 0.6,
        filter: `drop-shadow(0 0 ${40 * glow}px ${COLORS.accentBlue}55) drop-shadow(0 0 ${80 * glow}px ${COLORS.accentBlue}33)`,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Img
        src={mascotSrc}
        style={{
          width: 320,
          height: "auto",
        }}
      />
    </div>
  );
};

// ============================================
// OUTRO MASCOT (jumping with bounce)
// ============================================

export const OutroMascot = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Bounce in animation with overshoot
  const bounceProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      stiffness: 200,
      damping: 12,
      mass: 1,
    },
  });

  const scale = interpolate(bounceProgress, [0, 0.5, 0.8, 1], [0.3, 1.15, 0.95, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(bounceProgress, [0, 1], [-100, 0]);

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
        filter: `drop-shadow(0 4px 20px rgba(74, 200, 245, ${glow * 0.3}))`,
      }}
    >
      <Img
        src={MASCOT_IMAGES.jumping}
        style={{
          width: 220,
          height: "auto",
        }}
      />
    </div>
  );
};

// ============================================
// WAVING MASCOT (intro)
// ============================================

export const WavingMascot = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;

  // Bounce in
  const bounceProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      stiffness: 180,
      damping: 14,
      mass: 1,
    },
  });

  const scale = interpolate(bounceProgress, [0, 0.6, 1], [0, 1.1, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Gentle wave animation (side to side tilt)
  const waveRotation = Math.sin(frame * 0.15) * 3;

  const glow = glowPulse(frame, 0.04, 0.5, 0.8);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${waveRotation}deg)`,
        filter: `drop-shadow(0 8px 30px rgba(74, 200, 245, ${glow * 0.25}))`,
      }}
    >
      <Img
        src={MASCOT_IMAGES.wave}
        style={{
          width: 380,
          height: "auto",
        }}
      />
    </div>
  );
};
