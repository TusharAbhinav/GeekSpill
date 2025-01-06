//TODO Fix the code currently single user is able to add a multiple likes
"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CacheProps,
  getCache,
  updateCache,
} from "@/app/actions/update-likes_dislikes_cache";

interface LikesDislikesProps {
  url: string;
}

const HandleLikesAndDislikes = ({ url }: LikesDislikesProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: userID } = useQuery({
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

  const { data: serverData, isLoading:isLikesDislikesFetched } = useQuery({
    queryKey: ["cache", url],
    queryFn: async () => {
      if (!isVisible || !userID) return null;
      return await getCache(url);
    },
    enabled: isVisible && !!userID,
    staleTime: 5 * 60 * 1000,
  });

  const updateCacheMutation = useMutation({
    mutationFn: async (cacheData: CacheProps) => {
      return await updateCache(cacheData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cache", url] });
    },
  });

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState<"liked" | "disliked" | null>(
    null
  );
  useEffect(() => {
    if (serverData) {
      setLikes(serverData.totalLikes);
      setDislikes(serverData.totalDislikes);
      setUserAction(() => {
        if (userID && serverData?.[userID.id]) {
          return serverData[userID.id].hasLiked
            ? "liked"
            : serverData[userID.id].hasDisliked
            ? "disliked"
            : null;
        }
        return null;
      });
    }
  }, [serverData, userID]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [url]);

  const handleLike = () => {
    if (userAction !== "liked" && userID) {
      const newLikes = likes + 1;
      const newDislikes = userAction === "disliked" ? dislikes - 1 : dislikes;
      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserAction("liked");

      updateCacheMutation.mutate({
        totalLikes: newLikes,
        totalDislikes: newDislikes,
        url: url,
        userID: userID.id,
        hasLiked: true,
        hasDisliked: false,
      });
    }
  };

  const handleDislike = () => {
    if (userAction !== "disliked" && userID) {
      const newDislikes = dislikes + 1;
      const newLikes = userAction === "liked" ? likes - 1 : likes;

      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserAction("disliked");

      updateCacheMutation.mutate({
        totalLikes: newLikes,
        totalDislikes: newDislikes,
        url: url,
        userID: userID.id,
        hasLiked: false,
        hasDisliked: true,
      });
    }
  };

  const isButtonDisabled = useMemo(() => {
    return !userID || isLikesDislikesFetched;
  }, [userID, isLikesDislikesFetched]);

  return (
    <div ref={ref} className="flex gap-4 items-center">
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-brandSecondary"
        onClick={handleLike}
        disabled={isButtonDisabled}
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
        disabled={isButtonDisabled}
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
