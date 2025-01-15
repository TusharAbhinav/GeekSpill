"use client";

import { getSavedArticlesRepository } from "@/utils/supabase/saved-articles";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Loading from "../category/[category-name]/[company-name]/[id]/loading";
import { toast } from "@/hooks/use-toast";
import FeedMetadata from "@/components/display-feed-metadata";
import { Bookmark } from "lucide-react";

const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getTime() > 86400000 && !isNaN(date.getTime());
};

const SavedArticles = () => {
  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article"],
    queryFn: async () => {
      const savedArticleRepo = getSavedArticlesRepository();
      const { data, error } = await savedArticleRepo.getUserSavedArticles();
      return { data, error };
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isLoading) return <Loading />;

  if (isError || articles?.error) {
    toast({
      title: "Error",
      description: "Failed to load articles",
      variant: "destructive",
    });
    return null;
  }

  if (!articles?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h2>
        <p className="text-gray-400">Your bookmarked articles will appear here</p>
      </div>
    );
  }

  return articles.data.map((article, index) => {
    const validDate = article.publication_date && isValidDate(article.publication_date.toString());
    
    return (
      <article
        key={index}
        className="bg-brand p-2 sm:p-4 rounded-lg shadow-md flex flex-col"
      >
        <header className="mb-2 sm:mb-4 border-b border-gray-700 pb-2">
          {article.article_title && (
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {article.article_title}
            </h2>
          )}
          <FeedMetadata
            creator={article.article_creator!}
            link={article.article_link!}
            pubDate={validDate ? article.publication_date!.toString() : ''}
            title={article.article_title!}
            content={article.article_content!}
          />
        </header>
        {article.article_content && (
          <div
            className="prose prose-invert max-w-none
                        prose-headings:text-white 
                        prose-a:text-blue-400 
                        prose-strong:text-white
                        prose-code:text-white
                        prose-img:w-full
                        prose-pre:bg-brandSecondary
                        prose-sm sm:prose-base
                        "
            dangerouslySetInnerHTML={{
              __html: article.article_content!,
            }}
          />
        )}
      </article>
    );
  });
};

export default SavedArticles;