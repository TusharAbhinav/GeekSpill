"use client";

import GoogleLogo from "@/app/public/assets/google-logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
  };

  return (
    <Button
      className="w-min  bg-brand text-white rounded-[12px] hover:bg-brandSecondary"
      onClick={handleGoogleLogin}
    >
      <GoogleLogo />
      Log in with Google
    </Button>
  );
};

export default GoogleLogin;
