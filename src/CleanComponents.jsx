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
// COLORS - "Cream & Burnt Orange" Modern Clean Theme
// ============================================

const COLORS = {
  // Backgrounds
  cream: "#FDF6EE",
  white: "#FFFFFF",

  // Primary accent - Burnt Orange
  burntOrange: "#E85D04",
  teal: "#E85D04", // Map to burnt orange for compatibility
  dustyOrange: "#E85D04",

  // Text
  charcoal: "#2D2D2D",

  // Phone frame
  phoneDark: "#1a1a1a",

  // Legacy mappings for compatibility
  black: "#FDF6EE",
  accentBlue: "#E85D04",
  accentOrange: "#E85D04",
  gray: "rgba(45, 45, 45, 0.6)",
  glass: "#FFFFFF",
  glassBorder: "#E85D04",
};

// ============================================
// iPHONE FRAME COMPONENT (Code-generated)
// ============================================

export const IPhoneFrame = ({ children, width = 340, screenContent, shake = 0, tilt = 0, tiltForward = 0, floatY = 0, scale = 1 }) => {
  const aspectRatio = 19.5 / 9;
  const height = width * aspectRatio;
  const bezelWidth = width * 0.025;
  const cornerRadius = width * 0.12;
  const screenRadius = width * 0.10;
  const notchWidth = width * 0.35;
  const notchHeight = height * 0.028;

  return (
    <div
      style={{
        transform: `
          perspective(1000px)
          rotateY(${tilt}deg)
          rotateX(${tiltForward}deg)
          translateY(${floatY}px)
          translateX(${shake}px)
          scale(${scale})
        `,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          backgroundColor: COLORS.phoneDark,
          borderRadius: cornerRadius,
          padding: bezelWidth,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 12px 24px -8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Screen area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: COLORS.cream,
            borderRadius: screenRadius,
            overflow: "hidden",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: notchWidth,
              height: notchHeight,
              backgroundColor: COLORS.phoneDark,
              borderRadius: notchHeight / 2,
              zIndex: 10,
            }}
          />

          {/* Screen content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              paddingTop: notchHeight + 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {screenContent}
          </div>
        </div>

        {/* Side button */}
        <div
          style={{
            position: "absolute",
            right: -3,
            top: height * 0.18,
            width: 3,
            height: height * 0.08,
            backgroundColor: "#2a2a2a",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};

// ============================================
// PHONE EXCUSE CARD (Smaller, fits inside phone)
// ============================================

export const PhoneExcuseCard = ({ username, text, isBrake = false }) => {
  const frame = useCurrentFrame();
  const glow = glowPulse(frame, 0.06, 0.5, 0.9);

  return (
    <div
      style={{
        width: "90%",
        maxWidth: 280,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 20,
          border: `1px solid ${COLORS.burntOrange}`,
          padding: isBrake ? "24px 22px" : "20px 18px",
          boxShadow: `
            0 4px 12px rgba(232, 93, 4, 0.12),
            0 0 ${15 * glow}px rgba(232, 93, 4, ${glow * 0.15})
          `,
        }}
      >
        {/* Username with indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.burntOrange,
            }}
          />
          <span
            style={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: COLORS.burntOrange,
            }}
          >
            {username}
          </span>
        </div>
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: isBrake ? 700 : 600,
            fontSize: isBrake ? 18 : 16,
            color: COLORS.charcoal,
            margin: 0,
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

// ============================================
// CLEAN EXCUSE CARD (Full-size, with username)
// ============================================

export const CleanExcuseCard = ({
  text,
  username = "",
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
          backgroundColor: COLORS.white,
          borderRadius: 28,
          border: `1px solid ${COLORS.burntOrange}`,
          padding: isBrake ? "42px 44px" : "34px 38px",
          boxShadow: `
            0 4px 20px rgba(232, 93, 4, 0.15),
            0 8px 40px rgba(232, 93, 4, 0.1),
            0 0 ${25 * glow}px rgba(232, 93, 4, ${glow * 0.2})
          `,
        }}
      >
        {/* Username with indicator */}
        {username && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.burntOrange,
              }}
            />
            <span
              style={{
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: COLORS.burntOrange,
              }}
            >
              {username}
            </span>
          </div>
        )}
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: isBrake ? 700 : 600,
            fontSize: isBrake ? 34 : 30,
            color: COLORS.charcoal,
            margin: 0,
            lineHeight: 1.4,
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
          color: COLORS.teal,
          textShadow: `
            0 0 ${20 * glow}px rgba(232, 93, 4, ${glow * 0.4}),
            0 0 ${40 * glow}px rgba(232, 93, 4, ${glow * 0.2})
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
          color: COLORS.charcoal,
          marginTop: 10,
          textTransform: "uppercase",
          letterSpacing: 2,
          opacity: 0.7,
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
  // Staggered at 0.15s (4.5 frames ≈ 5 frames) as specified
  const stats = [
    { value: "3,313", label: "Excuses", delay: 0 },
    { value: "9.1", label: "Days Saved", delay: 5 },
    { value: "179", label: "Users", delay: 10 },
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
        />
      ))}
    </div>
  );
};

// ============================================
// FULL-SCREEN STAT SLIDE: Excuses Count
// ============================================

export const ExcusesStatSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Entry animation
  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 200, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.6, 1], [0.8, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Count up animation
  const countProgress = interpolate(relativeFrame, [5, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const easedCount = 1 - Math.pow(1 - countProgress, 3);
  const displayValue = Math.round(3312 * easedCount).toLocaleString();

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Mascot at top */}
      <Img
        src={staticFile("spooli_jumping.png")}
        style={{
          width: 180,
          height: "auto",
          marginBottom: 40,
          filter: `drop-shadow(0 8px 25px rgba(232, 93, 4, ${glow * 0.3}))`,
        }}
      />

      {/* Large number */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 140,
          color: COLORS.burntOrange,
          textShadow: `0 0 ${30 * glow}px rgba(232, 93, 4, ${glow * 0.4})`,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 32,
          color: COLORS.charcoal,
          marginTop: 16,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        EXCUSES RECORDED
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// FULL-SCREEN STAT SLIDE: Time Saved
// ============================================

export const TimeSavedStatSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entryProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 200, damping: 18 },
  });

  const scale = interpolate(entryProgress, [0, 0.6, 1], [0.8, 1.05, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Count up
  const countProgress = interpolate(relativeFrame, [5, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const easedCount = 1 - Math.pow(1 - countProgress, 3);
  const displayValue = (9.1 * easedCount).toFixed(1);

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Large number */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 800,
          fontSize: 160,
          color: COLORS.burntOrange,
          textShadow: `0 0 ${30 * glow}px rgba(232, 93, 4, ${glow * 0.4})`,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 600,
          fontSize: 32,
          color: COLORS.charcoal,
          marginTop: 16,
          textTransform: "uppercase",
          letterSpacing: 4,
          textAlign: "center",
        }}
      >
        DAYS GIVEN BACK TO OUR USERS
      </div>

      {/* Subtext */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 24,
          color: COLORS.burntOrange,
          marginTop: 12,
          opacity: 0.8,
        }}
      >
        (That's 218 hours saved)
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// FULL-SCREEN STAT SLIDE: Peak Excuse Time
// ============================================

export const PeakExcuseTimeSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Bar data - BIGGER and BOLDER
  const bars = [
    { label: "Late Night", sublabel: "12am-6am", percent: 35, delay: 0 },
    { label: "Evening", sublabel: "6pm-12am", percent: 31, delay: 5 },
    { label: "Afternoon", sublabel: "12pm-6pm", percent: 22, delay: 10 },
    { label: "Morning", sublabel: "6am-12pm", percent: 12, delay: 15 },
  ];

  const glow = glowPulse(frame, 0.05, 0.6, 1);

  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 50px",
      }}
    >
      {/* Headline - LARGER */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 52,
          color: COLORS.charcoal,
          marginBottom: 60,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        When do people make excuses?
      </div>

      {/* Bar chart - FULL WIDTH, THICKER BARS */}
      <div style={{ width: "85%", maxWidth: 700 }}>
        {bars.map((bar, i) => {
          const barProgress = interpolate(
            relativeFrame - bar.delay,
            [0, 25],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const easedProgress = 1 - Math.pow(1 - barProgress, 3);
          const isTop = i === 0;

          return (
            <div key={i} style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: isTop ? 700 : 600,
                    fontSize: 24,
                    color: isTop ? COLORS.burntOrange : COLORS.charcoal,
                  }}
                >
                  {bar.label}{" "}
                  <span style={{ opacity: 0.5, fontSize: 18 }}>({bar.sublabel})</span>
                </span>
                <span
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 800,
                    fontSize: 32,
                    color: isTop ? COLORS.burntOrange : COLORS.charcoal,
                  }}
                >
                  {Math.round(bar.percent * easedProgress)}%
                </span>
              </div>
              <div
                style={{
                  height: 45,
                  backgroundColor: "rgba(232, 93, 4, 0.1)",
                  borderRadius: 22,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(bar.percent / 35) * 100 * easedProgress}%`,
                    height: "100%",
                    backgroundColor: isTop ? COLORS.burntOrange : "rgba(232, 93, 4, 0.5)",
                    borderRadius: 22,
                    boxShadow: isTop ? `0 0 ${20 * glow}px rgba(232, 93, 4, ${glow * 0.4})` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Punchline - LARGER and BOLDER */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 34,
          color: COLORS.burntOrange,
          marginTop: 50,
          textAlign: "center",
          opacity: interpolate(relativeFrame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: `0 0 ${15 * glow}px rgba(232, 93, 4, ${glow * 0.3})`,
        }}
      >
        35% of excuses happen when you should be sleeping 😴
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// FULL-SCREEN STAT SLIDE: Most Used Words
// ============================================

export const MostUsedWordsSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const opacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const words = [
    { word: "WANT", count: 892, delay: 0, direction: -1 },
    { word: "JUST", count: 723, delay: 5, direction: 1 },
    { word: "NEED", count: 659, delay: 10, direction: -1 },
    { word: "WANNA", count: 592, delay: 15, direction: 1 },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 50px",
      }}
    >
      {/* Headline */}
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          color: COLORS.charcoal,
          marginBottom: 50,
          textAlign: "center",
        }}
      >
        The language of rationalization
      </div>

      {/* Words */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {words.map((item, i) => {
          const wordProgress = spring({
            frame: Math.max(0, relativeFrame - item.delay),
            fps,
            config: { stiffness: 250, damping: 20 },
          });

          const x = interpolate(wordProgress, [0, 1], [item.direction * 200, 0]);
          const wordOpacity = interpolate(wordProgress, [0, 0.5, 1], [0, 1, 1]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 20,
                opacity: wordOpacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 800,
                  fontSize: 64 - i * 8,
                  color: COLORS.burntOrange,
                }}
              >
                {item.word}
              </span>
              <span
                style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 500,
                  fontSize: 20,
                  color: COLORS.charcoal,
                  opacity: 0.6,
                }}
              >
                — {item.count} times
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
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
        background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(232, 93, 4, ${intensity * 0.15}) 100%)`,
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
  wave: staticFile("spooli_wave.png"),
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
        filter: `drop-shadow(0 4px 20px rgba(232, 93, 4, ${glow * 0.3}))`,
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
// INTRO WAVING MASCOT
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
        filter: `drop-shadow(0 8px 30px rgba(232, 93, 4, ${glow * 0.25}))`,
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

// ============================================
// APPLE APP STORE BADGE (SVG Component - Larger)
// ============================================

const AppStoreBadge = ({ width = 320 }) => (
  <svg
    viewBox="0 0 150 50"
    width={width}
    height={width * (50 / 150)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="150" height="50" rx="8" fill="#000000" />
    <g fill="#FFFFFF">
      {/* Apple logo - larger and repositioned */}
      <g transform="translate(12, 8) scale(1.3)">
        <path d="M12.5 12.4c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.2 3.1-2.4 1-1.4 1.4-2.7 1.4-2.8 0-.1-2.7-1-2.7-4.1-.1-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-1.9.1-.1.1.3.1 1.4zM10.4 4.7c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z" />
      </g>
      {/* "Download on the" text - larger */}
      <text x="52" y="18" fontSize="8" fontFamily="SF Pro Text, Helvetica, Arial, sans-serif" fontWeight="400">
        Download on the
      </text>
      {/* "App Store" text - larger */}
      <text x="52" y="36" fontSize="16" fontFamily="SF Pro Display, Helvetica, Arial, sans-serif" fontWeight="600">
        App Store
      </text>
    </g>
  </svg>
);

// ============================================
// DOWNLOAD CARD (Full Screen CTA Component)
// ============================================

export const DownloadCard = ({
  startFrame,
  appName = "Spool",
  tagline = "Hear yourself justifying.",
  socialProof = "Join 500+ users",
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

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 50px",
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
          src={MASCOT_IMAGES.jumping}
          style={{
            width: 280,
            height: "auto",
            marginBottom: 40,
            filter: `drop-shadow(0 8px 30px rgba(232, 93, 4, ${glow * 0.4}))`,
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
            marginBottom: 50,
            textAlign: "center",
          }}
        >
          {socialProof}
        </div>

        {/* Apple App Store Badge - Larger */}
        <div
          style={{
            transform: `scale(${badgePulse})`,
            filter: `drop-shadow(0 6px 20px rgba(0, 0, 0, 0.25))`,
          }}
        >
          <AppStoreBadge width={380} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { COLORS };
