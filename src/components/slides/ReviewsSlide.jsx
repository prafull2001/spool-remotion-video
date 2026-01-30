import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill, staticFile, Img } from "remotion";
import { glowPulse } from "../../cleanAnimations.jsx";
import { COLORS } from "../colors.js";

// ============================================
// REVIEWS SLIDE - 4.8 on App Store
// V18: WAY BIGGER everything - scaled up aggressively
// ============================================

// Real reviews from App Store
const REVIEWS_DATA = [
  {
    username: "KathyNat14",
    text: "This app has changed my screen time pattern and broken my habit of scrolling just to scroll.",
  },
  {
    username: "JodyFlaco",
    text: "Spool makes me type up my thought process which breaks the negative emotional cycle.",
  },
  {
    username: "GoldenSword03",
    text: "Really great user interface and great tutorial!",
  },
  {
    username: "Hireaysstdd",
    text: "i haven't used instagram in 3 days. 💗 enough said.",
  },
];

export const ReviewsSlide = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Header animation
  const headerProgress = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 180, damping: 18 },
  });
  const headerScale = interpolate(headerProgress, [0, 0.5, 1], [0.8, 1.05, 1.0]);
  const headerOpacity = interpolate(relativeFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const glow = glowPulse(frame, 0.04, 0.6, 1);

  // Bottom text animation (appears after cards)
  const bottomTextDelay = 45;
  const bottomTextProgress = spring({
    frame: Math.max(0, relativeFrame - bottomTextDelay),
    fps,
    config: { stiffness: 200, damping: 16 },
  });
  const bottomTextOpacity = interpolate(bottomTextProgress, [0, 0.5, 1], [0, 0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: COLORS.cream,
        padding: "20px 36px 60px 36px",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {/* Header - mascot centered */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `scale(${headerScale})`,
          textAlign: "center",
        }}
      >
        {/* Mascot - V18: MUCH BIGGER */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("spooli_jumping.png")}
            style={{
              width: 160,
              height: "auto",
              filter: `drop-shadow(0 6px 18px rgba(232, 93, 4, 0.4))`,
            }}
          />
        </div>

        {/* Stars - V18: WAY BIGGER */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              style={{
                fontSize: 48,
                filter: `drop-shadow(0 0 ${6 * glow}px rgba(232, 93, 4, 0.4))`,
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Rating text - V18: WAY BIGGER */}
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 56,
            color: COLORS.burntOrange,
            marginTop: 16,
            marginBottom: 40,
            textShadow: `0 0 ${12 * glow}px rgba(232, 93, 4, ${glow * 0.4})`,
          }}
        >
          4.8 on the App Store
        </div>
      </div>

      {/* V18: Review Cards - WAY BIGGER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 36,
          width: "100%",
          maxWidth: 680,
        }}
      >
        {REVIEWS_DATA.map((review, i) => {
          // Stagger card animations (9 frames / 300ms apart)
          const cardDelay = 8 + i * 9;
          const cardProgress = spring({
            frame: Math.max(0, relativeFrame - cardDelay),
            fps,
            config: {
              damping: 12,
              stiffness: 200,
              mass: 0.5
            },
          });

          const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
          const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
          const cardY = interpolate(cardProgress, [0, 1], [40, 0]);

          // V18: Even more horizontal stagger
          const isEven = i % 2 === 0;
          const cardX = isEven ? -50 : 50;
          const cardRotation = isEven ? -1.5 : 1.5;

          return (
            <div
              key={i}
              style={{
                backgroundColor: COLORS.white,
                border: `3px solid ${COLORS.burntOrange}`,
                borderRadius: 28,
                padding: "36px 44px",
                minHeight: 130,
                boxShadow: `0 6px 28px rgba(0, 0, 0, 0.1)`,
                opacity: cardOpacity,
                transform: `translateX(${cardX}px) translateY(${cardY}px) rotate(${cardRotation}deg) scale(${cardScale})`,
              }}
            >
              {/* Username with person emoji and stars - V18: WAY BIGGER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>👤</span>
                  <span
                    style={{
                      fontFamily: "Quicksand, sans-serif",
                      fontWeight: 600,
                      fontSize: 26,
                      color: COLORS.burntOrange,
                    }}
                  >
                    {review.username}
                  </span>
                </div>
                {/* Stars on card - V18: WAY BIGGER */}
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ fontSize: 24 }}>⭐</span>
                  ))}
                </div>
              </div>

              {/* Review text - V18: WAY BIGGER */}
              <div
                style={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 500,
                  fontSize: 28,
                  color: COLORS.charcoal,
                  lineHeight: 1.45,
                }}
              >
                "{review.text}"
              </div>
            </div>
          );
        })}
      </div>

      {/* V18: Bottom text - PLAIN BLUE, WAY BIGGER */}
      <div
        style={{
          marginTop: 50,
          textAlign: "center",
          opacity: bottomTextOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "Quicksand, sans-serif",
            fontSize: 32,
            color: "#3B82F6",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Users save 110+ wakeful days with Spool 🧵
        </div>
      </div>
    </AbsoluteFill>
  );
};
