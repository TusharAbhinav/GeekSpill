"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateIcon } from "@/app/public/assets/date-icon";
import { SquareArrowUpRight, User, Info } from "lucide-react";
import HandleLikesAndDislikes from "@/components/handle-likes_dislikes";
import GenerateSummary from "@/app/(home)/category/[category-name]/[company-name]/[id]/generate-summary";

interface FeedMetadataProps {
  title: string;
  creator: string;
  pubDate: string;
  link: string;
}

export default function FeedMetadata({
  creator,
  pubDate,
  link,
}: FeedMetadataProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) {
    return (
      <TooltipProvider>
        <div className="flex items-center text-s text-gray-400 my-2 space-x-2">
          {creator && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-4">
                  <User size="20px" />
                  <span className="w-[100%]">{creator}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Article Author</p>
              </TooltipContent>
            </Tooltip>
          )}
          {pubDate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center">
                  <DateIcon />
                  {new Date(pubDate).toLocaleDateString()}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Publication Date</p>
              </TooltipContent>
            </Tooltip>
          )}
          {link && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500 ml-2"
                >
                  <SquareArrowUpRight size={"20px"} />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Original Article</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 ml-2"
              >
                <GenerateSummary url={link!} />
              </a>
            </TooltipTrigger>
            <TooltipContent>Generate Summary</TooltipContent>
          </Tooltip>
          <HandleLikesAndDislikes url={link!} />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex items-center text-gray-400 hover:text-white transition-colors py-3"
                onClick={() => setIsOpen(true)}
              >
                <Info size="20px" className="mr-2" />
                Article Details
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Article Information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DrawerTrigger>
      <DrawerContent className="bg-brand border-0 text-gray-400">
        <DrawerHeader>
          <DrawerTitle className="text-gray-400">Article Details</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          {creator && (
            <div className="flex items-center gap-4">
              <User size="20px" />
              <span className="px-3">{creator}</span>
            </div>
          )}
          {pubDate && (
            <div className="flex items-center gap-4">
              <DateIcon />
              <span className="px-3">
                {new Date(pubDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {link && (
            <div className="flex items-center gap-4">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 flex items-center"
              >
                <SquareArrowUpRight size="20px" className="mr-2" />
                <span className="px-4">Open Article</span>
              </a>
            </div>
          )}
          <div className="flex space-x-4">
            <GenerateSummary url={link!} />
            <HandleLikesAndDislikes url={link!} />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="bg-brandSecondary rounded-md hover:bg-brand"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
