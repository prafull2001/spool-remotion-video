import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const StatItem = ({ value, label, delay, frame, fps }) => {
  const relativeFrame = frame - delay;

  if (relativeFrame < 0) return null;

  const scaleSpring = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 80,
      mass: 0.5,
    },
  });

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scaleSpring})`,
        marginBottom: 28,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 700,
          fontSize: 52,
          color: "#FE723F",
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "Quicksand, sans-serif",
          fontWeight: 500,
          fontSize: 20,
          color: "#666666",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StatsReveal = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Header animation
  const headerOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headerY = interpolate(relativeFrame, [0, 20], [-30, 0], {
    extrapolateRight: "clamp",
  });

  const stats = [
    { value: "3,313", label: "excuses made" },
    { value: "9.1 days", label: "of screen time requested" },
    { value: "179", label: "users" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 30px",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 50,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: "#3D3D3D",
            lineHeight: 1.3,
          }}
        >
          We've heard it all...
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: "40px 50px",
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          border: "2px solid #8AC9E1",
        }}
      >
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            value={stat.value}
            label={stat.label}
            delay={30 + index * 20}
            frame={relativeFrame}
            fps={fps}
          />
        ))}
      </div>

      {/* Spooli emoji */}
      <div
        style={{
          marginTop: 40,
          fontSize: 60,
          opacity: interpolate(relativeFrame, [90, 110], [0, 1], {
            extrapolateRight: "clamp",
          }),
          transform: `scale(${spring({
            frame: Math.max(0, relativeFrame - 90),
            fps,
            config: { damping: 8, stiffness: 100 },
          })})`,
        }}
      >
        🧵
      </div>
    </div>
  );
};
