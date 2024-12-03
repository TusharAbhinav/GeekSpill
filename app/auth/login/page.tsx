"use client";
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
import { Sparkles, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import MagicLinkLogin from "./magic-link";

const LoginScreen = () => {
  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{
        backgroundColor: "#242424",
        backgroundImage: `url("${svgBackground}")`,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl"
        >
          <div className="flex flex-col items-center">
            <Badge
              variant="secondary"
              className="mb-4 bg-brand hover:bg-brandSecondary text-white border-none"
            >
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Tech Insights Reimagined
            </Badge>

            <h1
              className="text-5xl font-extrabold text-white 
              mb-4 tracking-tight leading-tight"
            >
              GeekSpill
            </h1>

            <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-6 font-medium">
              Elevate Your Tech Knowledge: Curated Insights, Cutting-Edge
              Trends, and Industry Breakthroughs at Your Fingertips
            </p>

            <div className="text-lg text-zinc-400 h-10 max-w-2xl mx-auto">
              <TypeAnimationComponent />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-purple-400" />,
              title: "Cutting-Edge Insights",
              description:
                "Stay ahead with the latest tech trends and in-depth analysis.",
              content:
                "Real-time updates from industry leaders and innovative startups.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
              title: "Secure Access",
              description: "Your data privacy is our top priority.",
              content: "Enterprise-grade security with Google authentication.",
            },
            {
              icon: <Zap className="w-6 h-6 text-yellow-400" />,
              title: "Personalized Experience",
              description: "Tailored content that matches your tech interests.",
              content: "Discover content curated just for you.",
            },
          ].map((card, index) => (
            <Card
              key={index}
              className="bg-[#2b2b2b] backdrop-blur-lg border-white/10"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {card.icon}
                  {card.title}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-zinc-300">
                {card.content}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className=" flex flex-col gap-4 mt-8 max-w-md">
          <GoogleLogin />
          <MagicLinkLogin />
        </div>
      </main>
    </div>
  );
};

export default LoginScreen;
