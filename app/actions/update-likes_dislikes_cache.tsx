"use server";

import { Redis } from "@upstash/redis";

export interface CacheProps {
  totalLikes: number;
  totalDislikes: number;
  url: string;
  userID: string;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const createRedisClient = () => {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
};

export const updateCache = async ({
  totalLikes,
  totalDislikes,
  url,
  userID,
  hasDisliked = false,
  hasLiked = false,
}: CacheProps) => {
  try {
    const redis = createRedisClient();
    await redis.set(`likes:${url}`, {
      totalLikes,
      totalDislikes,
      [userID]: {
        hasLiked: hasLiked,
        hasDisliked: hasDisliked,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cache update error:", error.message);
      throw new Error(error.message);
    }
  }
};

export const getCache = async (key: string) => {
  try {
    const redis = createRedisClient();
    return await redis.get<CacheProps>(`likes:${key}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cache retrieval error:", error.message);
      throw new Error(error.message);
    }
  }
};
