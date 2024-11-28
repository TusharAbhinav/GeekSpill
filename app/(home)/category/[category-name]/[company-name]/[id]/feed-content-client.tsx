import { RSSFeed } from "@/utils/supabase/rss-feeds";
import { notFound } from "next/navigation";
import ErrorHandler from "./error"; // Client-side error handler for toasts

type InitialFeedData = {
  data: RSSFeed[] | null;
  error: { details: string } | null;
};

async function fetchFeedContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching feed content:", error);
    throw new Error("Failed to load feed content for");
  }
}

export default async function FeedContentClient({
  initialFeedData,
}: {
  initialFeedData: InitialFeedData;
}) {
  if (initialFeedData.error) {
    return (
      <ErrorHandler
        error={`Failed to fetch feed: ${initialFeedData.error.details}`}
      />
    );
  }

  if (!initialFeedData.data || initialFeedData.data.length === 0) {
    notFound(); // Redirect to a 404 page
  }

  const feed = initialFeedData.data[0];

  let feedContent: string | null;
  try {
    feedContent = await fetchFeedContent(feed.url);
  } catch (error) {
    return <ErrorHandler error={`${error} ${feed.name}`} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{feed.name}</h1>
      <div>{feedContent}</div>
    </div>
  );
}
