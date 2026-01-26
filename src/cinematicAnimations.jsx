import { interpolate, spring } from "remotion";

// ============================================
// SPRING CONFIGURATIONS
// ============================================

// Standard snap spring
export const SNAP_SPRING = {
  stiffness: 250,
  damping: 15,
  mass: 1,
};

// Heavy slam spring (for stats impact)
export const SLAM_SPRING = {
  stiffness: 400,
  damping: 12,
  mass: 0.6,
};

// Soft drift spring (for background elements)
export const DRIFT_SPRING = {
  stiffness: 30,
  damping: 25,
  mass: 2,
};

// ============================================
// EXPONENTIAL ACCELERATION TIMING
// ============================================

/**
 * Calculates the start frame for each excuse with exponential acceleration
 * First 3: slow (18 frames each = 0.6s)
 * Next 10: exponentially faster
 * Final 1: holds longer for impact
 */
export const calculateExcuseTimings = (excuses, baseStartFrame = 60) => {
  const timings = [];
  let currentFrame = baseStartFrame;

  excuses.forEach((excuse, index) => {
    let duration;

    if (index < 3) {
      // First 3: slow and deliberate (18 frames = 0.6s)
      duration = 18;
    } else if (index < excuses.length - 1) {
      // Middle excuses: exponentially faster
      // Formula: duration = max(3, 18 * (0.7 ^ (index - 3)))
      const acceleration = Math.pow(0.65, index - 3);
      duration = Math.max(3, Math.round(18 * acceleration));
    } else {
      // Final excuse: dramatic hold (45 frames = 1.5s)
      duration = 45;
    }

    timings.push({
      text: excuse,
      startFrame: currentFrame,
      duration,
      index,
      isSlow: index < 3,
      isFast: index >= 3 && index < excuses.length - 1,
      isFinal: index === excuses.length - 1,
    });

    currentFrame += duration;
  });

  return timings;
};

// ============================================
// Z-AXIS FLY-THROUGH (0.1 → 5.0)
// ============================================

/**
 * Creates the fly-through effect where cards come from deep background
 * and fly past the camera
 */
export const flyThroughZ = (frame, startFrame, duration, isFinal = false) => {
  const relativeFrame = frame - startFrame;
  const progress = Math.min(1, Math.max(0, relativeFrame / duration));

  if (relativeFrame < 0) {
    return { scale: 0.1, opacity: 0, z: -1000, blur: 0, visible: false };
  }

  if (relativeFrame > duration && !isFinal) {
    return { scale: 5.0, opacity: 0, z: 1000, blur: 20, visible: false };
  }

  // Entry: 0.1 → 1.0 (first 40% of duration)
  // Hold: 1.0 (middle 20%)
  // Exit: 1.0 → 5.0 (last 40% of duration) - unless final

  let scale, opacity, z, blur;

  if (isFinal) {
    // Final card stays at scale 1
    const entryProgress = Math.min(1, progress / 0.5);
    scale = interpolate(entryProgress, [0, 0.8, 1], [0.1, 1.15, 1.0]);
    opacity = interpolate(entryProgress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
    z = interpolate(entryProgress, [0, 1], [-1000, 0]);
    blur = interpolate(entryProgress, [0, 0.5, 1], [15, 5, 0]);
  } else if (progress < 0.4) {
    // Entry phase
    const entryProgress = progress / 0.4;
    scale = interpolate(entryProgress, [0, 0.8, 1], [0.1, 1.1, 1.0]);
    opacity = interpolate(entryProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
    z = interpolate(entryProgress, [0, 1], [-1000, 0]);
    blur = interpolate(entryProgress, [0, 0.6, 1], [15, 3, 0]);
  } else if (progress < 0.6) {
    // Hold phase
    scale = 1.0;
    opacity = 1;
    z = 0;
    blur = 0;
  } else {
    // Exit phase - fly past camera
    const exitProgress = (progress - 0.6) / 0.4;
    scale = interpolate(exitProgress, [0, 1], [1.0, 5.0]);
    opacity = interpolate(exitProgress, [0, 0.5, 1], [1, 0.5, 0]);
    z = interpolate(exitProgress, [0, 1], [0, 1000]);
    blur = interpolate(exitProgress, [0, 1], [0, 20]);
  }

  return { scale, opacity, z, blur, visible: true };
};

// ============================================
// SCREEN SHAKE / HAPTIC FLASH
// ============================================

/**
 * Creates a percussive screen shake effect
 */
export const screenShake = (frame, triggerFrame, intensity = 15, decay = 8) => {
  const elapsed = frame - triggerFrame;

  if (elapsed < 0 || elapsed > decay * 2) {
    return { x: 0, y: 0, rotation: 0 };
  }

  // Exponential decay
  const decayFactor = Math.exp(-elapsed / decay);

  // Randomized shake using sine waves at different frequencies
  const x = Math.sin(elapsed * 2.5) * intensity * decayFactor;
  const y = Math.cos(elapsed * 3.2) * intensity * 0.6 * decayFactor;
  const rotation = Math.sin(elapsed * 4) * 2 * decayFactor;

  return { x, y, rotation };
};

/**
 * Creates a haptic flash (white flash on impact)
 */
export const hapticFlash = (frame, triggerFrame, duration = 6) => {
  const elapsed = frame - triggerFrame;

  if (elapsed < 0 || elapsed > duration) {
    return 0;
  }

  // Quick flash in, slower fade out
  if (elapsed < 2) {
    return interpolate(elapsed, [0, 2], [0, 0.6]);
  }
  return interpolate(elapsed, [2, duration], [0.6, 0]);
};

// ============================================
// SLAM EFFECT (for stats)
// ============================================

/**
 * Creates a dramatic "slam" effect for stats
 * Starts large, slams down with overshoot
 */
export const slamEffect = (frame, fps, startFrame) => {
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return { scale: 3.0, opacity: 0, y: -100, shakeIntensity: 0 };
  }

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SLAM_SPRING,
  });

  // Scale: 3.0 → 0.85 → 1.0 (overshoot down)
  const scale = interpolate(progress, [0, 0.6, 0.85, 1], [3.0, 0.85, 1.08, 1.0]);

  // Y position: slam down
  const y = interpolate(progress, [0, 1], [-100, 0]);

  // Opacity
  const opacity = interpolate(relativeFrame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Screen shake intensity (peaks at impact)
  const shakeIntensity = interpolate(
    relativeFrame,
    [0, 8, 12, 25],
    [0, 25, 20, 0],
    { extrapolateRight: "clamp" }
  );

  return { scale, opacity, y, shakeIntensity };
};

// ============================================
// 3D PARALLAX LAYER SYSTEM
// ============================================

/**
 * Creates layered 3D parallax effect for outro
 * Each layer has different z-depth and moves at different speed
 */
export const parallaxLayer = (frame, fps, startFrame, layer = 0, totalLayers = 3) => {
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return { scale: 0.5, opacity: 0, z: -500, rotateX: 20, rotateY: -10, y: 100 };
  }

  // Stagger the entry of each layer
  const layerDelay = layer * 12;
  const adjustedFrame = relativeFrame - layerDelay;

  if (adjustedFrame < 0) {
    return { scale: 0.5, opacity: 0, z: -500, rotateX: 20, rotateY: -10, y: 100 };
  }

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SNAP_SPRING,
  });

  // Each layer has different z-depth
  const baseZ = -200 + (layer * 100); // Layer 0 is furthest back
  const z = interpolate(progress, [0, 1], [baseZ - 300, baseZ]);

  // Scale with overshoot
  const scale = interpolate(progress, [0, 0.7, 1], [0.5, 1.08, 1.0]);

  // Opacity
  const opacity = interpolate(adjustedFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 3D tilt - varies by layer
  const rotateX = interpolate(progress, [0, 1], [20, 10 - layer * 3]);
  const rotateY = interpolate(progress, [0, 1], [-15, -5 + layer * 2]);

  // Y position
  const y = interpolate(progress, [0, 1], [100 + layer * 50, layer * 30]);

  // Subtle float
  const floatY = Math.sin((frame + layer * 20) * 0.03) * (5 - layer);

  return { scale, opacity, z, rotateX, rotateY, y: y + floatY };
};

// ============================================
// GLOW INTENSITY
// ============================================

export const glowPulse = (frame, speed = 0.08, min = 0.5, max = 1.0) => {
  return min + (max - min) * ((Math.sin(frame * speed) + 1) / 2);
};

// ============================================
// MOTION BLUR CSS
// ============================================

export const motionBlurStyle = (blur) => {
  if (blur <= 0) return {};
  return {
    filter: `blur(${blur}px)`,
  };
};
