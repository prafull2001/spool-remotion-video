import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRINGS, pulseGlow } from "./animations.jsx";

// Trigger category icons (matching your app)
const TRIGGERS = [
  { name: "Entertainment", icon: "▶️", color: "#FF6B6B", percentage: 36 },
  { name: "Social", icon: "👥", color: "#4A9FE8", percentage: 27 },
  { name: "Boredom", icon: "🌙", color: "#9B9B9B", percentage: 19 },
  { name: "FOMO", icon: "🔥", color: "#FF8FAB", percentage: 9 },
  { name: "Quick Check", icon: "👁️", color: "#4ECDC4", percentage: 9 },
];

// Single trigger badge that floats in
export const TriggerBadge = ({
  trigger,
  startFrame = 0,
  x = 0,
  y = 0,
  scale: baseScale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SPRINGS.bouncy,
  });

  const scale = interpolate(progress, [0, 0.6, 1], [0, 1.15, 1]) * baseScale;
  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Floating motion
  const float = Math.sin((frame + x) * 0.03) * 8;
  const floatX = Math.cos((frame + y) * 0.025) * 5;

  const glow = pulseGlow(frame, 0.05, 0.3, 0.7);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale}) translate(${floatX}px, ${float}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          boxShadow: `
            0 8px 24px rgba(0,0,0,0.1),
            0 0 40px ${trigger.color}${Math.round(glow * 99).toString(16).padStart(2, '0')}
          `,
          border: `2px solid ${trigger.color}33`,
          minWidth: 100,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: `${trigger.color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {trigger.icon}
        </div>
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#3D3D3D",
          }}
        >
          {trigger.name}
        </div>
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: trigger.color,
          }}
        >
          {trigger.percentage}%
        </div>
      </div>
    </div>
  );
};

// Animated pie chart
export const TriggerPieChart = ({ startFrame = 0, size = 280 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SPRINGS.smooth,
  });

  const scale = interpolate(progress, [0, 0.7, 1], [0.5, 1.05, 1]);
  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rotation = interpolate(progress, [0, 1], [-90, 0]);

  // Calculate pie segments
  let cumulativePercentage = 0;
  const segments = TRIGGERS.map((trigger) => {
    const startAngle = (cumulativePercentage / 100) * 360;
    cumulativePercentage += trigger.percentage;
    const endAngle = (cumulativePercentage / 100) * 360;
    return { ...trigger, startAngle, endAngle };
  });

  const center = size / 2;
  const radius = size / 2 - 10;

  // Animated draw progress for each segment
  const drawProgress = interpolate(relativeFrame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        filter: `drop-shadow(0 0 30px rgba(138, 201, 225, 0.5))`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, i) => {
          const segmentProgress = Math.min(
            1,
            Math.max(0, (drawProgress * 100 - (segment.startAngle / 360) * 100) / segment.percentage)
          );

          if (segmentProgress <= 0) return null;

          const effectiveEndAngle =
            segment.startAngle +
            (segment.endAngle - segment.startAngle) * segmentProgress;

          const startRad = (segment.startAngle * Math.PI) / 180;
          const endRad = (effectiveEndAngle * Math.PI) / 180;

          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);

          const largeArc = effectiveEndAngle - segment.startAngle > 180 ? 1 : 0;

          const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          return (
            <path
              key={i}
              d={path}
              fill={segment.color}
              style={{
                filter: `drop-shadow(0 0 10px ${segment.color}88)`,
              }}
            />
          );
        })}
        {/* Center circle */}
        <circle cx={center} cy={center} r={radius * 0.45} fill="#FDF6EE" />
      </svg>
    </div>
  );
};

// Social media icons that fly in
export const SocialIcons = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const socials = [
    { icon: "𝕏", color: "#000000", name: "X" },
    { icon: "📸", color: "#E4405F", name: "Instagram" },
    { icon: "🎵", color: "#000000", name: "TikTok" },
    { icon: "in", color: "#0A66C2", name: "LinkedIn" },
  ];

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {socials.map((social, i) => {
        const delay = i * 5;
        const itemFrame = relativeFrame - delay;
        if (itemFrame < 0) return null;

        const progress = spring({
          frame: itemFrame,
          fps,
          config: SPRINGS.snappy,
        });

        const scale = interpolate(progress, [0, 0.6, 1], [0, 1.2, 1]);
        const translateY = interpolate(progress, [0, 1], [40, 0]);
        const opacity = interpolate(itemFrame, [0, 5], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Float
        const float = Math.sin((frame + i * 30) * 0.04) * 4;

        return (
          <div
            key={i}
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: social.icon === "in" ? 24 : 28,
              fontWeight: 700,
              color: social.color,
              opacity,
              transform: `scale(${scale}) translateY(${translateY + float}px)`,
              boxShadow: `
                0 4px 16px rgba(0,0,0,0.1),
                0 0 30px ${social.color}33
              `,
              fontFamily: social.icon === "in" ? "Arial, sans-serif" : "inherit",
            }}
          >
            {social.icon}
          </div>
        );
      })}
    </div>
  );
};

// Spooli mascot with bounce
export const Spooli = ({ startFrame = 0, size = 200, mood = "happy" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SPRINGS.bouncy,
  });

  const scale = interpolate(progress, [0, 0.5, 0.8, 1], [0, 1.2, 0.9, 1]);
  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bounce animation
  const bounce = Math.abs(Math.sin(frame * 0.08)) * 10;
  // Slight rotation wobble
  const wobble = Math.sin(frame * 0.1) * 3;

  return (
    <div
      style={{
        fontSize: size,
        opacity,
        transform: `scale(${scale}) translateY(${-bounce}px) rotate(${wobble}deg)`,
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))",
      }}
    >
      🧵
    </div>
  );
};

export { TRIGGERS };
