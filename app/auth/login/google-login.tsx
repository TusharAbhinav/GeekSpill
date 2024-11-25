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
      variant="outline"
      className="w-min bg-[#1a1a1a] text-white rounded-[12px]"
      onClick={handleGoogleLogin}
    >
      <GoogleLogo />
      Log in with Google
    </Button>
  );
};

export default GoogleLogin;
