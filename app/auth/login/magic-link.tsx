"use client";

import ErrorHandler from "@/app/(home)/category/[category-name]/[company-name]/[id]/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Mail } from "lucide-react";
import { useState } from "react";

const MagicLinkLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [successLogin, setSuccessLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [handleText, setHandleText] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleLogInWithEmail = async () => {
    if (!validateEmail(handleText)) {
      return;
    }

    try {
      const supabase = createClient();
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email: handleText,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
      });
      if (error) throw new Error(error.message);
      else if (data) setSuccessLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHandleText(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  if (error) {
    return <ErrorHandler error={error} />;
  }
  if (successLogin) {
    toast({
      title: "Magic Link has been sent to your mail",
      description: "Please check your mail for activation link",
      variant: "default",
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <section className="flex gap-4">
        <Input
          type="email"
          name="Email"
          placeholder="Email"
          className="bg-brand border-white/10 placeholder:text-white focus-visible:bg-brandSecondary text-white rounded-[12px] hover:bg-brandSecondary"
          onChange={handleInputChange}
          value={handleText}
        />
        <Button
          className="w-min bg-brand  border-[1px] border-white/10 text-white rounded-[12px] hover:bg-brandSecondary"
          onClick={handleLogInWithEmail}
          type="submit"
          disabled={loading || !!emailError}
        >
          <Mail />
          Log in with Mail
        </Button>
      </section>
      {emailError && (
        <span className="text-red-500 text-sm ml-1">{emailError}</span>
      )}
    </div>
  );
};

export default MagicLinkLogin;