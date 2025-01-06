import { AppSidebar, Items, navItems } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getRSSFeedRepository } from "@/utils/supabase/rss-feeds";
import { RSSFeed } from "@/utils/supabase/rss-feeds";
import ErrorHandler from "./category/[category-name]/[company-name]/[id]/error";
import HandleLogout from "@/components/handle-logout";
import { BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

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
            <div className="flex justify-between items-center w-[98%] py-2 px-2">
              <div className="flex gap-2 justify-center items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <SidebarTrigger />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hide sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/saved-articles">
                        <Button
                          variant="default"
                          className="bg-brand shadow-sm w-[20px] hover:bg-brandSecondary"
                        >
                          <BookMarked size={"20px"} color="#FAFAFA" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View bookmarked articles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <HandleLogout />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </main>
  );
}