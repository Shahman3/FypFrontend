/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";

const ChatifyLogoFull = () => {
  const [hasDrawn, setHasDrawn] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasDrawn(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
    setTimeout(() => setHovered(false), 2000);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      className="flex items-center px-4 py-2 bg-white rounded-xl font-bold text-xl"
      style={{
        fontSize: "1.25rem", // Ensure font size is optimized for tight spaces
        lineHeight: "1.2", // Ensure the text height aligns well
      }}
    >
      {/* "C" Logo as first letter */}
      <div
        className={`w-12 h-8 flex items-center justify-center logo-wrapper ${
          hasDrawn ? "ready" : ""
        } ${hovered ? "hovered" : ""}`}
        style={{
          backgroundColor: "#ffffff", // white bg
          marginRight: "-10px", // Apply negative margin to tighten space
          marginTop: "-1.5px", // Slightly tweak vertical alignment
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="c-path"
            d="M17 7 A8.5 8.5 0 1 0 17 17"
            stroke="#0f98a0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="7" cy="12" r="1" fill="#0f98a0" />
          <circle cx="11" cy="12" r="1" fill="#0f98a0" />
          <circle cx="15" cy="12" r="1" fill="#0f98a0" />
        </svg>
      </div>

      {/* Remaining text: "hatify" */}
      <span className="text-[#0f172a] font-semibold tracking-tight text-4xl">
        hatify
      </span>

      <style jsx>{`
        .c-path {
          stroke-dasharray: 44;
          stroke-dashoffset: 44;
          transition: stroke-dashoffset 1s ease-in-out;
        }

        .logo-wrapper.ready .c-path {
          stroke-dashoffset: 0;
        }

        .logo-wrapper.hovered .c-path {
          animation: strokeOnce 1.2s ease-in-out forwards;
        }

        @keyframes strokeOnce {
          0% {
            stroke-dashoffset: 44;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatifyLogoFull;
