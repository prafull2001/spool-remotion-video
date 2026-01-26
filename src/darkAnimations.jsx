import { interpolate, spring } from "remotion";

// Tech-Noir Spring Config (stiffness: 250, damping: 15)
export const SNAP_SPRING = {
  stiffness: 250,
  damping: 15,
  mass: 1,
};

// Lighter spring for subtle movements
export const DRIFT_SPRING = {
  stiffness: 50,
  damping: 20,
  mass: 2,
};

// Heavy bounce for stats
export const BOUNCE_SPRING = {
  stiffness: 300,
  damping: 12,
  mass: 0.8,
};

// Z-Axis fly-through entry (from background toward camera)
// Returns { scale, opacity, z } for 3D positioning
export const flyInFromBack = (frame, fps, startFrame, duration = 15) => {
  const relativeFrame = Math.max(0, frame - startFrame);

  if (relativeFrame < 0) {
    return { scale: 0.3, opacity: 0, z: -500 };
  }

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SNAP_SPRING,
  });

  // 10% overshoot: 0.3 -> 1.1 -> 1.0
  const scale = interpolate(
    progress,
    [0, 0.7, 1],
    [0.3, 1.1, 1.0]
  );

  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const z = interpolate(progress, [0, 1], [-500, 0]);

  return { scale, opacity, z };
};

// Z-Axis fly-through exit (flies PAST the camera)
// Card scales up to 3.0 and fades out
export const flyPastCamera = (frame, fps, exitFrame, duration = 12) => {
  const relativeFrame = frame - exitFrame;

  if (relativeFrame < 0) {
    return { scale: 1, opacity: 1, z: 0, active: true };
  }

  if (relativeFrame > duration) {
    return { scale: 3, opacity: 0, z: 500, active: false };
  }

  const progress = relativeFrame / duration;
  const easedProgress = Math.pow(progress, 0.7); // Fast start, slight ease

  const scale = interpolate(easedProgress, [0, 1], [1.0, 3.0]);
  const opacity = interpolate(easedProgress, [0, 0.6, 1], [1, 0.5, 0]);
  const z = interpolate(easedProgress, [0, 1], [0, 500]);

  return { scale, opacity, z, active: true };
};

// Combined fly-through for excuse cards
export const flyThrough = (frame, fps, startFrame, holdDuration = 25) => {
  const exitFrame = startFrame + holdDuration;

  // Not yet visible
  if (frame < startFrame) {
    return { scale: 0.3, opacity: 0, z: -500, visible: false };
  }

  // Entry phase
  if (frame < exitFrame) {
    const entry = flyInFromBack(frame, fps, startFrame);
    return { ...entry, visible: true };
  }

  // Exit phase
  const exit = flyPastCamera(frame, fps, exitFrame);
  return { ...exit, visible: exit.active };
};

// Snap zoom with white flash bloom
export const snapZoomWithBloom = (frame, fps, startFrame) => {
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return { scale: 0, opacity: 0, bloomIntensity: 0 };
  }

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SNAP_SPRING,
  });

  // Heavy overshoot
  const scale = interpolate(progress, [0, 0.6, 1], [0, 1.2, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // White flash bloom peaks early then fades
  const bloomIntensity = interpolate(
    relativeFrame,
    [0, 3, 8, 20],
    [0, 1, 0.8, 0],
    { extrapolateRight: "clamp" }
  );

  return { scale, opacity, bloomIntensity };
};

// Fast count interpolation for stats
export const fastCount = (frame, fps, startFrame, targetValue, duration = 25) => {
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) return 0;

  // Fast count phase
  const countProgress = interpolate(relativeFrame, [0, duration * 0.7], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Eased to feel like it's "catching up"
  const easedProgress = 1 - Math.pow(1 - countProgress, 3);
  const currentValue = targetValue * easedProgress;

  // Bounce settle at the end
  if (relativeFrame > duration * 0.7) {
    const bounceFrame = relativeFrame - duration * 0.7;
    const bounceProgress = spring({
      frame: bounceFrame,
      fps,
      config: BOUNCE_SPRING,
    });

    // Overshoot the target then settle
    const overshoot = interpolate(bounceProgress, [0, 0.5, 1], [1, 1.05, 1]);
    return targetValue * overshoot;
  }

  return currentValue;
};

// Parallax rotation for background elements
export const parallaxDrift = (frame, speed = 0.1) => {
  const rotation = Math.sin(frame * speed * 0.01) * 5;
  const x = Math.cos(frame * speed * 0.008) * 20;
  const y = Math.sin(frame * speed * 0.012) * 15;

  return { rotation, x, y };
};

// Neon glow pulse
export const neonPulse = (frame, speed = 0.1, min = 0.6, max = 1.0) => {
  const pulse = (Math.sin(frame * speed) + 1) / 2;
  return interpolate(pulse, [0, 1], [min, max]);
};

// 3D tilt for outro cards
export const tilt3D = (frame, fps, startFrame, tiltX = 15, tiltY = -10) => {
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return { rotateX: 0, rotateY: 0, scale: 0.5, opacity: 0 };
  }

  const progress = spring({
    frame: relativeFrame,
    fps,
    config: SNAP_SPRING,
  });

  const rotateX = interpolate(progress, [0, 1], [tiltX * 2, tiltX]);
  const rotateY = interpolate(progress, [0, 1], [tiltY * 2, tiltY]);
  const scale = interpolate(progress, [0, 0.7, 1], [0.5, 1.08, 1.0]);
  const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle float
  const floatY = Math.sin(frame * 0.03) * 5;

  return { rotateX, rotateY, scale, opacity, floatY };
};
