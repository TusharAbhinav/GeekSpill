import { AppSidebar, Items, navItems } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import  { getRSSFeedRepository } from "@/utils/supabase/rss-feeds";
import { RSSFeed } from "@/utils/supabase/rss-feeds";
import ErrorHandler from "./category/[category-name]/[company-name]/[id]/error";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const RSSFeedObj = await getRSSFeedRepository();
  const { data, error } = await RSSFeedObj.getCategoriesWithFeeds();
  if (error) return <ErrorHandler error={error.details} />;
  const items: navItems[] = [];
  data?.forEach((item: { category: string; feeds: RSSFeed[] }) => {
    const categoryItems: Items[] = [];
    item.feeds.forEach((item: RSSFeed) => {
      categoryItems.push({
        title: item.name,
        url: item.url,
        id: item.id,
      });
    });
    items.push({
      title: item.category,
      items: categoryItems,
    });
  });

  return (
    <main className="bg-brand w-max">
      <SidebarProvider>
        <div className="flex">
          <AppSidebar navItems={items} />
          <main className="flex-grow">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </main>
  );
}
