import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SPRINGS, shake } from "./animations.jsx";

// Single word/phrase that snaps in dramatically
export const SnapText = ({
  children,
  startFrame = 0,
  fontSize = 48,
  color = "#3D3D3D",
  weight = 700,
  delay = 0,
  direction = "up", // up, down, left, right
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame - delay;

  if (relativeFrame < 0) return null;

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SPRINGS.whip,
  });

  // Direction-based initial offset
  const offsets = {
    up: { x: 0, y: 60 },
    down: { x: 0, y: -60 },
    left: { x: 80, y: 0 },
    right: { x: -80, y: 0 },
  };

  const offset = offsets[direction];
  const translateX = interpolate(progress, [0, 1], [offset.x, 0]);
  const translateY = interpolate(progress, [0, 1], [offset.y, 0]);

  // Scale with overshoot
  const scale = interpolate(progress, [0, 0.7, 1], [0.5, 1.1, 1]);

  // Opacity
  const opacity = interpolate(relativeFrame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "Quicksand, sans-serif",
        fontWeight: weight,
        fontSize,
        color,
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// Multi-word text that staggers in
export const StaggerText = ({
  text,
  startFrame = 0,
  fontSize = 42,
  color = "#3D3D3D",
  weight = 700,
  staggerDelay = 4,
  lineHeight = 1.3,
  centered = true,
}) => {
  const words = text.split(" ");

  return (
    <div
      style={{
        textAlign: centered ? "center" : "left",
        lineHeight,
      }}
    >
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <SnapText
            startFrame={startFrame}
            delay={i * staggerDelay}
            fontSize={fontSize}
            color={color}
            weight={weight}
            direction={i % 2 === 0 ? "up" : "down"}
          >
            {word}
          </SnapText>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </div>
  );
};

// Big impact text with glow
export const ImpactText = ({
  children,
  startFrame = 0,
  fontSize = 72,
  color = "#FE723F",
  glowColor = null,
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

  const scale = interpolate(progress, [0, 0.5, 0.8, 1], [0, 1.3, 0.95, 1]);
  const opacity = interpolate(relativeFrame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Shake on impact
  const shakeIntensity = interpolate(relativeFrame, [0, 5, 15], [0, 8, 0], {
    extrapolateRight: "clamp",
  });
  const { x: shakeX, y: shakeY } = shake(frame, shakeIntensity, 3);

  const glow = glowColor || color;

  return (
    <div
      style={{
        fontFamily: "Quicksand, sans-serif",
        fontWeight: 700,
        fontSize,
        color,
        opacity,
        transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
        textShadow: `
          0 0 20px ${glow}66,
          0 0 40px ${glow}44,
          0 0 60px ${glow}22
        `,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

// Counter that counts up dramatically
export const CountUp = ({
  value,
  startFrame = 0,
  duration = 30,
  fontSize = 64,
  color = "#FE723F",
  suffix = "",
  prefix = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return null;

  // Parse numeric value
  const numericValue = parseFloat(value.toString().replace(/,/g, ""));
  const isDecimal = value.toString().includes(".");

  // Count up progress
  const countProgress = interpolate(relativeFrame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Eased count
  const easedProgress = Math.pow(countProgress, 0.5);
  const currentValue = numericValue * easedProgress;

  // Format number
  let displayValue;
  if (isDecimal) {
    displayValue = currentValue.toFixed(1);
  } else {
    displayValue = Math.round(currentValue).toLocaleString();
  }

  // Scale punch on completion
  const scale = countProgress >= 1
    ? spring({
        frame: relativeFrame - duration,
        fps,
        config: SPRINGS.snappy,
      })
    : 1;

  const finalScale = countProgress >= 1
    ? interpolate(scale, [0, 0.5, 1], [1, 1.15, 1])
    : 1;

  return (
    <div
      style={{
        fontFamily: "Quicksand, sans-serif",
        fontWeight: 700,
        fontSize,
        color,
        transform: `scale(${finalScale})`,
        textShadow: `
          0 0 30px ${color}55,
          0 0 60px ${color}33
        `,
      }}
    >
      {prefix}{displayValue}{suffix}
    </div>
  );
};
