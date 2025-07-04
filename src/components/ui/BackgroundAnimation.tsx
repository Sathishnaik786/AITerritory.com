import React from "react";

// Subtle animated gradient background, theme-aware, respects prefers-reduced-motion
const BackgroundAnimation: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 w-full h-full overflow-hidden select-none"
    style={{
      // For Safari GPU acceleration
      willChange: "opacity, transform",
      backfaceVisibility: "hidden",
    }}
  >
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        .bg-animated-gradient {
          animation: gradient-move 16s ease-in-out infinite alternate;
        }
      }
      @keyframes gradient-move {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `}</style>
    <div
      className="bg-animated-gradient absolute inset-0 w-full h-full"
      style={{
        background:
          "linear-gradient(120deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.10) 50%, rgba(16,185,129,0.10) 100%)",
        backgroundSize: "200% 200%",
        filter: "blur(0px)",
        transition: "background 0.5s",
      }}
    />
  </div>
);

export default BackgroundAnimation; 