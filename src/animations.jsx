import { interpolate, spring, Easing } from "remotion";

// Dramatic spring configs
export const SPRINGS = {
  // Snappy overshoot - for UI elements popping in
  snappy: {
    damping: 10,
    stiffness: 200,
    mass: 0.5,
  },
  // Bouncy - for playful elements
  bouncy: {
    damping: 8,
    stiffness: 150,
    mass: 0.8,
  },
  // Smooth - for transitions
  smooth: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  // Whip - for fast snaps
  whip: {
    damping: 15,
    stiffness: 400,
    mass: 0.3,
  },
};

// Snap zoom effect
export const snapZoom = (frame, fps, startFrame, config = SPRINGS.whip) => {
  const relativeFrame = Math.max(0, frame - startFrame);
  return spring({
    frame: relativeFrame,
    fps,
    config,
  });
};

// Overshoot scale animation
export const overshootScale = (frame, fps, startFrame, overshoot = 1.15) => {
  const progress = snapZoom(frame, fps, startFrame, SPRINGS.snappy);
  // Creates a scale that goes from 0 -> overshoot -> 1
  if (progress < 0.5) {
    return interpolate(progress, [0, 0.5], [0, overshoot]);
  }
  return interpolate(progress, [0.5, 1], [overshoot, 1]);
};

// Whip pan offset
export const whipPan = (frame, fps, startFrame, distance = 100) => {
  const progress = snapZoom(frame, fps, startFrame, SPRINGS.whip);
  return interpolate(progress, [0, 1], [distance, 0]);
};

// Stagger delay calculator
export const stagger = (index, baseDelay = 3) => index * baseDelay;

// Shake effect for emphasis
export const shake = (frame, intensity = 5, speed = 2) => {
  const shakeX = Math.sin(frame * speed) * intensity;
  const shakeY = Math.cos(frame * speed * 1.3) * intensity * 0.5;
  return { x: shakeX, y: shakeY };
};

// Pulse glow intensity
export const pulseGlow = (frame, speed = 0.1, min = 0.5, max = 1) => {
  const pulse = (Math.sin(frame * speed) + 1) / 2;
  return interpolate(pulse, [0, 1], [min, max]);
};

// Parallax depth multiplier
export const parallaxLayer = (frame, scrollSpeed, depth = 1) => {
  return frame * scrollSpeed * depth;
};
