import Logo from "@/app/public/assets/logo";
import { svgBackground } from "@/app/public/pattern-randomized";
import TypeAnimationComponent from "@/components/type-animation";
import { Metadata } from "next";
import GoogleLogin from "./google-login";

export const metadata: Metadata = {
  title: "GeekSpill",
  description:
    "Your one-stop destination for the latest tech insights from industry giants",
};
const LoginScreen = () => {
  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{
        backgroundImage: `url("${svgBackground}")`,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center ">
        <section className="text-center p-8 max-w-4xl w-full">
          <div className="flex flex-col items-center justify-center ">
            <h1 className="text-xxl font-bold text-white">
              <span className="flex items-center gap-2">
                Stay Ahead with GeekSpill <Logo />
              </span>
            </h1>
          </div>
          <section className="flex flex-col gap-5 text-center items-center">
            <div className="text-lg text-zinc-400 mt-6 px-3.5 h-16 max-w-2xl mx-auto">
              <TypeAnimationComponent />
            </div>
            <GoogleLogin />
          </section>
        </section>
      </main>
    </div>
  );
};

export default LoginScreen;
