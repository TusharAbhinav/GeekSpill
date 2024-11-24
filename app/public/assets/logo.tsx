import React from 'react';

export function Logo({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <style>
        {`
          @keyframes type {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes glow {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          .typing-line {
            stroke-dasharray: 24;
            animation: type 1.5s infinite linear;
          }
          .screen-glow {
            animation: glow 2s infinite ease-in-out;
          }
        `}
      </style>
      
      {/* Head with better shape */}
      <circle cx="50" cy="25" r="8" fill="currentColor" />
      
      {/* Body - Curved for better posture */}
      <path 
        d="M50,33 C50,33 50,45 50,48" 
        strokeWidth="3"
      />
      
      {/* Arms - More natural curve */}
      <path 
        d="M50,38 C50,38 35,35 32,42" 
        strokeWidth="3"
      />
      <path 
        d="M50,38 C50,38 65,35 68,42" 
        strokeWidth="3"
      />
      
      {/* Desk */}
      <line x1="20" y1="75" x2="80" y2="75" strokeWidth="3" />
      
      {/* Laptop base with perspective */}
      <path 
        d="M30,55 L70,55 L75,70 L25,70 Z" 
        className="screen-glow"
        fill="currentColor"
        fillOpacity="0.1"
      />
      
      {/* Screen with perspective */}
      <path 
        d="M32,35 L68,35 L70,55 L30,55 Z" 
        className="screen-glow"
        fill="currentColor"
        fillOpacity="0.1"
      />
      
      {/* Typing animation lines */}
      <line x1="35" y1="42" x2="55" y2="42" className="typing-line" />
      <line x1="35" y1="46" x2="60" y2="46" className="typing-line" strokeDashoffset="8" />
      <line x1="35" y1="50" x2="50" y2="50" className="typing-line" strokeDashoffset="16" />
      
      {/* Coffee mug */}
      <path 
        d="M75,60 L75,68 Q75,70 77,70 L82,70 Q84,70 84,68 L84,60" 
        strokeWidth="2"
      />
      <path d="M73,60 L86,60" strokeWidth="2" />
    </svg>
  );
}

export default Logo;