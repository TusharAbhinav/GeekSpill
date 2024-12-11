"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import {
  updateCache,
  getCache,
  CacheProps,
} from "@/app/actions/update-likes_dislikes_cache";
import ErrorHandler from "@/app/(home)/category/[category-name]/[company-name]/[id]/error";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface LikesDislikesProps {
  url: string;
}

const HandleLikesAndDislikes = ({ url }: LikesDislikesProps) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState<"liked" | "disliked" | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const { data: userID, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const localData = JSON.parse(localStorage.getItem(url) || "null");

        if (localData) {
          setLikes(localData.totalLikes || 0);
          setDislikes(localData.totalDislikes || 0);
          setUserAction(localData.userAction || null);

          if (localData.unsynced && userID) {
            await updateCache({
              totalLikes: localData.totalLikes,
              totalDislikes: localData.totalDislikes,
              url: url,
              userID: userID.id,
              hasLiked: localData.userAction === "liked",
              hasDisliked: localData.userAction === "disliked",
            });
            localData.unsynced = false;
            localStorage.setItem(url, JSON.stringify(localData));
          }
        } else if (isVisible && userID) {
          const serverData = (await getCache(url)) as CacheProps;
          if (serverData) {
            setLikes(serverData.totalLikes || 0);
            setDislikes(serverData.totalDislikes || 0);

            const userData = serverData[userID.id ] ;
            if (userData?.hasLiked) setUserAction("liked");
            if (userData?.hasDisliked) setUserAction("disliked");

            localStorage.setItem(
              url,
              JSON.stringify({
                totalLikes: serverData.totalLikes,
                totalDislikes: serverData.totalDislikes,
                userAction: userData?.hasLiked
                  ? "liked"
                  : userData?.hasDisliked
                  ? "disliked"
                  : null,
                unsynced: false,
              })
            );
          }
        }
      } catch (error) {
        if (error instanceof Error)
          return <ErrorHandler error={error.message} />;
      }
    };

    if (isVisible) initializeData();
  }, [url, userID, isVisible]);

  const handleLike = async () => {
    if (userAction !== "liked" && userID) {
      const newLikes = likes + 1;
      const newDislikes = userAction === "disliked" ? dislikes - 1 : dislikes;
      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserAction("liked");

      localStorage.setItem(
        url,
        JSON.stringify({
          totalLikes: newLikes,
          totalDislikes: newDislikes,
          userAction: "liked",
          unsynced: true,
        })
      );

      try {
        await updateCache({
          totalLikes: newLikes,
          totalDislikes: newDislikes,
          url: url,
          userID: userID.id,
          hasLiked: true,
          hasDisliked: false,
        });

        localStorage.setItem(
          url,
          JSON.stringify({
            totalLikes: newLikes,
            totalDislikes: newDislikes,
            userAction: "liked",
            unsynced: false,
          })
        );
      } catch (error) {
        if (error instanceof Error)
          return <ErrorHandler error={error.message} />;
      }
    }
  };

  const handleDislike = async () => {
    if (userAction !== "disliked" && userID) {
      const newDislikes = dislikes + 1;
      const newLikes = userAction === "liked" ? likes - 1 : likes;
      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserAction("disliked");

      localStorage.setItem(
        url,
        JSON.stringify({
          totalLikes: newLikes,
          totalDislikes: newDislikes,
          userAction: "disliked",
          unsynced: true,
        })
      );

      try {
        await updateCache({
          totalLikes: newLikes,
          totalDislikes: newDislikes,
          url: url,
          userID: userID.id,
          hasLiked: false,
          hasDisliked: true,
        });

        localStorage.setItem(
          url,
          JSON.stringify({
            totalLikes: newLikes,
            totalDislikes: newDislikes,
            userAction: "disliked",
            unsynced: false,
          })
        );
      } catch (error) {
        if (error instanceof Error)
          return <ErrorHandler error={error.message} />;
      }
    }
  };
  return (
    <div ref={ref} className="flex gap-4 items-center">
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-brandSecondary"
        onClick={handleLike}
        disabled={isLoading}
      >
        <ThumbsUp
          color={userAction === "liked" ? "#10B981" : "#9CA3AF"}
          size={15}
        />
        <span className="text-gray-500 text-sm">{likes}</span>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-brandSecondary"
        onClick={handleDislike}
        disabled={isLoading}
      >
        <ThumbsDown
          color={userAction === "disliked" ? "#EF4444" : "#9CA3AF"}
          size={15}
        />
        <span className="text-gray-500 text-sm">{dislikes}</span>
      </Button>
    </div>
  );
};

export default HandleLikesAndDislikes;
