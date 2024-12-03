"use client";

import ErrorHandler from "@/app/(home)/category/[category-name]/[company-name]/[id]/error";
import GoogleLogo from "@/app/public/assets/google-logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";

const GoogleLogin = () => {
  const [error, setError] = useState<AuthError | null>(null);
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
    if (error) setError(error);
  };
  if (error) {
    return <ErrorHandler error={error.message} />;
  }
  return (
    <Button
      className="w-[100%]  bg-brand text-white rounded-[12px] hover:bg-brandSecondary"
      onClick={handleGoogleLogin}
    >
      <GoogleLogo />
      Log in with Google
    </Button>
  );
};

export default GoogleLogin;
