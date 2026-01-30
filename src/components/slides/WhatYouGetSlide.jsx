import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// WHAT YOU GET SLIDE - Feature Cards
// V13: Shows actual app value with 4 feature cards
// ============================================

const FEATURES = [
  {
    icon: "📊",
    title: "Weekly Insights",
    subtitle: "& Nudges",
  },
  {
    icon: "🧠",
    title: "Daily Trigger",
    subtitle: "Reports",
  },
  {
    icon: "💪",
    title: "Elite Discipline",
    subtitle: "Builder",
  },
  {
    icon: "🎯",
    title: "Emotional Trigger",
    subtitle: "Breakdowns",
  },
];

const FeatureCard = ({ icon, title, subtitle, delay, glow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { stiffness: 180, damping: 14 },
  });

  const cardScale = interpolate(cardProgress, [0, 0.5, 1], [0.5, 1.08, 1.0]);
  const cardOpacity = interpolate(cardProgress, [0, 0.3, 1], [0, 0.8, 1]);
  const cardY = interpolate(cardProgress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        width: 420,
        backgroundColor: COLORS.white,
        border: `3px solid ${COLORS.burntOrange}`,
        borderRadius: 24,
        padding: "28px 24px",
        textAlign: "center",
        boxShadow: `
          0 6px 25px rgba(232, 93, 4, 0.12),
          0 0 ${20 * glow}px rgba(232, 93, 4, ${glow * 0.15})
        `,
        opacity: cardOpacity,
        transform: `scale(${cardScale}) translateY(${cardY}px)`,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 26,
          color: COLORS.charcoal,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 22,
          color: COLORS.burntOrange,
          marginTop: 4,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export const WhatYouGetSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 180, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.5, 1], [0.85, 1.03, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.04, 0.6, 1);

  // Stagger delays for cards (6 frames = 200ms between each)
  const cardDelays = [
    startFrame + 15,
    startFrame + 21,
    startFrame + 27,
    startFrame + 33,
  ];

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
      {/* Title */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 52,
          color: COLORS.charcoal,
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        What <span style={{ color: COLORS.burntOrange }}>Spool</span> gives you:
      </div>

      {/* 2x2 Grid of Feature Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 25,
          maxWidth: 900,
        }}
      >
        {FEATURES.map((feature, i) => (
          <FeatureCard
            key={i}
            icon={feature.icon}
            title={feature.title}
            subtitle={feature.subtitle}
            delay={cardDelays[i]}
            glow={glow}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
