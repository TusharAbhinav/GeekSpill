import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';


const GeekSpillIcon = ({ className = "" }) => {
  const logoRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!logoRef.current) return;
    
    const logo = logoRef.current;
    
    // Binary text animation
    const binaryElements = logo.querySelectorAll('.binary-text');
    binaryElements.forEach((binary, index) => {
      gsap.fromTo(binary,
        {
          opacity: 0,
          x: -10
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: index * 0.2,
          repeat: -1,
          repeatDelay: 3,
          ease: "power2.out"
        }
      );
    });

    // Quill pen animation
    const quill = logo.querySelector('.quill');
    if (quill) {
      gsap.to(quill, {
        rotate: -2,
        y: -2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        transformOrigin: "bottom"
      });
    }

    // Ink drop animation
    const inkDrops = logo.querySelectorAll('.ink-drop');
    inkDrops.forEach((drop, index) => {
      gsap.fromTo(drop,
        {
          scale: 0,
          opacity: 1,
          y: 0
        },
        {
          scale: 1,
          opacity: 0,
          y: 15,
          duration: 1,
          delay: index * 0.3,
          repeat: -1,
          repeatDelay: 2,
          ease: "power2.out"
        }
      );
    });

    return () => {
      gsap.killTweensOf(binaryElements);
      gsap.killTweensOf(quill);
      gsap.killTweensOf(inkDrops);
    };
  }, []);

  return (
    <svg
      ref={logoRef}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Digital Quill Logo"
    >
      {/* Quill Pen */}
      <g className="quill">
        <path
          d="M30 70 L45 30 C45 30, 48 25, 50 25 C52 25, 55 30, 55 30 L70 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M45 30 L55 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M48 40 L52 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Binary Text */}
      <text className="binary-text" x="20" y="80" fill="currentColor" fontSize="8">10</text>
      <text className="binary-text" x="35" y="80" fill="currentColor" fontSize="8">01</text>
      <text className="binary-text" x="50" y="80" fill="currentColor" fontSize="8">10</text>
      <text className="binary-text" x="65" y="80" fill="currentColor" fontSize="8">01</text>

      {/* Ink Drops */}
      <circle className="ink-drop" cx="50" cy="70" r="2" fill="currentColor" />
      <circle className="ink-drop" cx="45" cy="75" r="1.5" fill="currentColor" />
      <circle className="ink-drop" cx="55" cy="73" r="1.5" fill="currentColor" />

      {/* Base Line */}
      <path
        d="M20 85 C35 88, 65 88, 80 85"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default GeekSpillIcon;