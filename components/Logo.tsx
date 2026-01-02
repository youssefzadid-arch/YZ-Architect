
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
  >
    <defs>
      {/* Filter to create the "hand-drawn" rough line effect */}
      <filter id="roughLine">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
      </filter>
    </defs>

    <g filter="url(#roughLine)">
      {/* Pistachio Textured Block (Bottom Right) */}
      <rect x="44" y="70" width="51" height="25" fill="#9dbd83" />
      
      {/* Gray Textured Block (Top Center-Left) */}
      <path d="M 5 5 L 65 5 L 30 45 Z" fill="#b8b8b8" />

      {/* Main Structural Lines */}
      {/* Outer Square */}
      <rect 
        x="4" 
        y="4" 
        width="92" 
        height="92" 
        fill="none" 
        stroke="#1a1a1a" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Vertical Axis */}
      <line x1="30" y1="4" x2="30" y2="96" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      
      {/* Horizontal Tectonic (Bottom) */}
      <line x1="30" y1="70" x2="96" y2="70" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      
      {/* Diagonals */}
      <line x1="4" y1="25" x2="65" y2="85" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="4" x2="30" y2="45" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export default Logo;