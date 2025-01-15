"use client";

import { useEffect, useRef } from "react";
import { svgBackground } from "@/app/public/assets/pattern-randomized";
import GoogleLogin from "./google-login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, TrendingUp, FileText, ThumbsUp, Building } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import MagicLinkLogin from "./magic-link";
import gsap from "gsap";
import GeekSpillLogo from "@/app/public/assets/geekspill-icon";

const LoginScreen = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const letterGRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (letterGRef.current) {
      letterGRef.current.style.display = 'inline-block';
      
      const gTimeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 1
      });

      gTimeline
        .to(letterGRef.current, {
          rotation: 360,
          duration: 1,
          ease: "power2.inOut"
        })
        .to(letterGRef.current, {
          scale: 1.5,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        })
        .to(letterGRef.current, {
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        })
        .to(letterGRef.current, {
          y: -20,
          duration: 0.4,
          ease: "power2.out"
        })
        .to(letterGRef.current, {
          y: 0,
          duration: 0.4,
          ease: "bounce.out"
        })
        .to(letterGRef.current, {
          rotationY: 360,
          duration: 1,
          ease: "power1.inOut"
        });

      letterGRef.current.addEventListener('mouseenter', () => {
        gsap.to(letterGRef.current, {
          scale: 1.8,
          color: '#4ade80',
          duration: 0.3,
          ease: "power2.out"
        });
      });

      letterGRef.current.addEventListener('mouseleave', () => {
        gsap.to(letterGRef.current, {
          scale: 1,
          color: '#4ade80',
          duration: 0.3,
          ease: "power2.in"
        });
      });
    }

    const initAnimations = () => {
      if (!cardsRef.current) return;

      const tl = gsap.timeline();

      tl.from(
        cardsRef.current.children as HTMLCollection,
        {
          opacity: 0, 
          y: 50,     
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
        }
      );

      const cards = Array.from(cardsRef.current.children) as HTMLElement[];

      const cardAnimations = cards.map((card) => {
        const enterAnimation = gsap.to(card, {
          scale: 1.03,
          duration: 0.3,
          ease: "power2.out",
          paused: true,
        });

        const leaveAnimation = gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          paused: true,
        });

        const handleEnter = () => enterAnimation.play();
        const handleLeave = () => leaveAnimation.play();

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);

        return { enterAnimation, leaveAnimation, element: card, handlers: { handleEnter, handleLeave } };
      });

      const badge = document.querySelector(".floating-badge") as HTMLElement;
      if (badge) {
        const badgeAnimation = gsap.to(badge, {
          y: "-8px",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 0.5,
        });

        return () => {
          cardAnimations.forEach(({ enterAnimation, leaveAnimation, element, handlers }) => {
            enterAnimation.kill();
            leaveAnimation.kill();
            element.removeEventListener("mouseenter", handlers.handleEnter);
            element.removeEventListener("mouseleave", handlers.handleLeave);
          });
          badgeAnimation.kill();
          if (letterGRef.current) {
            gsap.killTweensOf(letterGRef.current);
          }
        };
      }
    };

    const timeoutId = setTimeout(initAnimations, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const cards = [
    {
      icon: <Building className="w-6 h-6 text-purple-400" />,
      title: "Tech Giants' Blogs",
      description: "All major tech blogs in one place",
      content: "Access technical articles from Google, Microsoft, Meta, AWS, and more.",
      gradient: "from-purple-500/20 to-transparent",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      title: "Summarized Insights",
      description: "Get key points quickly and efficiently.",
      content: "Concise summaries of complex tech articles and trends.",
      gradient: "from-blue-500/20 to-transparent",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Personalized Content",
      description: "Content tailored to your specific interests.",
      content: "Discover articles curated just for you.",
      gradient: "from-yellow-500/20 to-transparent",
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-green-400" />,
      title: "Community-Driven",
      description: "Engage with fellow tech enthusiasts.",
      content: "Vote on articles and shape the platform's content.",
      gradient: "from-green-500/20 to-transparent",
    },
  ];

  return (
    <div
      className="min-h-screen relative bg-cover bg-center overflow-hidden"
      style={{
        backgroundColor: "#242424",
        backgroundImage: `url("${svgBackground}")`,
      }}
    >
      <main className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 md:mb-12 max-w-4xl">
          <div className="flex flex-col items-center">
            <Badge
              variant="secondary"
              className="floating-badge mb-4 bg-brand hover:bg-brandSecondary text-white border-none"
            >
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Tech Insights Reimagined
            </Badge>

            <div className="flex items-center gap-4 mb-4">
              <GeekSpillLogo className="w-12 h-12 md:w-16 md:h-16 text-white" />
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                <span ref={letterGRef} className="text-white">G</span>eekSpill
              </h1>
            </div>

            <p className="text-md md:text-md text-zinc-300 max-w-2xl mx-auto mb-6 font-medium">
              Your central hub for technical blogs from leading tech companies. Stop jumping between different websites - access all technical content in one place.
            </p>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-11 lg:mb-8 md:mb-10 w-full max-w-6xl"
        >
          {cards.map((card, index) => (
            <Card
              key={index}
              className="bg-[#2b2b2b] backdrop-blur-lg border-white/10 relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  {card.icon}
                  {card.title}
                </CardTitle>
                <CardDescription className="text-zinc-400 text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-zinc-300 relative text-sm">
                {card.content}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-4 md:mt-8 w-full max-w-md">
          <GoogleLogin />
          <MagicLinkLogin />
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;