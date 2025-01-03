"use client";

import { useEffect, useRef } from "react";
import { svgBackground } from "@/app/public/assets/pattern-randomized";
import TypeAnimationComponent from "@/components/type-animation";
import GoogleLogin from "./google-login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Zap, TrendingUp, FileText, ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import MagicLinkLogin from "./magic-link";
import gsap from "gsap";

const LoginScreen = () => {
  const cardsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(
      cardsRef.current.children,
      {
        opacity: 1,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    );

    const cards = Array.from(cardsRef.current.children);

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

      card.addEventListener("mouseenter", () => enterAnimation.play());
      card.addEventListener("mouseleave", () => leaveAnimation.play());

      return { enterAnimation, leaveAnimation, element: card };
    });

    const badgeAnimation = gsap.to(".floating-badge", {
      y: "-8px",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => {
      cardAnimations.forEach(({ enterAnimation, leaveAnimation, element }) => {
        enterAnimation.kill();
        leaveAnimation.kill();
        element.replaceWith(element.cloneNode(true));
      });
      badgeAnimation.kill();
    };
  }, []);

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

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              GeekSpill
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-6 font-medium">
              Elevate Your Tech Knowledge: Curated Insights, Cutting-Edge
              Trends, and Industry Breakthroughs at Your Fingertips
            </p>

            <div className="text-base md:text-lg text-zinc-400 h-10 max-w-2xl mx-auto">
              <TypeAnimationComponent />
            </div>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-11 lg:mb-8 md:mb-10 w-full max-w-6xl"
        >
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-purple-400" />,
              title: "Diverse Content",
              description: "Explore a wide range of tech topics.",
              content: "From AI and System Design to Engineering and beyond.",
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
          ].map((card, index) => (
            <Card
              key={index}
              className="bg-[#2b2b2b]  backdrop-blur-lg border-white/10 relative overflow-hidden group"
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

