import { useState, useEffect } from "react";

const loadingMessages = [
  "Analyzing ingredients...",
  "Checking your pantry...",
  "Finding the best recipes...",
  "Reducing food waste...",
  "Preparing recommendations...",
];

/**
 * Premium cooking-themed loading spinner
 */
export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Cooking Pot Animation */}
      <div className="relative h-32 w-32 mb-8">
        {/* Pot */}
        <svg
          className="w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pot body */}
          <ellipse cx="100" cy="140" rx="80" ry="30" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
          <path
            d="M 20 140 Q 20 100 100 80 Q 180 100 180 140"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* Pot rim */}
          <ellipse cx="100" cy="80" rx="80" ry="25" fill="none" stroke="#9ca3af" strokeWidth="2" />
          
          {/* Handles */}
          <path
            d="M 30 120 Q 10 100 30 80"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="3"
          />
          <path
            d="M 170 120 Q 190 100 170 80"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="3"
          />

          {/* Water inside pot */}
          <ellipse
            cx="100"
            cy="130"
            rx="60"
            ry="20"
            fill="#dbeafe"
            opacity="0.6"
          />
        </svg>

        {/* Floating Ingredients */}
        {["🥕", "🍅", "🧅"].map((emoji, index) => (
          <div
            key={emoji}
            className="absolute text-2xl"
            style={{
              left: `${50 + Math.cos((index * 2 * Math.PI) / 3) * 40}px`,
              top: `${80 + Math.sin((index * 2 * Math.PI) / 3) * 40}px`,
              animation: `float-up 2s ease-in-out infinite`,
              animationDelay: `${index * 0.3}s`,
            }}
          >
            {emoji}
          </div>
        ))}

        {/* Steam puffs */}
        {[0, 1, 2].map((index) => (
          <div
            key={`steam-${index}`}
            className="absolute rounded-full bg-slate-300/40"
            style={{
              width: "20px",
              height: "20px",
              left: `${100 - 10}px`,
              top: `${60 - index * 30}px`,
              animation: `float-up 1.5s ease-out infinite`,
              animationDelay: `${index * 0.3}s`,
              opacity: 0.6 - index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-2 w-2 rounded-full bg-emerald-500"
            style={{
              animation: "bounce-gentle 1s ease-in-out infinite",
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Loading Message */}
      <p className="text-center text-sm font-medium text-slate-600 h-6">
        <span
          key={messageIndex}
          className="inline-block animate-fade-in-up"
        >
          {loadingMessages[messageIndex]}
        </span>
      </p>
    </div>
  );
}