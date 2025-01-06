"use client";

import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
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
import { Bookmark } from "lucide-react";
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
import { getSavedArticlesRepository } from "@/utils/supabase/saved-articles";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

dayjs.extend(advancedFormat);

interface FeedMetadataProps {
  title: string;
  creator: string;
  pubDate: string;
  link: string;
  content: string;
}

export default function FeedMetadata({
  creator,
  pubDate,
  link,
  content,
  title,
}: FeedMetadataProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();

  const { data: userID } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: isArticleSaved, isLoading: isCheckingSaved } = useQuery({
    queryKey: ["saved-article", link],
    queryFn: async () => {
      if (!isVisible || !userID) return false;
      const savedArticleRepo = getSavedArticlesRepository();
      const { exists, error } = await savedArticleRepo.isArticleSaved(link);
      if (error) throw new Error(error.message);
      return exists;
    },
    enabled: isVisible && !!userID,
    staleTime: Infinity,
  });

  const saveArticleMutation = useMutation({
    mutationFn: async () => {
      const savedArticleRepo = getSavedArticlesRepository();
      return await savedArticleRepo.addSavedArticle({
        article_title: title,
        article_link: link,
        article_content: content,
        article_creator: creator,
        publication_date: new Date(pubDate),
        user_id: userID!.id!,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-article", link] });
      toast({
        title: "Success",
        description: "Article bookmarked successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Alert",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSaveArticle = async () => {
    if (isArticleSaved) {
      return;
    }
    saveArticleMutation.mutate();
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("Do MMMM, YYYY");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isButtonDisabled =
    !userID || isCheckingSaved || saveArticleMutation.isPending;

  const BookmarkButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            className="bg-brand shadow-none w-[20px] hover:bg-brandSecondary"
            disabled={isButtonDisabled}
            onClick={handleSaveArticle}
          >
            <Bookmark
              color={isArticleSaved ? "#FFD700" : "#9CA3AF"}
              size={"20px"}
              fill={isArticleSaved ? "#FFD700" : "none"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isArticleSaved ? "Article Bookmarked" : "Bookmark Article"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (!isMobile) {
    return (
      <TooltipProvider>
        <div
          ref={ref}
          className="flex items-center text-s text-gray-400 my-2 space-x-2"
        >
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
                  {formatDate(pubDate)}
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
              <div>
                <GenerateSummary url={link!} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Generate Summary</TooltipContent>
          </Tooltip>
          <HandleLikesAndDislikes url={link!} />
          <BookmarkButton />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div ref={ref}>
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
                <span className="px-3">{formatDate(pubDate)}</span>
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
            <div className="flex items-center gap-4">
              <GenerateSummary url={link!} />
              <HandleLikesAndDislikes url={link!} />
              <BookmarkButton />
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
    </div>
  );
}
