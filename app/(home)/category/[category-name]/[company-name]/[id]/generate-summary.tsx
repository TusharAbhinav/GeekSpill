"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Zap } from "lucide-react";
import ErrorHandler from "./error";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import {
  getSummaryCache,
  updateSummaryCache,
} from "@/app/actions/update-summary_cache";

const fetchSummary = async (url?: string) => {
  if (url) {
    const summaryResponse = (await getSummaryCache({ link: url })) as string;
    if (summaryResponse) return summaryResponse;
  }
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
  const summary = await response.json();
  await updateSummaryCache({
    link: url!,
    generatedSummary: JSON.stringify(summary)!,
  });
  return summary;
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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
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
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] max-h-[600px] p-0 bg-brand overflow-hidden border-0">
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
      </DrawerContent>
    </Drawer>
  );
};

export default GenerateSummary;
