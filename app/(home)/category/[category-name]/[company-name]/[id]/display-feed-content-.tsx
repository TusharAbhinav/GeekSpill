import { RSSFeed } from "@/utils/supabase/rss-feeds";
import { notFound } from "next/navigation";
import ErrorHandler from "./error";
import Parser from "rss-parser";
import { CreatorIcon } from "@/app/public/assets/creator-icon";
import { DateIcon } from "@/app/public/assets/date-icon";
import { SquareArrowUpRight } from "lucide-react";
type InitialFeedData = {
  data: RSSFeed[] | null;
  error: { details: string } | null;
};
const parser = new Parser();
async function fetchFeedContent(url: string) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const xmlData = await response.text();
    const feed = await parser.parseString(xmlData);
    console.log(feed);
    return feed;
  } catch (err) {
    // const supabaseClient = await createClient();
    // const RSSFeedObj = new RSSFeedRepository(supabaseClient);
    // const { error } = await RSSFeedObj.deactivateFeed(id);
    // if (error) throw new Error(error.details);
    console.error("Error fetching feed content:", err);
    throw new Error("Failed to load feed content for");
  }
}

export default async function DisplayFeedContent({
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
    notFound();
  }

  const feed = initialFeedData.data[0];

  let feedContent: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  } & Parser.Output<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  try {
    feedContent = await fetchFeedContent(feed.url);
    console.log("Feed Properties:", Object.keys(feedContent));
  } catch (error) {
    return <ErrorHandler error={`${error} ${feed.name}`} />;
  }

  return (
    <div className="p-4 text-foreground w-[100%]">
      <h1 className="text-xxl font-bold mb-4 text-white">{feed.name}</h1>
      <div className="space-y-6 w-[100%]">
        {feedContent.items.map((item, index) => {
          const availableProps = {
            title: (item?.title && Object.getPrototypeOf(item.title)) ?? null,
            creator:
              (item?.creator && Object.getPrototypeOf(item.creator)) ??
              (item?.author && Object.getPrototypeOf(item.author)) ??
              null,
            pubDate:
              (item?.pubDate && Object.getPrototypeOf(item.pubDate)) ?? null,
            link: (item?.link && Object.getPrototypeOf(item.link)) ?? null,
            content:
              (item?.content && Object.getPrototypeOf(item.content)) ??
              (item?.contentSnippet &&
                Object.getPrototypeOf(item.contentSnippet)) ??
              null,
          };
          return (
            <article key={index} className="bg-brand p-4 rounded-lg shadow-md">
              <header className="mb-4 border-b border-gray-700 pb-2">
                {availableProps.title && (
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                )}
                <div className="flex items-center text-s text-gray-400 space-x-2">
                  {availableProps.creator && (
                    <span className="flex items-center">
                      <CreatorIcon />
                      {item.creator || item?.author}
                    </span>
                  )}
                  {availableProps.pubDate && (
                    <span className="flex items-center">
                      <DateIcon />
                      {new Date(item.pubDate!).toLocaleDateString()}
                    </span>
                  )}
                  {availableProps.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline ml-2"
                    >
                      <SquareArrowUpRight size={"20px"} />
                    </a>
                  )}
                </div>
              </header>
              {availableProps.content && (
                <div
                  className="prose prose-invert max-w-none
                    prose-headings:text-white 
                    prose-a:text-blue-400 
                    prose-strong:text-white
                    prose-code:text-white
                    prose-pre:bg-brandSecondary
                    "
                  dangerouslySetInnerHTML={{
                    __html: item.content! || item.contentSnippet!,
                  }}
                />
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
