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
  damping: 18,
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
 * Phase 1: 3 excuses at 0.9s each (27 frames) - "Intro Hang"
 * Phase 2: Exponential acceleration - cards blur and fly past
 * Phase 3: Final excuse with 1.2s hold (36 frames) - "The Brake"
 */
export const calculateSCurveTiming = (excuses, baseStartFrame = 70) => {
  const timings = [];
  let currentFrame = baseStartFrame;

  const totalExcuses = Math.min(excuses.length, 14);

  excuses.slice(0, totalExcuses).forEach((excuse, index) => {
    let duration;
    let velocity = 0; // For motion blur calculation

    if (index < 3) {
      // Phase 1: "Intro Hang" - Slow and readable (0.9s = 27 frames)
      duration = 27;
      velocity = 0.1;
    } else if (index < 13) {
      // Phase 2: Exponential acceleration - cards blur and fly
      // Exponential decay: duration starts at 18 and rapidly decreases
      const progress = (index - 3) / 9; // 0 to 1

      // Exponential curve: fast acceleration
      const exponential = Math.pow(progress, 1.8);

      // Duration decreases from 16 to 3 frames exponentially
      duration = Math.round(16 - (exponential * 13));
      duration = Math.max(3, duration);

      // Velocity increases exponentially (for blur)
      velocity = 0.3 + exponential * 0.7;
    } else {
      // Phase 3: "The Brake" - Final excuse holds for 1.2s (36 frames)
      duration = 36;
      velocity = 0; // No blur on brake
    }

    timings.push({
      text: excuse,
      startFrame: currentFrame,
      duration,
      index,
      velocity,
      isIntro: index < 3,
      isBlur: index >= 3 && index < 13,
      isBrake: index === 13,
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
    // Standard fly-through
    const entryEnd = 0.35;
    const exitStart = 0.65;

    if (progress < entryEnd) {
      // Entry
      const entryProgress = progress / entryEnd;
      scale = interpolate(entryProgress, [0, 0.8, 1], [0.2, 1.08, 1.0]);
      opacity = interpolate(entryProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
      y = interpolate(entryProgress, [0, 1], [100, 0]);
      blur = velocityBlur(velocity * (1 - entryProgress));
    } else if (progress < exitStart) {
      // Hold
      scale = 1.0;
      opacity = 1;
      y = 0;
      blur = 0;
    } else {
      // Exit
      const exitProgress = (progress - exitStart) / (1 - exitStart);
      scale = interpolate(exitProgress, [0, 1], [1.0, 2.5]);
      opacity = interpolate(exitProgress, [0, 0.5, 1], [1, 0.6, 0]);
      y = interpolate(exitProgress, [0, 1], [0, -200]);
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
