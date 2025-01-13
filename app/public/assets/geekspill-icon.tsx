import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CoffeeLogoProps {
  className?: string;
}

const GeekSpillIcon: React.FC<CoffeeLogoProps> = ({ className = "" }) => {
  const logoRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    // Early return if ref is null
    if (!logoRef.current) return;

    // Get the current ref value to use in animations
    const logo = logoRef.current;
    
    // Steam animation timeline
    const steamTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
    });

    // Animate each steam line
    ['steam-1', 'steam-2', 'steam-3'].forEach((steam, index) => {
      const steamElement = logo.querySelector(`.${steam}`);
      if (!steamElement) return;

      steamTimeline.fromTo(
        steamElement,
        {
          opacity: 0,
          y: 0,
        },
        {
          opacity: 1,
          y: -10,
          duration: 1,
          ease: "power1.inOut",
        },
        index * 0.2
      ).to(
        steamElement,
        {
          opacity: 0,
          y: -20,
          duration: 1,
          ease: "power1.inOut",
        },
        ">-0.5"
      );
    });

    // Cup hover animation
    const cupElement = logo.querySelector('.coffee-cup');
    if (cupElement) {
      const cupAnimation = gsap.to(cupElement, {
        y: -2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Cleanup
      return () => {
        steamTimeline.kill();
        cupAnimation.kill();
      };
    }
  }, []);

  return (
    <svg
      ref={logoRef}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Coffee cup logo"
    >
      {/* Main Cup Body */}
      <path
        className="coffee-cup"
        d="M25 40 C25 40, 25 75, 25 75 C25 85, 35 90, 50 90 C65 90, 75 85, 75 75 C75 75, 75 40, 75 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Coffee Surface */}
      <path
        d="M25 45 C35 48, 65 48, 75 45"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Cup Rim */}
      <path
        d="M22 40 C35 37, 65 37, 78 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Handle */}
      <path
        d="M75 50 C85 50, 90 55, 90 62.5 C90 70, 85 75, 75 75"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Steam Lines */}
      <path
        className="steam steam-1"
        d="M35 20 C38 18, 37 12, 35 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="steam steam-2"
        d="M45 15 C48 13, 47 7, 45 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="steam steam-3"
        d="M55 20 C58 18, 57 12, 55 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Saucer */}
      <path
        d="M20 92 C35 95, 65 95, 80 92"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default GeekSpillIcon;