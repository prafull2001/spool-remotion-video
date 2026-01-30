import { interpolate, spring, Easing } from "remotion";

// ============================================
// SPRING CONFIGURATIONS
// ============================================

// Clean landing spring (damping: 20 to prevent jitter)
export const CLEAN_SPRING = {
  stiffness: 180,
  damping: 20,
  mass: 1,
};

// Snappy entry spring
export const SNAP_SPRING = {
  stiffness: 250,
  damping: 20,
  mass: 0.8,
};

// Heavy slam spring for stats
export const SLAM_SPRING = {
  stiffness: 300,
  damping: 20,
  mass: 1,
};

// Soft float spring
export const FLOAT_SPRING = {
  stiffness: 80,
  damping: 25,
  mass: 1.5,
};

// ============================================
// S-CURVE PACING SYSTEM
// ============================================

/**
 * Calculates excuse timings with exponential acceleration
 * Phase 1: 3 excuses at 0.73s each (22 frames) - "Quick Intro"
 * Phase 2: Exponential acceleration - cards blur and fly past
 * Phase 3: Final excuse with 1.1s hold (33 frames) - "The Brake"
 */
export const calculateSCurveTiming = (excuses, baseStartFrame = 70) => {
  const timings = [];
  let currentFrame = baseStartFrame;

  const totalExcuses = Math.min(excuses.length, 16);

  excuses.slice(0, totalExcuses).forEach((excuse, index) => {
    let duration;
    let velocity = 0; // For motion blur calculation

    if (index < 3) {
      // Phase 1: "Slow Intro" - Much slower for impact (1.2s = 36 frames)
      duration = 36;
      velocity = 0.05;
    } else if (index < 15) {
      // Phase 2: Exponential acceleration - cards blur and fly
      // Excuses 4-15 (12 excuses) accelerate through
      const progress = (index - 3) / 11; // 0 to 1 over 12 excuses

      // Exponential curve: fast acceleration
      const exponential = Math.pow(progress, 1.8);

      // Duration decreases from 14 to 4 frames exponentially (slightly slower)
      duration = Math.round(14 - (exponential * 10));
      duration = Math.max(4, duration);

      // Velocity increases exponentially (for blur)
      velocity = 0.30 + exponential * 0.65;
    } else {
      // Phase 3: "The Brake" - Final excuse holds for 1.1s (33 frames)
      duration = 33;
      velocity = 0; // No blur on brake
    }

    timings.push({
      text: excuse,
      startFrame: currentFrame,
      duration,
      index,
      velocity,
      isIntro: index < 3,
      isBlur: index >= 3 && index < 15,
      isBrake: index === totalExcuses - 1, // Last excuse is the brake
    });

    currentFrame += duration;
  });

  return timings;
};

// ============================================
// VELOCITY-BASED MOTION BLUR
// ============================================

/**
 * Calculates blur amount based on velocity
 * Returns blur in pixels (0-15px)
 */
export const velocityBlur = (velocity) => {
  // velocity is 0-1, blur is 0-15px
  return Math.round(velocity * 15);
};

/**
 * Fly-through animation with velocity-based blur
 * FIXED: Cards now exit faster to prevent overlap during acceleration
 */
export const flyThroughClean = (frame, startFrame, duration, velocity = 0, isBrake = false) => {
  const relativeFrame = frame - startFrame;
  const progress = Math.min(1, Math.max(0, relativeFrame / duration));

  if (relativeFrame < 0) {
    return { scale: 0.2, opacity: 0, y: 100, blur: 0, visible: false };
  }

  if (relativeFrame > duration && !isBrake) {
    return { scale: 2.5, opacity: 0, y: -200, blur: velocityBlur(velocity), visible: false };
  }

  let scale, opacity, y, blur;

  if (isBrake) {
    // "The Brake" - hard snap, stays centered
    const entryProgress = Math.min(1, progress * 2);
    const eased = 1 - Math.pow(1 - entryProgress, 3);

    scale = interpolate(eased, [0, 0.7, 1], [0.3, 1.05, 1.0]);
    opacity = interpolate(entryProgress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
    y = interpolate(eased, [0, 1], [80, 0]);
    blur = 0;
  } else {
    // Adjust timing based on velocity - faster cards need quicker transitions
    // High velocity = hard cut, low velocity = smoother transition
    const entryEnd = velocity > 0.5 ? 0.25 : 0.30;
    const exitStart = velocity > 0.5 ? 0.50 : 0.60;

    if (progress < entryEnd) {
      // Entry - faster fade in for high velocity cards
      const entryProgress = progress / entryEnd;
      scale = interpolate(entryProgress, [0, 0.8, 1], [0.3, 1.05, 1.0]);
      // Faster opacity ramp for high velocity
      opacity = interpolate(entryProgress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
      y = interpolate(entryProgress, [0, 1], [80, 0]);
      blur = velocityBlur(velocity * (1 - entryProgress));
    } else if (progress < exitStart) {
      // Hold
      scale = 1.0;
      opacity = 1;
      y = 0;
      blur = 0;
    } else {
      // Exit - MUCH faster for high velocity cards (hard cut effect)
      const exitProgress = (progress - exitStart) / (1 - exitStart);
      scale = interpolate(exitProgress, [0, 1], [1.0, 1.8]);
      // Hard cut: opacity drops to 0 very quickly
      opacity = velocity > 0.5
        ? interpolate(exitProgress, [0, 0.3], [1, 0], { extrapolateRight: "clamp" })
        : interpolate(exitProgress, [0, 0.5], [1, 0], { extrapolateRight: "clamp" });
      y = interpolate(exitProgress, [0, 1], [0, -120]);
      blur = velocityBlur(velocity * exitProgress);
    }
  }

  return { scale, opacity, y, blur, visible: true };
};

// ============================================
// STAGGERED DROP-IN ANIMATION
// ============================================

/**
 * Drop-in animation for stats grid
 * Items drop from higher Z with staggered timing
 */
export const dropIn = (frame, fps, startFrame, delay = 0) => {
  const adjustedFrame = frame - startFrame - delay;

  if (adjustedFrame < 0) {
    return { scale: 0.8, opacity: 0, y: -60, visible: false };
  }

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: CLEAN_SPRING,
  });

  const scale = interpolate(progress, [0, 0.6, 1], [0.8, 1.03, 1.0]);
  const opacity = interpolate(adjustedFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(progress, [0, 1], [-60, 0]);

  return { scale, opacity, y, visible: true };
};

// ============================================
// VIGNETTE INTENSITY
// ============================================

/**
 * Returns vignette intensity based on current phase
 */
export const vignetteIntensity = (frame, blurPhaseStart, blurPhaseEnd) => {
  if (frame < blurPhaseStart || frame > blurPhaseEnd) {
    return 0;
  }

  // Fade in and out
  const fadeIn = interpolate(frame, [blurPhaseStart, blurPhaseStart + 20], [0, 0.7], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [blurPhaseEnd - 20, blurPhaseEnd], [0.7, 0], {
    extrapolateLeft: "clamp",
  });

  return Math.min(fadeIn, fadeOut + 0.7);
};

// ============================================
// GLOW PULSE (subtle)
// ============================================

export const glowPulse = (frame, speed = 0.06, min = 0.6, max = 1.0) => {
  return min + (max - min) * ((Math.sin(frame * speed) + 1) / 2);
};

// ============================================
// SLAM DROP ANIMATION (for stats)
// ============================================

/**
 * Heavy slam animation - drops from Z-space with impact
 * Returns scale, opacity, y position, and shake intensity
 */
export const slamDrop = (frame, fps, startFrame, delay = 0) => {
  const adjustedFrame = frame - startFrame - delay;

  if (adjustedFrame < 0) {
    return { scale: 0.3, opacity: 0, y: -120, shakeIntensity: 0, visible: false };
  }

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SLAM_SPRING,
  });

  // 10% spring overshoot as specified
  const scale = interpolate(progress, [0, 0.5, 0.85, 1], [0.3, 1.10, 0.98, 1.0]);
  const opacity = interpolate(adjustedFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(progress, [0, 1], [-150, 0]);

  // Subtle screen shake peaks at impact (around frame 8-12)
  const shakeIntensity = interpolate(adjustedFrame, [0, 6, 10, 18], [0, 0, 0.8, 0], {
    extrapolateRight: "clamp",
  });

  return { scale, opacity, y, shakeIntensity, visible: true };
};

// ============================================
// SCREEN SHAKE
// ============================================

export const getScreenShake = (intensity, frame) => {
  if (intensity <= 0) return { x: 0, y: 0 };

  const shakeX = Math.sin(frame * 1.5) * intensity * 8;
  const shakeY = Math.cos(frame * 2) * intensity * 6;

  return { x: shakeX, y: shakeY };
};

// ============================================
// ZOOM OUT TRANSITION
// ============================================

export const zoomOutTransition = (frame, startFrame, duration = 20) => {
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return { scale: 1, opacity: 1 };
  }

  if (relativeFrame > duration) {
    return { scale: 4, opacity: 0 };
  }

  const progress = relativeFrame / duration;
  const eased = 1 - Math.pow(1 - progress, 2); // ease-out

  const scale = interpolate(eased, [0, 1], [1, 4]);
  const opacity = interpolate(eased, [0, 0.6, 1], [1, 0.5, 0]);

  return { scale, opacity };
};
