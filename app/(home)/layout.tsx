import { AppSidebar, Items, navItems } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getRSSFeedRepository } from "@/utils/supabase/rss-feeds";
import { RSSFeed } from "@/utils/supabase/rss-feeds";
import ErrorHandler from "./category/[category-name]/[company-name]/[id]/error";
import HandleLogout from "@/components/handle-logout";

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
    <main className="bg-brand overflow-hidden">
      <SidebarProvider>
        <div className="flex w-[100%]">
          <AppSidebar navItems={items} />
          <main className="flex-grow w-[85%]">
            <div className="flex justify-between items-center w-[98%]  py-2 px-2">
              <SidebarTrigger />
              <HandleLogout />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </main>
  );
}
