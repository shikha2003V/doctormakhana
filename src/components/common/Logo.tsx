import React from 'react';

interface LogoProps {
  variant?: 'default' | 'compact' | 'light' | 'dark' | 'header';
  className?: string;
  showTagline?: boolean;
  showVegSymbol?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  className = '',
  showTagline = true,
  showVegSymbol = false,
  size = 'md',
}) => {
  const isDark = variant === 'dark' || variant === 'light';

  // Height styles based on size
  const sizeStyles = {
    sm: 'h-9 sm:h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-18 sm:h-22',
    xl: 'h-24 sm:h-32',
  }[size];

  const mainTextColor = isDark ? '#FFFFFF' : '#18181B';
  const taglineTextColor = isDark ? '#F1F5F9' : '#27272A';
  const cyanColor = '#00A896'; // Aqua / Teal
  const yellowColor = '#F59E0B';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 340 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeStyles} w-auto max-w-full`}
        aria-label="Doctor's Makhana - The Crispy Taste For Health"
      >
        {/* ================= STETHOSCOPE GRAPHIC ================= */}
        <g id="StethoscopeMark">
          {/* Yellow Eartips */}
          <circle cx="28" cy="20" r="4" fill={yellowColor} />
          <circle cx="48" cy="20" r="4" fill={yellowColor} />

          {/* Cyan Binaural Headset Tubes */}
          <path
            d="M 28 20 C 28 32, 34 42, 38 45 C 42 42, 48 32, 48 20"
            stroke={cyanColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Main Loop curving around letter D */}
          <path
            d="M 38 45 C 38 60, 26 72, 18 72 C 10 72, 8 55, 20 46 C 32 37, 60 36, 60 54 C 60 70, 42 78, 26 78 C 18 78, 12 72, 12 62"
            stroke={cyanColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Diaphragm / Chestpiece (Bottom Left) */}
          <circle
            cx="12"
            cy="62"
            r="6.5"
            stroke={cyanColor}
            strokeWidth="2.8"
            fill={isDark ? '#0F172A' : '#FFFFFF'}
          />
          <circle cx="12" cy="62" r="2.8" fill={cyanColor} />
        </g>

        {/* ================= BRAND TEXT ================= */}
        {/* DOCTOR'S */}
        <text
          x="58"
          y="52"
          fill={mainTextColor}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="38"
          letterSpacing="-0.5px"
        >
          DOCTOR'S
        </text>

        {/* MAKHANA */}
        <text
          x="82"
          y="88"
          fill={mainTextColor}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="0.5px"
        >
          MAKHANA
        </text>

        {/* ================= YELLOW CURVED ARC / SMILE ================= */}
        <path
          d="M 50 101 Q 175 122 310 96 Q 175 113 50 101 Z"
          fill={yellowColor}
        />

        {/* ================= TAGLINE ================= */}
        {showTagline && (
          <text
            x="180"
            y="130"
            textAnchor="middle"
            fill={taglineTextColor}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="600"
            fontSize="16"
            letterSpacing="0.1px"
          >
            The Crispy Taste For Health
          </text>
        )}

        {/* Optional Vegetarian Symbol */}
        {showVegSymbol && (
          <g transform="translate(305, 72)">
            <rect
              x="0"
              y="0"
              width="14"
              height="14"
              rx="2"
              fill="#FFFFFF"
              stroke="#059669"
              strokeWidth="1.5"
            />
            <circle cx="7" cy="7" r="3.5" fill="#059669" />
          </g>
        )}
      </svg>
    </div>
  );
};
