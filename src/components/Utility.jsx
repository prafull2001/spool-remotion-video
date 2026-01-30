import React from "react";
import { useCurrentFrame } from "remotion";
import { glowPulse } from "../cleanAnimations.jsx";
import { COLORS } from "./colors.js";

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
// iPHONE FRAME COMPONENT
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
// APPLE APP STORE BADGE
// ============================================

export const AppStoreBadge = ({ width = 320 }) => (
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
