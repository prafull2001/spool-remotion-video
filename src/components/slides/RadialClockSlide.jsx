import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// RADIAL CLOCK - Late Night Scrolling
// V13: Fixed spacing - 40px gaps above/below clock
// ============================================

export const RadialClockSlide = ({ startFrame }) => {
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
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Clock segment data
  const segments = [
    { label: "Late Night", hours: "12am-6am", percent: 35, startAngle: -90, color: COLORS.burntOrange },
    { label: "Morning", hours: "6am-12pm", percent: 12, startAngle: 0, color: "rgba(45, 45, 45, 0.15)" },
    { label: "Afternoon", hours: "12pm-6pm", percent: 22, startAngle: 90, color: "rgba(45, 45, 45, 0.2)" },
    { label: "Evening", hours: "6pm-12am", percent: 31, startAngle: 180, color: "rgba(45, 45, 45, 0.25)" },
  ];

  // V13: Slightly smaller clock for better spacing
  const clockSize = 380;
  const centerX = clockSize / 2;
  const centerY = clockSize / 2;
  const radius = 150;

  // Animate segment fills
  const segmentProgress = interpolate(relativeFrame, [10, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.04, 0.6, 1);

  // Create arc path
  const createArc = (startAngle, endAngle, r) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = centerX + r * Math.cos(start);
    const y1 = centerY + r * Math.sin(start);
    const x2 = centerX + r * Math.cos(end);
    const y2 = centerY + r * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 40px",
        backgroundColor: COLORS.cream,
      }}
    >
      {/* MAIN TITLE - 35% stat at top */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: COLORS.charcoal,
          textAlign: "center",
          maxWidth: 850,
          lineHeight: 1.25,
          marginBottom: 45, // V13: 45px gap before clock
        }}
      >
        <span style={{ color: COLORS.burntOrange, fontSize: 60 }}>35%</span> of mindless scrolling
        <br />
        happens <span style={{ color: COLORS.burntOrange }}>late at night</span>
      </div>

      {/* Radial Clock */}
      <div style={{ position: "relative", width: clockSize, height: clockSize }}>
        <svg width={clockSize} height={clockSize}>
          {/* Background circle */}
          <circle cx={centerX} cy={centerY} r={radius + 20} fill="rgba(74, 200, 245, 0.08)" />

          {/* Segments */}
          {segments.map((seg, i) => {
            const segmentAngle = 90;
            const animatedAngle = segmentAngle * segmentProgress;
            const endAngle = seg.startAngle + animatedAngle;

            return (
              <path
                key={i}
                d={createArc(seg.startAngle, endAngle, radius)}
                fill={seg.color}
                style={{
                  filter: i === 0 ? `drop-shadow(0 0 ${20 * glow}px rgba(74, 200, 245, 0.6))` : "none",
                }}
              />
            );
          })}

          {/* Center circle */}
          <circle cx={centerX} cy={centerY} r={55} fill={COLORS.cream} />

          {/* Clock hands/markers */}
          <line x1={centerX} y1={centerY - 50} x2={centerX} y2={centerY - radius - 12} stroke="rgba(45,45,45,0.25)" strokeWidth="2" />
          <line x1={centerX + 50} y1={centerY} x2={centerX + radius + 12} y2={centerY} stroke="rgba(45,45,45,0.25)" strokeWidth="2" />
          <line x1={centerX} y1={centerY + 50} x2={centerX} y2={centerY + radius + 12} stroke="rgba(45,45,45,0.25)" strokeWidth="2" />
          <line x1={centerX - 50} y1={centerY} x2={centerX - radius - 12} y2={centerY} stroke="rgba(45,45,45,0.25)" strokeWidth="2" />
        </svg>

        {/* Center percentage */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 800,
              fontSize: 44,
              color: COLORS.burntOrange,
              textShadow: `0 0 ${15 * glow}px rgba(74, 200, 245, ${glow * 0.4})`,
            }}
          >
            35%
          </div>
          <div
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: COLORS.charcoal,
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            Late Night
          </div>
        </div>

        {/* Time labels */}
        <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", fontFamily: "Quicksand, sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.charcoal, opacity: 0.7 }}>12am</div>
        <div style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", fontFamily: "Quicksand, sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.charcoal, opacity: 0.7 }}>6am</div>
        <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", fontFamily: "Quicksand, sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.charcoal, opacity: 0.7 }}>12pm</div>
        <div style={{ position: "absolute", left: -40, top: "50%", transform: "translateY(-50%)", fontFamily: "Quicksand, sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.charcoal, opacity: 0.7 }}>6pm</div>
      </div>

      {/* V13: 45px gap after clock */}

      {/* "Take back your late nights" - prominent */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 52,
          color: COLORS.burntOrange,
          marginTop: 45, // V13: 45px gap after clock
          textAlign: "center",
          textShadow: `0 0 ${18 * glow}px rgba(74, 200, 245, ${glow * 0.35})`,
        }}
      >
        Take back your late nights 🌙
      </div>

      {/* Spool stat */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 28,
          color: COLORS.charcoal,
          marginTop: 25,
          textAlign: "center",
          padding: "14px 32px",
          backgroundColor: "rgba(74, 200, 245, 0.08)",
          borderRadius: 35,
          border: `2px solid ${COLORS.burntOrange}`,
        }}
      >
        Spool users save an average of{" "}
        <span style={{ color: COLORS.burntOrange, fontWeight: 800, fontSize: 34 }}>2.3 hours</span>{" "}
        per week
      </div>
    </AbsoluteFill>
  );
};
