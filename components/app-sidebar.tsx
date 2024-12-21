"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname } from "next/navigation";

export interface Items {
  title: string;
  url: string;
  id: string;
  isActive?: boolean;
}
export interface navItems {
  title: string;
  items: Items[];
}
export function AppSidebar({
  navItems,
  ...props
}: React.ComponentProps<typeof Sidebar> & { navItems: navItems[] }) {
  const [linkClicked, setLinkClicked] = useState<boolean>(false);
  const [pageID, setPageID] = useState<string>("");
  const pathName = usePathname();
  useEffect(() => {
      NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    if (!linkClicked) {
      NProgress.done();
    }
    return () => {
      NProgress.start();
    };
  }, [linkClicked]);
  useEffect(() => {
    setLinkClicked(false);
    setPageID(pathName.split("/")[4]);
  }, [pathName]);
  return (
    <Sidebar {...props}>
      <ScrollArea className="w-[100%] h-min">
        <SidebarHeader></SidebarHeader>
        <SidebarContent className="gap-0">
          {navItems.map((item) => (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {item.title}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild isActive={false}>
                            <Link
                              href={`/category/${item.title}/${subItem.title}/${subItem.id}`}
                              onClick={() =>
                                pageID !== subItem.id && setLinkClicked(true)
                              }
                            >
                              {subItem.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarContent>
        <SidebarRail />
      </ScrollArea>
    </Sidebar>
  );
}
