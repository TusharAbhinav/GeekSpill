import { RSSFeed } from "@/utils/supabase/rss-feeds";
import { notFound } from "next/navigation";
import ErrorHandler from "./error";
import Parser from "rss-parser";
import FeedMetadata from "@/components/display-feed-metadata";
import { Metadata, ResolvingMetadata } from 'next';

type InitialFeedData = {
  data: RSSFeed[] | null;
  error: { details: string } | null;
};

type Props = {
  initialFeedData: InitialFeedData;
};

const parser = new Parser();

async function fetchFeedContent(url: string) {
  try {
    const response = await fetch(url, {
      next:{
        revalidate:300
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    const xmlData = await response.text();
    const feed = await parser.parseString(xmlData);
    return feed;
  } catch (err) {
    console.error("Error fetching feed content:", err);
    throw new Error("Failed to load feed content for");
  }
}

export async function generateMetadata(
  { initialFeedData }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (initialFeedData.error || !initialFeedData.data || initialFeedData.data.length === 0) {
    return {
      title: 'Feed Not Found',
      description: 'The requested RSS feed could not be found.',
    };
  }

  const feed = initialFeedData.data[0];
  
  try {
    const feedContent = await fetchFeedContent(feed.url);
    
    const previousMetadata = await parent;

    return {
      title: feed.name,
      description: feedContent.description || `Latest content from ${feed.name}`,
      openGraph: {
        title: feed.name,
        description: feedContent.description || `Latest content from ${feed.name}`,
        url: feed.url,
        siteName: feedContent.title || feed.name,
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: feed.name,
        description: feedContent.description || `Latest content from ${feed.name}`,
      },
      alternates: {
        canonical: feed.url,
        types: {
          'application/rss+xml': feed.url,
        },
      },
      robots: {
        index: true,
        follow: true,
      },
      authors: feedContent.creator ? [{ name: feedContent.creator }] : undefined,
      publisher: feedContent.title || feed.name,
      keywords: [
        ...(previousMetadata.keywords || []),
        'RSS Feed',
        feed.name,
        'News',
        'Updates'
      ],
    };
  } catch (error) {
    return {
      title: feed.name,
      description: `RSS feed content from ${feed.name} ${error}`,
    };
  }
}

export default async function DisplayFeedContent({
  initialFeedData,
}: Props) {
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
  } catch (error) {
    return <ErrorHandler error={`${error} ${feed.name}`} />;
  }

  return (
    <div className="p-2 sm:p-4 text-foreground w-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-white">
        {feed.name}
      </h1>
      <div className="space-y-4 sm:space-y-6 w-full">
        {feedContent.items.map((item, index) => {
          const availableProps = {
            title:
              item?.title && Object.getPrototypeOf(item.title)
                ? item.title
                : null,
            creator:
              item?.creator && Object.getPrototypeOf(item.creator)
                ? item.creator
                : item?.author && Object.getPrototypeOf(item.author)
                ? item.author
                : null,
            pubDate:
              item?.pubDate && Object.getPrototypeOf(item.pubDate)
                ? item.pubDate
                : null,
            link:
              item?.link && Object.getPrototypeOf(item.link) ? item.link : null,
            content:
              item?.content && Object.getPrototypeOf(item.content)
                ? item.content
                : item?.contentSnippet &&
                  Object.getPrototypeOf(item.contentSnippet)
                ? item.contentSnippet
                : null,
          };
          return (
            <article
              key={index}
              className="bg-brand  p-2 sm:p-4 rounded-lg shadow-md flex flex-col"
            >
              <header className="mb-2 sm:mb-4 border-b border-gray-700 pb-2">
                {availableProps.title && (
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {item.title}
                  </h2>
                )}
                <FeedMetadata
                  creator={availableProps.creator!}
                  link={availableProps.link!}
                  pubDate={availableProps.pubDate!}
                  title={availableProps.title!}
                  content={availableProps.content!}
                />
              </header>
              {availableProps.content && (
                <div
                  className="prose prose-invert max-w-none h-full
                    prose-headings:text-white 
                    prose-a:text-blue-400 
                    prose-strong:text-white
                    prose-code:text-white
                    prose-img:w-full
                    prose-pre:bg-brandSecondary
                    prose-sm sm:prose-base
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