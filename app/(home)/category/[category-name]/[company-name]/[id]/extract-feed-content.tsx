import RSSFeedRepository from "@/utils/supabase/rss-feeds";
import { createClient } from "@/utils/supabase/server";
import { lazy } from "react";
const DisplayFeedContent = lazy(() => import("./display-feed-content-"));

type Params = {
  categoryName: string;
  companyName: string;
  id: string;
};

export default async function ExtractFeedContent({ params }: { params: Params }) {
  const supabaseClient = await createClient();
  const RSSFeedObj = new RSSFeedRepository(supabaseClient);

  const { data, error } = await RSSFeedObj.getFeedsByID(params.id);

  return <DisplayFeedContent initialFeedData={{ data, error }} />;
}
