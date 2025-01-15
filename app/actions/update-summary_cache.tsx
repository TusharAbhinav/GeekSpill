"use server";
import { Redis } from "@upstash/redis";

interface updateSummaryCacheProps {
  link: string;
  generatedSummary: string;
}
interface getSummaryCacheProps {
  link: string;
}

const createRedisClient = () => {
  return new Redis({
    url: process.env.UPSTASH_REDIS_GENERATE_SUMMARY_URL!,
    token: process.env.UPSTASH_REDIS_GENERATE_SUMMARY_TOKEN!,
  });
};
export const updateSummaryCache = async ({
  link,
  generatedSummary,
}: updateSummaryCacheProps) => {
  try {
    const redis = createRedisClient();
    await redis.set(link, generatedSummary);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cache update error:", error.message);
      throw new Error(error.message);
    }
  }
};
export const getSummaryCache = async ({ link }: getSummaryCacheProps) => {
  const redis = createRedisClient();
  return await redis.get(link);
};
