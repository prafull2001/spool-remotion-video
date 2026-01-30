import React from "react";

// ============================================
// STUDY BADGE COMPONENT
// Standardized academic citation badge with green glow
// ============================================

export const StudyBadge = ({ title, citation, scale = 1 }) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
        border: "2px solid rgba(76, 175, 80, 0.4)",
        borderRadius: 16,
        padding: "14px 24px",
        boxShadow: `
          0 0 25px rgba(76, 175, 80, 0.2),
          0 4px 15px rgba(0, 0, 0, 0.06)
        `,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        minWidth: 280,
        maxWidth: 400,
        transform: `scale(${scale})`,
      }}
    >
      <span style={{ fontSize: 24 }}>🔬</span>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#2E7D32",
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 700,
            fontSize: 17,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#558B2F",
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 500,
            fontSize: 13,
            opacity: 0.85,
            marginTop: 2,
          }}
        >
          {citation}
        </div>
      </div>
    </div>
  );
};
