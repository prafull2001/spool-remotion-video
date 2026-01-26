import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Animation directions
const DIRECTIONS = {
  LEFT: "left",
  RIGHT: "right",
  POP: "pop",
};

export const ExcuseCard = ({
  text,
  startFrame,
  duration = 90,
  direction = DIRECTIONS.LEFT,
  yPosition = 400,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const relativeFrame = frame - startFrame - delay;

  // Don't render if not yet visible or already gone
  if (relativeFrame < 0 || relativeFrame > duration) {
    return null;
  }

  // Spring config matching Spool's motion system
  const springConfig = {
    damping: 12,
    stiffness: 100,
    mass: 0.8,
  };

  // Entry animation (first 20% of duration)
  const entryDuration = duration * 0.25;
  // Hold duration (middle 50%)
  const holdStart = entryDuration;
  const holdEnd = duration * 0.75;
  // Exit animation (last 25%)
  const exitStart = holdEnd;

  let translateX = 0;
  let scale = 1;
  let opacity = 1;

  if (direction === DIRECTIONS.POP) {
    // Pop in animation
    const popProgress = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
    });

    scale = interpolate(popProgress, [0, 1], [0.5, 1]);
    opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateRight: "clamp",
    });

    // Exit - scale down and fade
    if (relativeFrame > exitStart) {
      const exitProgress = (relativeFrame - exitStart) / (duration - exitStart);
      scale = interpolate(exitProgress, [0, 1], [1, 0.8]);
      opacity = interpolate(exitProgress, [0, 1], [1, 0]);
    }
  } else {
    // Slide animations
    const slideDistance = width + 100;
    const startX = direction === DIRECTIONS.LEFT ? -slideDistance : slideDistance;
    const endX = direction === DIRECTIONS.LEFT ? slideDistance : -slideDistance;

    // Entry
    if (relativeFrame < entryDuration) {
      const entrySpring = spring({
        frame: relativeFrame,
        fps,
        config: springConfig,
      });
      translateX = interpolate(entrySpring, [0, 1], [startX, 0]);
    }
    // Hold
    else if (relativeFrame < exitStart) {
      translateX = 0;
    }
    // Exit
    else {
      const exitProgress = (relativeFrame - exitStart) / (duration - exitStart);
      translateX = interpolate(exitProgress, [0, 1], [0, endX], {
        extrapolateRight: "clamp",
      });
    }

    // Fade in/out
    opacity = interpolate(
      relativeFrame,
      [0, 10, exitStart, duration],
      [0, 1, 1, 0],
      { extrapolateRight: "clamp" }
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: yPosition,
        left: "50%",
        transform: `translateX(-50%) translateX(${translateX}px) scale(${scale})`,
        opacity,
        width: "85%",
        maxWidth: 380,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: "20px 24px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
          border: "1.5px solid #8AC9E1",
        }}
      >
        <p
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 500,
            fontSize: 22,
            color: "#3D3D3D",
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

export { DIRECTIONS };
