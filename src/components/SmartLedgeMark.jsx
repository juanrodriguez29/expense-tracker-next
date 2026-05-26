// SmartLedgeMark.jsx
// Inline SVG mark — drop in anywhere. Size via the `size` prop or CSS.

export default function SmartLedgeMark({ size = 72, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SmartLedge"
      className={className}
      {...rest}
    >
      <defs>
        <clipPath id="sl-clip">
          <path d="M100,0 C30,0 0,30 0,100 C0,170 30,200 100,200 C170,200 200,170 200,100 C200,30 170,0 100,0 Z" />
        </clipPath>
        <linearGradient id="sl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#6E5DEF" />
          <stop offset="55%"  stopColor="#4577ED" />
          <stop offset="100%" stopColor="#1FAEEC" />
        </linearGradient>
        <radialGradient id="sl-glow" cx="0.85" cy="0.15" r="0.95">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath="url(#sl-clip)">
        <rect width="200" height="200" fill="url(#sl-bg)" />
        <rect width="200" height="200" fill="url(#sl-glow)" />
        {/* Main indigo arc (rendered white on the gradient bg) */}
        <path d="M 100 48 A 52 52 0 1 1 47.98 100"
              stroke="#FFFFFF" strokeWidth="22" fill="none" />
        {/* Accent slice */}
        <path d="M 99.99 48 A 52 52 0 0 1 151.95 96.4"
              stroke="#A3DEFF" strokeWidth="22" fill="none" />
        <text x="100" y="110" textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="800" fontSize="38"
              letterSpacing="-1.5" fill="#FFFFFF">SL</text>
      </g>
    </svg>
  );
}
