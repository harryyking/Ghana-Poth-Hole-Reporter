'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, LinkIcon, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const MenuItems = [
  { label: "Dashboard", icon: LayoutDashboardIcon, link: "/dashboard" },
  { 
    label: "Links", 
    icon: LinkIcon, 
    link: "/dashboard/links",
  },
  { label: "Settings", icon: Settings, link: "/dashboard/settngs" },
];


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar 
      side="left" 
      className="bg-sidebar border-r border-border w-64 transition-all duration-300"
    >
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">
            Medventory
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-sidebar">
        <SidebarMenu>
          {MenuItems.map((menuItem) => (
            <SidebarMenuItem key={menuItem.label}>
              <SidebarMenuButton asChild>
                <Link
                  href={menuItem.link}
                  className={cn(
                    "flex items-center justify-between rounded-lg p-3 text-sm",
                    "opacity-70 transition-all duration-200",
                    "hover:opacity-100",
                    "group relative",
                    pathname === menuItem.link && 
                    "opacity-100 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <menuItem.icon className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      "group-hover:scale-110",
                      pathname === menuItem.link && "scale-110"
                    )} />
                    <span>{menuItem.label}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

   </Sidebar>
  );
}