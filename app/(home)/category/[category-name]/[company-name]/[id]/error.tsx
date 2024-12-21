"use client";

import { toast } from "@/hooks/use-toast";
import { notFound } from "next/navigation";

export default function ErrorHandler({ error }: { error: string }) {
  toast({
    title: "An unexpected error occurred",
    description: error,
    variant: "destructive",
  });

  return notFound();
}
