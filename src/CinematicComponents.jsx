import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import {
  flyThroughZ,
  screenShake,
  hapticFlash,
  slamEffect,
  parallaxLayer,
  glowPulse,
  motionBlurStyle,
  SNAP_SPRING,
  SLAM_SPRING,
} from "./cinematicAnimations.jsx";

// Colors
const COLORS = {
  black: "#000000",
  accentBlue: "#8AC9E1",
  accentOrange: "#FE723F",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.06)",
  glassBorder: "rgba(138, 201, 225, 0.5)",
};

// ============================================
// GHOSTED BACKGROUND EXCUSES
// ============================================

export const GhostedExcuses = ({ excuses, opacity = 0.08 }) => {
  const frame = useCurrentFrame();

  // Create floating ghosted versions at various depths
  const ghostedItems = excuses.slice(0, 8).map((text, i) => {
    // Position and movement parameters
    const baseX = ((i * 137) % 80) - 40; // -40 to 40
    const baseY = ((i * 89) % 120) - 10; // -10 to 110
    const depth = 0.3 + (i % 4) * 0.15;

    // Slow drift animation
    const driftX = Math.sin((frame + i * 50) * 0.008) * 30;
    const driftY = Math.cos((frame + i * 70) * 0.006) * 20;
    const driftRotate = Math.sin((frame + i * 30) * 0.004) * 5;

    return {
      text: text.substring(0, 40) + (text.length > 40 ? "..." : ""),
      x: baseX + driftX,
      y: baseY + driftY,
      rotate: driftRotate,
      scale: depth,
      opacity: opacity * depth,
    };
  });

  return (
    <>
      {ghostedItems.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${50 + item.x}%`,
            top: `${item.y}%`,
            transform: `
              translate(-50%, 0)
              scale(${item.scale})
              rotate(${item.rotate}deg)
            `,
            opacity: item.opacity,
            fontFamily: "Quicksand, sans-serif",
            fontSize: 18,
            color: COLORS.accentBlue,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            textShadow: `0 0 20px ${COLORS.accentBlue}44`,
          }}
        >
          "{item.text}"
        </div>
      ))}
    </>
  );
};

// ============================================
// FLY-THROUGH EXCUSE CARD
// ============================================

export const FlyThroughExcuseCard = ({
  text,
  startFrame,
  duration,
  isFinal = false,
  onScreenCallback,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, z, blur, visible } = flyThroughZ(
    frame,
    startFrame,
    duration,
    isFinal
  );

  if (!visible) return null;

  const glow = glowPulse(frame, 0.1, 0.6, 1);

  // 3D tilt
  const tiltX = isFinal ? 8 : 10;
  const tiltY = isFinal ? -4 : -5;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translate(-50%, -50%)
          scale(${scale})
          perspective(1200px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
        `,
        opacity,
        width: "90%",
        maxWidth: 480,
        ...motionBlurStyle(blur),
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.glass,
          borderRadius: 28,
          border: `2px solid ${COLORS.glassBorder}`,
          padding: isFinal ? "40px 44px" : "32px 36px",
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 0 ${40 * glow}px ${COLORS.accentBlue}${Math.round(glow * 60).toString(16).padStart(2, '0')},
            0 0 ${80 * glow}px ${COLORS.accentBlue}${Math.round(glow * 35).toString(16).padStart(2, '0')},
            0 0 ${120 * glow}px ${COLORS.accentBlue}${Math.round(glow * 15).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.2)
          `,
        }}
      >
        {/* Glowing accent line */}
        <div
          style={{
            width: 50,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.accentBlue,
            marginBottom: 20,
            boxShadow: `
              0 0 15px ${COLORS.accentBlue},
              0 0 30px ${COLORS.accentBlue}88
            `,
          }}
        />
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: isFinal ? 600 : 500,
            fontSize: isFinal ? 30 : 26,
            color: COLORS.white,
            margin: 0,
            lineHeight: 1.4,
            textShadow: `
              0 0 20px ${COLORS.accentBlue}66,
              0 2px 10px rgba(0,0,0,0.5)
            `,
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

// ============================================
// HAPTIC FLASH OVERLAY
// ============================================

export const HapticFlashOverlay = ({ triggerFrames }) => {
  const frame = useCurrentFrame();

  // Calculate combined flash intensity from all triggers
  let totalFlash = 0;
  triggerFrames.forEach((triggerFrame) => {
    totalFlash = Math.max(totalFlash, hapticFlash(frame, triggerFrame, 5));
  });

  if (totalFlash <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.white,
        opacity: totalFlash,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};

// ============================================
// SCREEN SHAKE WRAPPER
// ============================================

export const ScreenShakeWrapper = ({ children, triggerFrames, intensity = 15 }) => {
  const frame = useCurrentFrame();

  // Calculate combined shake from all triggers
  let totalShake = { x: 0, y: 0, rotation: 0 };

  triggerFrames.forEach((triggerFrame) => {
    const shake = screenShake(frame, triggerFrame, intensity, 6);
    totalShake.x += shake.x;
    totalShake.y += shake.y;
    totalShake.rotation += shake.rotation;
  });

  return (
    <div
      style={{
        transform: `translate(${totalShake.x}px, ${totalShake.y}px) rotate(${totalShake.rotation}deg)`,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// SLAM STAT
// ============================================

export const SlamStat = ({
  value,
  label,
  startFrame,
  color = COLORS.accentOrange,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, y, shakeIntensity } = slamEffect(frame, fps, startFrame);

  if (opacity <= 0) return null;

  // Fast count effect
  const relativeFrame = frame - startFrame;
  const numericValue = parseFloat(value.toString().replace(/,/g, ""));

  // Count accelerates then snaps to final
  const countProgress = interpolate(relativeFrame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const easedCount = 1 - Math.pow(1 - countProgress, 4);
  const displayValue = Math.round(numericValue * easedCount).toLocaleString();

  const glow = glowPulse(frame, 0.06, 0.7, 1);

  // Screen shake from slam
  const shake = screenShake(frame, startFrame + 8, shakeIntensity, 8);

  return (
    <div
      style={{
        textAlign: "center",
        opacity,
        transform: `
          scale(${scale})
          translateY(${y}px)
          translate(${shake.x}px, ${shake.y}px)
          rotate(${shake.rotation}deg)
        `,
      }}
    >
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 100,
          color,
          textShadow: `
            0 0 ${30 * glow}px ${color}${Math.round(glow * 90).toString(16).padStart(2, '0')},
            0 0 ${60 * glow}px ${color}${Math.round(glow * 60).toString(16).padStart(2, '0')},
            0 0 ${100 * glow}px ${color}${Math.round(glow * 30).toString(16).padStart(2, '0')}
          `,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: "rgba(255,255,255,0.8)",
          marginTop: 8,
          textShadow: "0 0 15px rgba(138, 201, 225, 0.5)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============================================
// PARALLAX UI CARD
// ============================================

export const ParallaxUICard = ({
  children,
  startFrame,
  layer = 0,
  totalLayers = 3,
  width = 300,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, z, rotateX, rotateY, y } = parallaxLayer(
    frame,
    fps,
    startFrame,
    layer,
    totalLayers
  );

  if (opacity <= 0) return null;

  const glow = glowPulse(frame + layer * 20, 0.05, 0.5, 0.9);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        width,
        opacity,
        transform: `
          translateX(-50%)
          translateY(${y}px)
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(${scale})
          translateZ(${z}px)
        `,
        transformStyle: "preserve-3d",
        zIndex: totalLayers - layer,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.glass,
          borderRadius: 24,
          border: `2px solid ${COLORS.glassBorder}`,
          padding: 28,
          backdropFilter: "blur(15px)",
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.4),
            0 0 ${40 * glow}px ${COLORS.accentBlue}${Math.round(glow * 40).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.15)
          `,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ============================================
// MINI PIE CHART
// ============================================

export const MiniPieChart = ({ size = 160 }) => {
  const frame = useCurrentFrame();
  const glow = glowPulse(frame, 0.07, 0.6, 1);

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
    <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 20px ${COLORS.accentBlue}44)` }}>
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
              filter: `drop-shadow(0 0 ${10 * glow}px ${seg.color}aa)`,
            }}
          />
        );
      })}
      <circle cx={center} cy={center} r={radius * 0.35} fill="#050505" />
    </svg>
  );
};

// ============================================
// AMBIENT SPOOL (background)
// ============================================

export const AmbientSpool = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();

  const rotation = frame * 0.05;
  const pulse = glowPulse(frame, 0.03, 0.8, 1.2);
  const drift = Math.sin(frame * 0.01) * 20;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        fontSize: 500,
        opacity: opacity * pulse,
        transform: `
          translate(-50%, -50%)
          rotate(${rotation}deg)
          translateY(${drift}px)
        `,
        filter: `blur(3px) drop-shadow(0 0 100px ${COLORS.accentBlue}22)`,
        pointerEvents: "none",
      }}
    >
      🧵
    </div>
  );
};

export { COLORS };
