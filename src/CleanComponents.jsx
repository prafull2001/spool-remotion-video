import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from "remotion";
import {
  flyThroughClean,
  dropIn,
  glowPulse,
  slamDrop,
  getScreenShake,
  CLEAN_SPRING,
  SNAP_SPRING,
  SLAM_SPRING,
} from "./cleanAnimations.jsx";

// ============================================
// COLORS
// ============================================

const COLORS = {
  black: "#000000",
  accentBlue: "#8AC9E1",
  accentOrange: "#FE723F",
  white: "#FFFFFF",
  gray: "rgba(255, 255, 255, 0.6)",
  glass: "rgba(255, 255, 255, 0.06)",
  glassBorder: "rgba(138, 201, 225, 0.4)",
};

// ============================================
// CLEAN EXCUSE CARD
// ============================================

export const CleanExcuseCard = ({
  text,
  startFrame,
  duration,
  velocity = 0,
  isBrake = false,
}) => {
  const frame = useCurrentFrame();

  const { scale, opacity, y, blur, visible } = flyThroughClean(
    frame,
    startFrame,
    duration,
    velocity,
    isBrake
  );

  if (!visible) return null;

  const glow = glowPulse(frame, 0.08, 0.5, 0.9);

  // 30% larger scale for "loud" mobile readability
  const sizeMultiplier = 1.30;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${scale * sizeMultiplier}) translateY(${y}px)`,
        opacity,
        width: "95%",
        maxWidth: 560,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.glass,
          borderRadius: 28,
          border: `2px solid ${COLORS.glassBorder}`,
          padding: isBrake ? "42px 44px" : "34px 38px",
          backdropFilter: "blur(18px)",
          boxShadow: `
            0 0 ${35 * glow}px ${COLORS.accentBlue}${Math.round(glow * 55).toString(16).padStart(2, '0')},
            0 0 ${70 * glow}px ${COLORS.accentBlue}${Math.round(glow * 30).toString(16).padStart(2, '0')},
            inset 0 1px 0 rgba(255,255,255,0.18)
          `,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 50,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.accentBlue,
            marginBottom: 18,
            boxShadow: `0 0 16px ${COLORS.accentBlue}`,
          }}
        />
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: isBrake ? 700 : 600,
            fontSize: isBrake ? 34 : 30,
            color: COLORS.white,
            margin: 0,
            lineHeight: 1.4,
            textShadow: "0 3px 10px rgba(0,0,0,0.5)",
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

// ============================================
// HERO SPOOL ICON
// ============================================

export const HeroSpool = ({ startFrame, blurred = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, y } = dropIn(frame, fps, startFrame, 0);

  if (!opacity) return null;

  const glow = glowPulse(frame, 0.05, 0.7, 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
        filter: blurred ? "blur(4px)" : "none",
      }}
    >
      <div
        style={{
          fontSize: 100,
          filter: `drop-shadow(0 0 ${40 * glow}px ${COLORS.accentBlue}66)`,
        }}
      >
        🧵
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          color: COLORS.white,
          marginTop: 12,
          textShadow: `0 0 20px ${COLORS.accentBlue}44`,
        }}
      >
        Spool
      </div>
    </div>
  );
};

// ============================================
// STAT ITEM (for grid)
// ============================================

export const StatItem = ({ value, label, startFrame, delay = 0, color = COLORS.accentOrange }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, y, visible } = dropIn(frame, fps, startFrame, delay);

  if (!visible) return null;

  // Fast count effect
  const relativeFrame = frame - startFrame - delay;
  const numericValue = parseFloat(value.toString().replace(/,/g, ""));
  const isDecimal = value.toString().includes(".");

  const countProgress = interpolate(relativeFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const easedCount = 1 - Math.pow(1 - countProgress, 3);
  const currentValue = numericValue * easedCount;

  let displayValue;
  if (isDecimal) {
    displayValue = currentValue.toFixed(1);
  } else {
    displayValue = Math.round(currentValue).toLocaleString();
  }

  const glow = glowPulse(frame + delay, 0.05, 0.6, 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 56,
          color,
          textShadow: `
            0 0 ${20 * glow}px ${color}${Math.round(glow * 70).toString(16).padStart(2, '0')},
            0 0 ${40 * glow}px ${color}${Math.round(glow * 40).toString(16).padStart(2, '0')}
          `,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: COLORS.gray,
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============================================
// SLAM STAT (vertical stacked with heavy impact)
// ============================================

export const SlamStat = ({ value, label, startFrame, delay = 0, color = COLORS.accentOrange }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, y, shakeIntensity, visible } = slamDrop(frame, fps, startFrame, delay);

  if (!visible) return null;

  // Counting animation
  const relativeFrame = frame - startFrame - delay;
  const numericValue = parseFloat(value.toString().replace(/,/g, ""));
  const isDecimal = value.toString().includes(".");

  const countProgress = interpolate(relativeFrame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const easedCount = 1 - Math.pow(1 - countProgress, 3);
  const currentValue = numericValue * easedCount;

  let displayValue;
  if (isDecimal) {
    displayValue = currentValue.toFixed(1);
  } else {
    displayValue = Math.round(currentValue).toLocaleString();
  }

  // Screen shake on impact
  const shake = getScreenShake(shakeIntensity, frame);

  const glow = glowPulse(frame + delay, 0.04, 0.7, 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `
          scale(${scale})
          translateY(${y + shake.y}px)
          translateX(${shake.x}px)
        `,
      }}
    >
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 86,
          color,
          textShadow: `
            0 0 ${30 * glow}px ${color}${Math.round(glow * 80).toString(16).padStart(2, '0')},
            0 0 ${60 * glow}px ${color}${Math.round(glow * 50).toString(16).padStart(2, '0')},
            0 4px 20px rgba(0,0,0,0.5)
          `,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 22,
          color: COLORS.gray,
          marginTop: 10,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============================================
// VERTICAL STATS STACK (fills the screen)
// ============================================

export const VerticalStatsStack = ({ startFrame }) => {
  const frame = useCurrentFrame();

  // Stats data for sequential rendering via map
  // Staggered at frame X, X+10, X+20 as specified
  const stats = [
    { value: "3,313", label: "Excuses", color: COLORS.accentOrange, delay: 0 },
    { value: "9.1", label: "Days Saved", color: COLORS.accentBlue, delay: 10 },
    { value: "179", label: "Users", color: COLORS.accentBlue, delay: 20 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        width: "100%",
      }}
    >
      {stats.map((stat, index) => (
        <SlamStat
          key={index}
          value={stat.value}
          label={stat.label}
          startFrame={startFrame}
          delay={stat.delay}
          color={stat.color}
        />
      ))}
    </div>
  );
};

// ============================================
// STATS GRID (3-column layout) - LEGACY
// ============================================

export const StatsGrid = ({ startFrame }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        width: "100%",
        padding: "0 30px",
      }}
    >
      <StatItem
        value="3,313"
        label="Excuses"
        startFrame={startFrame}
        delay={0}
        color={COLORS.accentOrange}
      />
      <StatItem
        value="9.1"
        label="Days Saved"
        startFrame={startFrame}
        delay={3} // 0.1s stagger
        color={COLORS.accentBlue}
      />
      <StatItem
        value="179"
        label="Users"
        startFrame={startFrame}
        delay={6} // 0.2s stagger
        color={COLORS.accentBlue}
      />
    </div>
  );
};

// ============================================
// PIE CHART (centered, slightly tilted)
// ============================================

export const TriggersPieChart = ({ startFrame, size = 180 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scale, opacity, y, visible } = dropIn(frame, fps, startFrame, 0);

  if (!visible) return null;

  const glow = glowPulse(frame, 0.06, 0.5, 0.9);

  const segments = [
    { color: "#FF6B6B", percentage: 36, label: "Entertainment" },
    { color: "#4A9FE8", percentage: 27, label: "Social" },
    { color: "#9B9B9B", percentage: 19, label: "Boredom" },
    { color: "#FF8FAB", percentage: 9, label: "FOMO" },
    { color: "#4ECDC4", percentage: 9, label: "Quick Check" },
  ];

  const center = size / 2;
  const radius = size / 2 - 8;

  let cumulative = 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `
          scale(${scale})
          translateY(${y}px)
          perspective(800px)
          rotateX(8deg)
        `,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          filter: `drop-shadow(0 0 ${20 * glow}px ${COLORS.accentBlue}44)`,
        }}
      >
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
        <circle cx={center} cy={center} r={radius * 0.35} fill="#0a0a0a" />
      </svg>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 14,
          color: COLORS.gray,
          marginTop: 16,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Your Triggers
      </div>
    </div>
  );
};

// ============================================
// VIGNETTE OVERLAY
// ============================================

export const Vignette = ({ intensity = 0.7 }) => {
  if (intensity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// ============================================
// BACKGROUND SPOOL (blurred for depth of field)
// ============================================

export const BackgroundSpool = ({ blurred = false, opacity = 0.04 }) => {
  const frame = useCurrentFrame();

  const rotation = frame * 0.02;
  const pulse = glowPulse(frame, 0.02, 0.8, 1.2);
  const drift = Math.sin(frame * 0.008) * 15;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        fontSize: 450,
        opacity: opacity * pulse,
        transform: `
          translate(-50%, -50%)
          rotate(${rotation}deg)
          translateY(${drift}px)
        `,
        filter: blurred ? "blur(6px)" : "blur(2px)",
        pointerEvents: "none",
        transition: "filter 0.5s ease",
      }}
    >
      🧵
    </div>
  );
};

// ============================================
// MASCOT COMPONENT (reacts to excuses)
// ============================================

const MASCOT_IMAGES = {
  shock: staticFile("spooli_shock.png"),
  smirk: staticFile("smirk.png"),
  jumping: staticFile("spooli_jumping.png"),
};

// Determine which mascot to show based on excuse index
const getMascotForIndex = (index) => {
  if (index < 3) return "smirk"; // Intro phase - smirking
  if (index < 8) return "shock"; // Mid acceleration - shocked
  return "smirk"; // Fast phase - back to smirk
};

export const ReactiveMascot = ({ currentExcuseIndex, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
      damping: 12, // Lower damping for more bounce
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
        filter: `drop-shadow(0 0 ${50 * glow}px ${COLORS.accentBlue}66)`,
      }}
    >
      <Img
        src={MASCOT_IMAGES.jumping}
        style={{
          width: 200,
          height: "auto",
        }}
      />
    </div>
  );
};

export { COLORS };
