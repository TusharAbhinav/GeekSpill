"use client";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export interface SavedArticle {
  id: string;
  user_id: string;
  article_title: string;
  article_link: string;
  article_creator?: string;
  article_content?: string;
  publication_date?: Date;
  summary?: string;
}

class SavedArticlesRepository {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  private supabase!: SupabaseClient<any, "public", any>;

  constructor(supabaseClient: SupabaseClient<any, "public", any>) {
    this.supabase = supabaseClient;
  }

  async addSavedArticle(
    article: Omit<SavedArticle, "id">
  ): Promise<{ data: SavedArticle | null; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("saved_articles")
      .insert(article)
      .select()
      .single();

    if (error) {
      console.error("Error saving article:", error);
    }

    return { data, error };
  }

  async getUserSavedArticles(): Promise<{
    data: SavedArticle[] | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await this.supabase
      .from("saved_articles")
      .select("*")
      .order("publication_date", { ascending: false });

    if (error) {
      console.error("Error fetching saved articles:", error);
    }

    return { data, error };
  }

  getSavedArticleById = cache(
    async (
      id: string
    ): Promise<{ data: SavedArticle | null; error: PostgrestError | null }> => {
      const { data, error } = await this.supabase
        .from("saved_articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching article ${id}:`, error);
      }

      return { data, error };
    }
  );
  async getArticleByLink(
    article_link: string
  ): Promise<{ data: { id: string } | null; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("saved_articles")
      .select("id")
      .eq("article_link", article_link)
      .maybeSingle();

    return { data, error };
  }
  async deleteSavedArticle(
    id: string
  ): Promise<{ success: boolean; error: PostgrestError | null }> {
    const { error } = await this.supabase
      .from("saved_articles")
      .delete()
      .eq("id", id);

    return { success: !error, error };
  }

  async updateArticleSummary(
    id: string,
    summary: string
  ): Promise<{ data: SavedArticle | null; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("saved_articles")
      .update({ summary })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating article summary:", error);
    }

    return { data, error };
  }

  async isArticleSaved(
    article_link: string
  ): Promise<{ exists: boolean; error: PostgrestError | null }> {
    const { data, error } = await this.supabase
      .from("saved_articles")
      .select("id")
      .eq("article_link", article_link)
      .maybeSingle();

    return { exists: !!data, error };
  }
}

export default SavedArticlesRepository;

import { createClient } from "./client";

let savedArticlesRepository: SavedArticlesRepository | null = null;

export function getSavedArticlesRepository() {
  if (!savedArticlesRepository) {
    const supabaseClient = createClient();
    savedArticlesRepository = new SavedArticlesRepository(supabaseClient);
  }
  return savedArticlesRepository;
}
