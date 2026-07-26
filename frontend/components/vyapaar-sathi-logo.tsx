'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function VyapaarSathiLogo({ className = '', size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 34, text: 'text-sm', sub: 'text-[8px]' },
    md: { icon: 44, text: 'text-base', sub: 'text-[9px]' },
    lg: { icon: 56, text: 'text-xl', sub: 'text-[10px]' },
    xl: { icon: 72, text: 'text-2xl', sub: 'text-[11px]' }
  }[size];

  return (
    <div className={`inline-flex items-center space-x-2.5 group cursor-pointer whitespace-nowrap ${className}`}>
      
      {/* SVG Vector Logo matching the user's provided logo image */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_12px_rgba(218,119,86,0.35)]"
        >
          {/* Background Soft Circle Glow */}
          <circle cx="100" cy="100" r="95" fill="url(#logoGlow)" fillOpacity="0.15" />

          {/* Outer Decorative Circular Arrow Rings */}
          <g transform="translate(22, 90)">
            <path d="M 0,10 A 10,10 0 0,1 15,0 L 15,6 A 5,5 0 0,0 5,10 Z" fill="#00AEEF" />
            <path d="M 15,10 A 10,10 0 0,1 0,20 L 0,14 A 5,5 0 0,0 10,10 Z" fill="#DA7756" />
          </g>

          <g transform="translate(163, 90)">
            <path d="M 15,10 A 10,10 0 0,0 0,0 L 0,6 A 5,5 0 0,1 10,10 Z" fill="#DA7756" />
            <path d="M 0,10 A 10,10 0 0,0 15,20 L 15,14 A 5,5 0 0,1 5,10 Z" fill="#00AEEF" />
          </g>

          {/* Devanagari Arc Text: "व्यापार साथी" */}
          <path id="topArcPath" d="M 32 100 A 68 68 0 0 1 168 100" fill="none" />
          <text fontSize="22" fontWeight="900" fontFamily="sans-serif">
            <textPath href="#topArcPath" startOffset="50%" textAnchor="middle">
              <tspan fill="#DA7756">व्यापार </tspan>
              <tspan fill="#00AEEF"> साथी</tspan>
            </textPath>
          </text>

          {/* English Arc Text: "VYAPAAR SATHI" */}
          <path id="bottomArcPath" d="M 168 105 A 68 68 0 0 1 32 105" fill="none" />
          <text fontSize="15" fontWeight="800" fontFamily="Montserrat, sans-serif" letterSpacing="2">
            <textPath href="#bottomArcPath" startOffset="50%" textAnchor="middle">
              <tspan fill="#DA7756">VYAPAAR </tspan>
              <tspan fill="#00AEEF"> SATHI</tspan>
            </textPath>
          </text>

          {/* Center Emblem Container */}
          <text x="100" y="60" textAnchor="middle" fill="#DA7756" fontSize="10" fontWeight="900">AI</text>

          {/* Central Book / Ledger Outline */}
          <rect x="70" y="65" width="60" height="70" rx="8" stroke="#00AEEF" strokeWidth="4.5" fill="#121110" />
          <path d="M 80 65 V 135" stroke="#00AEEF" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M 118 65 H 124 V 73 H 118 Z" fill="#00AEEF" />

          {/* Green Circuit Lines & Nodes */}
          <path d="M 52 82 H 70 M 52 100 H 70 M 52 118 H 70" stroke="#39FF14" strokeWidth="3" />
          <circle cx="52" cy="82" r="5" fill="#39FF14" />
          <circle cx="52" cy="100" r="5" fill="#39FF14" />
          <circle cx="52" cy="118" r="5" fill="#39FF14" />

          <path d="M 130 82 H 148 M 130 100 H 148 M 130 118 H 148" stroke="#39FF14" strokeWidth="3" />
          <circle cx="148" cy="82" r="5" fill="#39FF14" />
          <circle cx="148" cy="100" r="5" fill="#39FF14" />
          <circle cx="148" cy="118" r="5" fill="#39FF14" />

          {/* Center Amber Growth Circle with Arrow */}
          <circle cx="100" cy="100" r="18" fill="#FFF" stroke="#DA7756" strokeWidth="3" />
          <path d="M 92 106 L 98 100 L 102 103 L 108 94 M 108 94 H 103 M 108 94 V 99" stroke="#DA7756" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Decorative Sparkles */}
          <path d="M 62 135 L 64 140 L 69 142 L 64 144 L 62 149 L 60 144 L 55 142 L 60 140 Z" fill="#DA7756" />
          <path d="M 138 65 L 140 70 L 145 72 L 140 74 L 138 79 L 136 74 L 131 72 L 136 70 Z" fill="#00AEEF" />

          <defs>
            <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DA7756" />
              <stop offset="100%" stopColor="#00AEEF" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text Beside Logo - Clean Single Line Alignment */}
      {showText && (
        <div className="flex flex-col text-left font-['Montserrat',sans-serif] leading-none space-y-1">
          <div className="flex items-center space-x-1.5 whitespace-nowrap">
            <span className={`font-black tracking-tight ${dimensions.text} text-white`}>
              VYAPAAR <span className="text-[#00AEEF]">SATHI</span>
            </span>
            <span className={`font-black italic text-[#DA7756] ${dimensions.text}`}>AI</span>
          </div>
          <span className={`font-extrabold uppercase tracking-widest text-[#DA7756] ${dimensions.sub} whitespace-nowrap`}>
            MSME VITALITY ECOSYSTEM
          </span>
        </div>
      )}

    </div>
  );
}
