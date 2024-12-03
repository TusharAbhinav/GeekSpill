"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

const MagicLinkLogin = () => {
  const handleLogInWithEmail = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email: handleText,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });
  };

  const [handleText, setHandleText] = useState<string>("");
  useEffect(() => console.log(handleText), [handleText]);

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
      >
        <Mail />
        Log in with Mail
      </Button>
    </section>
  );
};

export default MagicLinkLogin;
