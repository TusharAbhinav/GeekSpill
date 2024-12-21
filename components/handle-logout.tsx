"use client";
import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const HandleLogout = () => {
  const supabase = createClient();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  return (
    <Button variant="destructive" className="rounded-md" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default HandleLogout;
