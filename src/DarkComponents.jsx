import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  flyThrough,
  snapZoomWithBloom,
  fastCount,
  tilt3D,
  neonPulse,
  parallaxDrift,
  SNAP_SPRING,
} from "./darkAnimations.jsx";

// Color constants
const COLORS = {
  black: "#000000",
  darkBg: "#050505",
  accentBlue: "#8AC9E1",
  accentOrange: "#FE723F",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(138, 201, 225, 0.4)",
};

// Glassmorphism card with neon glow
export const GlassCard = ({
  children,
  width = "90%",
  glowColor = COLORS.accentBlue,
  glowIntensity = 1,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const pulse = neonPulse(frame, 0.08, 0.7, 1);

  return (
    <div
      style={{
        width,
        maxWidth: 450,
        backgroundColor: COLORS.glass,
        borderRadius: 24,
        border: `1px solid ${COLORS.glassBorder}`,
        padding: "28px 32px",
        backdropFilter: "blur(20px)",
        boxShadow: `
          0 0 30px ${glowColor}${Math.round(pulse * glowIntensity * 60).toString(16).padStart(2, '0')},
          0 0 60px ${glowColor}${Math.round(pulse * glowIntensity * 40).toString(16).padStart(2, '0')},
          0 0 100px ${glowColor}${Math.round(pulse * glowIntensity * 20).toString(16).padStart(2, '0')},
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Fly-through excuse card (Z-axis movement)
export const FlyThroughCard = ({
  text,
  startFrame,
  holdDuration = 25,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, z, visible } = flyThrough(frame, fps, startFrame, holdDuration);

  if (!visible) return null;

  const pulse = neonPulse(frame + index * 10, 0.1, 0.5, 1);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translate(-50%, -50%)
          scale(${scale})
          translateZ(${z}px)
        `,
        opacity,
        width: "88%",
        maxWidth: 440,
        perspective: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.glass,
          borderRadius: 24,
          border: `1px solid ${COLORS.glassBorder}`,
          padding: "32px 36px",
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 0 40px ${COLORS.accentBlue}${Math.round(pulse * 70).toString(16).padStart(2, '0')},
            0 0 80px ${COLORS.accentBlue}${Math.round(pulse * 40).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.15)
          `,
        }}
      >
        {/* Accent dot with glow */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: COLORS.accentBlue,
            marginBottom: 16,
            boxShadow: `
              0 0 10px ${COLORS.accentBlue},
              0 0 20px ${COLORS.accentBlue}88,
              0 0 30px ${COLORS.accentBlue}44
            `,
          }}
        />
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 500,
            fontSize: 26,
            color: COLORS.white,
            margin: 0,
            lineHeight: 1.4,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

// Spool icon with snap-zoom and bloom
export const SpoolIcon = ({ startFrame, size = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, bloomIntensity } = snapZoomWithBloom(frame, fps, startFrame);
  const drift = parallaxDrift(frame, 0.15);

  return (
    <>
      {/* White flash bloom */}
      {bloomIntensity > 0 && (
        <div
          style={{
            position: "absolute",
            width: size * 3,
            height: size * 3,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,${bloomIntensity * 0.8}) 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          fontSize: size,
          opacity,
          transform: `
            scale(${scale})
            rotate(${drift.rotation}deg)
            translate(${drift.x * 0.3}px, ${drift.y * 0.3}px)
          `,
          filter: `drop-shadow(0 0 30px ${COLORS.accentBlue}88) drop-shadow(0 0 60px ${COLORS.accentBlue}44)`,
        }}
      >
        🧵
      </div>
    </>
  );
};

// Fast counting stat with bounce
export const FastCountStat = ({
  value,
  label,
  startFrame,
  suffix = "",
  color = COLORS.accentOrange,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Parse numeric value
  const numericValue = parseFloat(value.toString().replace(/,/g, ""));
  const isDecimal = value.toString().includes(".");

  const currentValue = fastCount(frame, fps, startFrame, numericValue, 30);

  // Format
  let displayValue;
  if (isDecimal) {
    displayValue = currentValue.toFixed(1);
  } else {
    displayValue = Math.round(currentValue).toLocaleString();
  }

  // Entry animation
  const entryProgress = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(entryProgress, [0, 0.6, 1], [0.5, 1.1, 1]);
  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pulse = neonPulse(frame, 0.06, 0.8, 1);

  return (
    <div
      style={{
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 72,
          color,
          textShadow: `
            0 0 20px ${color}${Math.round(pulse * 80).toString(16).padStart(2, '0')},
            0 0 40px ${color}${Math.round(pulse * 50).toString(16).padStart(2, '0')},
            0 0 60px ${color}${Math.round(pulse * 30).toString(16).padStart(2, '0')}
          `,
        }}
      >
        {displayValue}{suffix}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 20,
          color: "rgba(255,255,255,0.7)",
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// 3D tilted UI mockup
export const TiltedUICard = ({
  children,
  startFrame,
  tiltX = 12,
  tiltY = -8,
  width = 320,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { rotateX, rotateY, scale, opacity, floatY } = tilt3D(
    frame,
    fps,
    startFrame,
    tiltX,
    tiltY
  );

  if (opacity <= 0) return null;

  const pulse = neonPulse(frame, 0.05, 0.6, 1);

  return (
    <div
      style={{
        width,
        opacity,
        transform: `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(${scale})
          translateY(${floatY}px)
        `,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.glass,
          borderRadius: 20,
          border: `1px solid ${COLORS.glassBorder}`,
          padding: 24,
          backdropFilter: "blur(15px)",
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.5),
            0 0 40px ${COLORS.accentBlue}${Math.round(pulse * 40).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Mini pie chart for outro
export const MiniPieChart = ({ size = 180 }) => {
  const frame = useCurrentFrame();

  const segments = [
    { color: "#FF6B6B", percentage: 36 },
    { color: "#4A9FE8", percentage: 27 },
    { color: "#9B9B9B", percentage: 19 },
    { color: "#FF8FAB", percentage: 9 },
    { color: "#4ECDC4", percentage: 9 },
  ];

  const center = size / 2;
  const radius = size / 2 - 8;

  let cumulative = 0;

  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => {
        const startAngle = (cumulative / 100) * 360 - 90;
        cumulative += seg.percentage;
        const endAngle = (cumulative / 100) * 360 - 90;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        const largeArc = seg.percentage > 50 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={seg.color}
            style={{
              filter: `drop-shadow(0 0 8px ${seg.color}88)`,
            }}
          />
        );
      })}
      <circle cx={center} cy={center} r={radius * 0.4} fill={COLORS.darkBg} />
    </svg>
  );
};

// Kinetic text that snaps in
export const SnapText = ({
  children,
  startFrame,
  fontSize = 36,
  color = COLORS.white,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame - delay;
  if (relativeFrame < 0) return null;

  const progress = interpolate(relativeFrame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Spring-like overshoot manually
  const scale = interpolate(
    progress,
    [0, 0.6, 0.8, 1],
    [0.5, 1.15, 0.95, 1.0]
  );

  const opacity = interpolate(relativeFrame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "Quicksand, sans-serif",
        fontWeight: 700,
        fontSize,
        color,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        textShadow: `0 0 20px ${COLORS.accentBlue}66`,
      }}
    >
      {children}
    </span>
  );
};

export { COLORS };
