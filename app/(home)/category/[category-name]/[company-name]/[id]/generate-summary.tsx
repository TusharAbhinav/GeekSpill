"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Zap } from "lucide-react";
import ErrorHandler from "./error";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

const fetchSummary = async (url?: string) => {
  const response = await fetch(`/api/generate-summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch summary: ${response.statusText}`);
  }

  return response.json();
};

const GenerateSummary = ({ url }: { url?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["summary", url],
    queryFn: () => fetchSummary(url),

    enabled: false,
    staleTime: Infinity,
    retry: false,
  });

  const summary = data?.summaryGenerated || "";

  if (error instanceof Error) {
    return <ErrorHandler error={error.message} />;
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-brand shadow-none w-[20px] hover:bg-brandSecondary"
            onClick={() => {
              setIsOpen(true);
              if (!summary) refetch();
            }}
          >
            <Zap color="#9CA3AF" size={"20px"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[90vw] max-w-[600px] h-[80vh] max-h-[600px] p-0 bg-brand overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            {isLoading ? (
              <Loader className="animate-spin text-white" size={24} />
            ) : (
              <div className="w-full h-full overflow-y-auto p-4">
                <div
                  className="prose prose-invert max-w-none
                    prose-headings:text-white 
                    prose-strong:text-white
                    prose-code:text-white
                    prose-pre:bg-brandSecondary
                  "
                  dangerouslySetInnerHTML={{
                    __html: summary || "No summary available.",
                  }}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default GenerateSummary;
