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
  const handleLogInWithEmail = async () => {
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
  const [handleText, setHandleText] = useState<string>("");

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
    <section className="flex gap-4">
      <Input
        type="email"
        name="Email"
        placeholder="Email"
        className="bg-brand  placeholder:text-zinc-400 focus-visible:bg-brandSecondary text-white  rounded-[12px] border-0 hover:bg-brandSecondary"
        onChange={(e) => setHandleText(e.target.value)}
      />
      <Button
        className="w-min  bg-brand text-white rounded-[12px] hover:bg-brandSecondary"
        onClick={handleLogInWithEmail}
        type="submit"
        disabled={loading}
      >
        <Mail />
        Log in with Mail
      </Button>
    </section>
  );
};

export default MagicLinkLogin;
