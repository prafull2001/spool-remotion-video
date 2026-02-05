import React from "react";
import { useCurrentFrame } from "remotion";
import { flyThroughClean, glowPulse } from "../cleanAnimations.jsx";
import { COLORS } from "./colors.js";

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
            0 4px 12px rgba(74, 200, 245, 0.12),
            0 0 ${15 * glow}px rgba(74, 200, 245, ${glow * 0.15})
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
  emoji = "",
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

  // 40% larger scale for "loud" mobile readability
  const sizeMultiplier = 1.40;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${scale * sizeMultiplier}) translateY(${y}px)`,
        opacity,
        width: "95%",
        maxWidth: 620,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Emoji ABOVE the card - bigger */}
      {emoji && (
        <div
          style={{
            textAlign: "center",
            fontSize: 72,
            marginBottom: 16,
          }}
        >
          {emoji}
        </div>
      )}
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 32,
          border: `2px solid ${COLORS.burntOrange}`,
          padding: isBrake ? "48px 50px" : "40px 44px",
          boxShadow: `
            0 6px 25px rgba(74, 200, 245, 0.18),
            0 10px 50px rgba(74, 200, 245, 0.12),
            0 0 ${30 * glow}px rgba(74, 200, 245, ${glow * 0.25})
          `,
          width: "100%",
        }}
      >
        {/* Username with indicator */}
        {username && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: COLORS.burntOrange,
              }}
            />
            <span
              style={{
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 700,
                fontSize: 22,
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
            fontSize: isBrake ? 38 : 34,
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
