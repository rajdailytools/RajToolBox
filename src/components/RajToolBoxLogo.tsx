import React from 'react';

interface RajToolBoxLogoProps {
  className?: string;
  variant?: 'full' | 'icon-only';
  iconSize?: number | string;
}

export const RajToolBoxLogo: React.FC<RajToolBoxLogoProps> = ({
  className = 'h-9 w-auto',
  variant = 'full',
}) => {
  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="RajToolBox Icon"
        role="img"
      >
        <title>RajToolBox</title>
        {/* Hot Pink Rounded Square Background */}
        <rect width="100" height="100" rx="26" fill="#EC4899" />

        {/* Toolbox Handle */}
        <path
          d="M37 34 V27 C37 22 41 19 50 19 C59 19 63 22 63 27 V34"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Toolbox Lid */}
        <rect x="18" y="34" width="64" height="12" rx="3.5" fill="#FFFFFF" />

        {/* Toolbox Body */}
        <path
          d="M19 48 H81 V68 C81 74 76 78 70 78 H30 C24 78 19 74 19 68 Z"
          fill="#FFFFFF"
        />

        {/* Yellow Latches */}
        <rect x="26" y="41" width="9" height="13" rx="2" fill="#FACC15" />
        <rect x="65" y="41" width="9" height="13" rx="2" fill="#FACC15" />

        {/* Yellow Diagonal Wrench */}
        <g transform="translate(48, 64) rotate(-38)">
          {/* Wrench Shaft / Handle */}
          <rect x="-3" y="-1" width="6" height="17" rx="2.5" fill="#FACC15" />
          {/* Wrench Open Head */}
          <path
            d="M-7.5 -1 C-8.5 -6 -5 -11 0 -11 C5 -11 8.5 -6 7.5 -1 C6.2 -3.5 3 -4.5 0 -4.5 C-3 -4.5 -6.2 -3.5 -7.5 -1 Z"
            fill="#FACC15"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 520 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ aspectRatio: '520 / 100', overflow: 'visible' }}
      aria-label="RajToolBox"
      role="img"
    >
      <title>RajToolBox</title>

      {/* 1. Hot Pink Rounded Square Icon */}
      <g>
        <rect x="6" y="6" width="88" height="88" rx="24" fill="#EC4899" />

        {/* Toolbox Handle */}
        <path
          d="M38 35 V28 C38 23 42 20 50 20 C58 20 62 23 62 28 V35"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Toolbox Lid */}
        <rect x="18" y="35" width="64" height="12" rx="3.5" fill="#FFFFFF" />

        {/* Toolbox Body */}
        <path
          d="M19 49 H81 V69 C81 75 76 79 70 79 H30 C24 79 19 75 19 69 Z"
          fill="#FFFFFF"
        />

        {/* Yellow Latches */}
        <rect x="26" y="42" width="9" height="13" rx="2" fill="#FACC15" />
        <rect x="65" y="42" width="9" height="13" rx="2" fill="#FACC15" />

        {/* Yellow Diagonal Wrench */}
        <g transform="translate(48, 65) rotate(-38)">
          <rect x="-3" y="-1" width="6" height="17" rx="2.5" fill="#FACC15" />
          <path
            d="M-7.5 -1 C-8.5 -6 -5 -11 0 -11 C5 -11 8.5 -6 7.5 -1 C6.2 -3.5 3 -4.5 0 -4.5 C-3 -4.5 -6.2 -3.5 -7.5 -1 Z"
            fill="#FACC15"
          />
        </g>
      </g>

      {/* 2. Brand Wordmark: "Raj" (Charcoal / Dark adaptive) + "ToolBox" (Hot Pink) */}
      <text
        x="108"
        y="67"
        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="52"
        letterSpacing="-0.025em"
      >
        <tspan className="fill-[#18181B] dark:fill-[#F4F4F5]">Raj</tspan>
        <tspan fill="#EC4899">ToolBox</tspan>
      </text>
    </svg>
  );
};
