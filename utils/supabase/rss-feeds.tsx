import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active?: boolean;
  last_fetched?: string;
  update_frequency?: string;
  logo_url?: string;
}

class RSSFeedRepository {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  private supabase!: SupabaseClient<any, "public", any>;

  constructor(supabaseClient: SupabaseClient<any, "public", any>) {
    this.supabase = supabaseClient;
  }
  async getAllActiveFeeds(): Promise<{
    data: RSSFeed[] | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.supabase
      .from("rss_feeds")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching RSS feeds:", error);
    }

    return { data, error };
  }

  async addRSSFeed(
    feed: RSSFeed
  ): Promise<{ data: RSSFeed | null; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("rss_feeds")
      .insert(feed)
      .select()
      .single();

    if (error) {
      console.error("Error adding RSS feed:", error);
    }

    return { data, error };
  }

  async updateRSSFeed(
    id: string,
    updates: Partial<RSSFeed>
  ): Promise<{ data: RSSFeed | null; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("rss_feeds")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating RSS feed:", error);
    }

    return { data, error };
  }

  async getFeedsByCategory(
    category: string
  ): Promise<{ data: RSSFeed[] | null; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("rss_feeds")
      .select("*")
      .eq("category", category)
      .eq("is_active", true);

    if (error) {
      console.error(`Error fetching ${category} feeds:`, error);
    }

    return { data, error };
  }
  getFeedsByID = cache(
    async (
      id: string
    ): Promise<{ data: RSSFeed[] | null; error: PostgrestError | null }> => {
      const { data, error } = await this.supabase
        .from("rss_feeds")
        .select("*")
        .eq("id", id)
        .eq("is_active", true);

      if (error) {
        console.error(`Error fetching ${id} feeds:`, error);
      }

      return { data, error };
    }
  );

  async deactivateFeed(
    id: string
  ): Promise<{ success: boolean; error: PostgrestError | null }> {
    const { error } = await this.supabase
      .from("rss_feeds")
      .update({ is_active: false })
      .eq("id", id);

    return { success: !error, error };
  }
  async getAllCategories(): Promise<{
    data: string[] | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.supabase
      .from("rss_feeds")
      .select("category")
      .eq("is_active", true)
      .neq("category", null);

    if (error) {
      return { data: null, error };
    }
    const uniqueCategories = data
      ? (Array.from(
          new Set(data.map((item: { category: string }) => item.category))
        ) as string[])
      : null;

    return {
      data: uniqueCategories,
      error: null,
    };
  }
  getCategoriesWithFeeds = cache(
    async (): Promise<{
      data: { category: string; feeds: RSSFeed[] }[] | null;
      error: PostgrestError | null;
    }> => {
      const categoriesResult = await this.getAllCategories();

      if (categoriesResult.error) {
        return { data: null, error: categoriesResult.error };
      }

      const categories = categoriesResult.data;
      const results: { category: string; feeds: RSSFeed[] }[] = [];

      if (categories) {
        for (const category of categories) {
          const feedsResult = await this.getFeedsByCategory(category);
          if (!feedsResult.error && feedsResult.data) {
            results.push({ category, feeds: feedsResult.data });
          }
        }
      }

      return { data: results, error: null };
    }
  );
}
export default RSSFeedRepository;

import { createClient } from "./server";

let rssFeedRepository: RSSFeedRepository | null = null;

export async function getRSSFeedRepository() {
  if (!rssFeedRepository) {
    const supabaseClient = await createClient();
    rssFeedRepository = new RSSFeedRepository(supabaseClient);
  }
  return rssFeedRepository;
}
