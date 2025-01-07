"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CacheData,
  CacheProps,
  getCache,
  updateCache,
} from "@/app/actions/update-likes_dislikes_cache";

interface LikesDislikesProps {
  url: string;
}

const calculateTotals = (data: CacheData) => {
  if (!data?.userID) return { totalLikes: 0, totalDislikes: 0 };
  
  return Object.values(data.userID).reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: { totalLikes: number; totalDislikes: number }, curr: any) => {
      if (curr.hasLiked) acc.totalLikes += 1;
      if (curr.hasDisliked) acc.totalDislikes += 1;
      return acc;
    },
    { totalLikes: 0, totalDislikes: 0 }
  );
};

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

  const { data: serverData, isLoading: isLikesDislikesFetched } = useQuery({
    queryKey: ["cache", url],
    queryFn: async () => {
      if (!isVisible || !userID) return null;
      return await getCache(url);
    },
    enabled: isVisible && !!userID,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const updateCacheMutation = useMutation({
    mutationFn: async (cacheData: CacheProps) => {
      return await updateCache(cacheData);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["cache", url] });
      const previousData = queryClient.getQueryData(["cache", url]);

      // Optimistically update cache
      queryClient.setQueryData(["cache", url], (old: CacheData) => ({
        userID: {
          ...(old?.userID || {}),
          [newData.userID]: {
            hasLiked: newData.hasLiked,
            hasDisliked: newData.hasDisliked,
            totalLikes: newData.totalLikes,
            totalDislikes: newData.totalDislikes,
          },
        },
      }));

      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["cache", url], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cache", url] });
    },
  });

  const [userAction, setUserAction] = useState<"liked" | "disliked" | null>(null);
  const [totals, setTotals] = useState({ totalLikes: 0, totalDislikes: 0 });

  useEffect(() => {
    if (serverData) {
      const newTotals = calculateTotals(serverData);
      setTotals(newTotals);
      if (userID && serverData.userID[userID.id]) {
        const userData = serverData.userID[userID.id];
        setUserAction(
          userData.hasLiked ? "liked" : userData.hasDisliked ? "disliked" : null
        );
      }
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
    if (!userID) return;

    const currentUserData = serverData?.userID?.[userID.id] || {
      hasLiked: false,
      hasDisliked: false,
      totalLikes: 0,
      totalDislikes: 0,
    };

    const newData = {
      hasLiked: !currentUserData.hasLiked,
      hasDisliked: false,
      totalLikes: !currentUserData.hasLiked ? 1 : 0,
      totalDislikes: 0,
    };

    setUserAction(newData.hasLiked ? "liked" : null);
    setTotals(prev => ({
      totalLikes: prev.totalLikes + (newData.hasLiked ? 1 : -1),
      totalDislikes: prev.totalDislikes - (currentUserData.hasDisliked ? 1 : 0),
    }));

    updateCacheMutation.mutate({
      ...newData,
      url,
      userID: userID.id,
    });
  };

  const handleDislike = () => {
    if (!userID) return;

    const currentUserData = serverData?.userID?.[userID.id] || {
      hasLiked: false,
      hasDisliked: false,
      totalLikes: 0,
      totalDislikes: 0,
    };

    const newData = {
      hasLiked: false,
      hasDisliked: !currentUserData.hasDisliked,
      totalLikes: 0,
      totalDislikes: !currentUserData.hasDisliked ? 1 : 0,
    };

    // Optimistically update UI
    setUserAction(newData.hasDisliked ? "disliked" : null);
    setTotals(prev => ({
      totalLikes: prev.totalLikes - (currentUserData.hasLiked ? 1 : 0),
      totalDislikes: prev.totalDislikes + (newData.hasDisliked ? 1 : -1),
    }));

    updateCacheMutation.mutate({
      ...newData,
      url,
      userID: userID.id,
    });
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
        <span className="text-gray-500 text-sm">{totals.totalLikes}</span>
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
        <span className="text-gray-500 text-sm">{totals.totalDislikes}</span>
      </Button>
    </div>
  );
};

export default HandleLikesAndDislikes;