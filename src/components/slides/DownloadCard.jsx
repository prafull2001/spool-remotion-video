import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";
import { AppStoreBadge } from "../Utility.jsx";

// ============================================
// DOWNLOAD CARD (Full Screen CTA Component)
// V15: Restored App Store badge with "Join 600+ users"
// ============================================

export const DownloadCard = ({
  startFrame,
  appName = "Spool",
  tagline = "Unwind wisely 🧵",
  socialProof = "Join over 600+ users.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Slide up and fade in
  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      stiffness: 180,
      damping: 18,
      mass: 1,
    },
  });

  const scale = interpolate(entryProgress, [0, 0.6, 1], [0.85, 1.02, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(entryProgress, [0, 1], [60, 0]);

  const glow = glowPulse(frame, 0.04, 0.6, 1);

  // Badge subtle pulse
  const badgePulse = 1 + Math.sin(frame * 0.08) * 0.015;

  // Heart pulse animation
  const heartPulse = 1 + Math.sin(frame * 0.12) * 0.08;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 50px",
        backgroundColor: COLORS.cream,
      }}
    >
      {/* Full screen content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Mascot - larger for full screen */}
        <Img
          src={staticFile("spooli_jumping.png")}
          style={{
            width: 260,
            height: "auto",
            marginBottom: 35,
            filter: `drop-shadow(0 8px 30px rgba(74, 200, 245, ${glow * 0.4}))`,
          }}
        />

        {/* App name - larger */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 72,
            color: COLORS.charcoal,
            marginBottom: 16,
          }}
        >
          {appName}
        </div>

        {/* Tagline - burnt orange accent */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            fontSize: 32,
            color: COLORS.burntOrange,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {tagline}
        </div>

        {/* Social proof - LARGE and PROMINENT */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 42,
            color: COLORS.burntOrange,
            marginBottom: 45,
            textAlign: "center",
            textShadow: `0 0 ${15 * glow}px rgba(74, 200, 245, 0.3)`,
          }}
        >
          {socialProof}
        </div>

        {/* Apple App Store Badge - Larger with pulse */}
        <div
          style={{
            transform: `scale(${badgePulse})`,
            filter: `drop-shadow(0 6px 20px rgba(0, 0, 0, 0.25))`,
          }}
        >
          <AppStoreBadge width={380} />
        </div>

        {/* Heart emoji below */}
        <div
          style={{
            fontSize: 50,
            marginTop: 35,
            transform: `scale(${heartPulse})`,
          }}
        >
          🧡
        </div>
      </div>
    </AbsoluteFill>
  );
};
