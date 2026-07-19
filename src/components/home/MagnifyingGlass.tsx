export default function MagnifyingGlass({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {/* orbiting particles */}
      <div className="absolute inset-0 animate-orbit">
        <span className="absolute top-[4%] left-[48%] w-[6px] h-[6px] rounded-full bg-violet-light shadow-[0_0_8px_#C9AFFF]" />
        <span className="absolute top-[46%] left-[95%] w-[5px] h-[5px] rounded-full bg-cyan shadow-[0_0_8px_#4FE3D0]" />
        <span className="absolute top-[88%] left-[28%] w-[5px] h-[5px] rounded-full bg-violet shadow-[0_0_8px_#9B6BFF]" />
        <span className="absolute top-[28%] left-[2%] w-[4px] h-[4px] rounded-full bg-cyan shadow-[0_0_6px_#4FE3D0]" />
      </div>

      {/* outer glow */}
      <div
        className="absolute rounded-full animate-glow-pulse"
        style={{
          width: size * 0.86,
          height: size * 0.86,
          background:
            'radial-gradient(circle, rgba(155,107,255,0.5) 0%, rgba(79,227,208,0.2) 55%, transparent 75%)',
          filter: 'blur(10px)',
        }}
      />

      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 100 100"
        fill="none"
        className="relative animate-breathe"
      >
        <defs>
          <linearGradient id="glassRing" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#C9AFFF" />
            <stop offset="100%" stopColor="#4FE3D0" />
          </linearGradient>
          <radialGradient id="glassFill" cx="32%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="45%" stopColor="rgba(155,107,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
          <linearGradient id="handleGrad" x1="60" y1="60" x2="92" y2="92">
            <stop offset="0%" stopColor="#C9AFFF" />
            <stop offset="100%" stopColor="#4FE3D0" />
          </linearGradient>
          <filter id="dropShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        <g filter="url(#dropShadow)">
          {/* lens body */}
          <circle cx="42" cy="42" r="29" fill="url(#glassFill)" stroke="url(#glassRing)" strokeWidth="6.5" />
          {/* inner ring detail */}
          <circle cx="42" cy="42" r="21.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="42" cy="42" r="14.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* refraction lines */}
          <path d="M 26 50 Q 42 60 58 50" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
          {/* glass shine */}
          <ellipse cx="32" cy="29" rx="9" ry="6" fill="rgba(255,255,255,0.65)" />
          <ellipse cx="50" cy="55" rx="3" ry="2" fill="rgba(255,255,255,0.25)" />
          {/* handle */}
          <line x1="63" y1="63" x2="90" y2="90" stroke="url(#handleGrad)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="90" cy="90" r="3.2" fill="#4FE3D0" opacity="0.9" />
        </g>
      </svg>
    </div>
  )
}
