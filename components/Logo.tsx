
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Frame */}
    <rect x="5" y="5" width="90" height="90" fill="none" stroke="black" strokeWidth="3" strokeLinejoin="round" />
    
    {/* Grey Triangle (top left area) */}
    <path d="M 5 5 L 65 5 L 35 50 Z" fill="#b1b1b1" opacity="0.8" />
    
    {/* Green Rectangle (bottom right area) */}
    <rect x="45" y="70" width="50" height="25" fill="#a8bc8c" opacity="0.8" />
    
    {/* Geometric Lines */}
    <line x1="35" y1="50" x2="65" y2="85" stroke="black" strokeWidth="2.5" />
    <line x1="35" y1="50" x2="35" y2="95" stroke="black" strokeWidth="2.5" />
    <line x1="45" y1="70" x2="95" y2="70" stroke="black" strokeWidth="2.5" />
    <line x1="45" y1="5" x2="45" y2="70" stroke="black" strokeWidth="2.5" />
    <line x1="5" y1="30" x2="35" y2="50" stroke="black" strokeWidth="2.5" />
  </svg>
);

export default Logo;
