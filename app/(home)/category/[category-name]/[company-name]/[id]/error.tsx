"use client";

import { toast } from "@/hooks/use-toast";

export default function ErrorHandler({ error }: { error: string }) {
  toast({
    title: "An unexpected error occurred",
    description: error,
    variant: "destructive",
  });

  return (
    <div className="p-4 text-red-500">
      <p>{error}</p>
    </div>
  );
}
