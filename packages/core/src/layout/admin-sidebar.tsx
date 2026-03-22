"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "../ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import * as LucideIcons from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  group: string;
  sort: number;
}

interface AdminSidebarProps {
  items: NavItem[];
}

function getIcon(name: string) {
  const icons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  return icons[name] || LucideIcons.File;
}

export function AdminSidebar({ items }: AdminSidebarProps) {
  const pathname = usePathname();

  const groups = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <LayoutDashboard className="h-5 w-5" />
          NextPanel
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/admin"}
                  render={<Link href="/admin" />}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {Object.entries(groups).map(([group, groupItems]) => {
          const sortedItems = groupItems.sort((a, b) => a.sort - b.sort);
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sortedItems.map((item) => {
                    const Icon = getIcon(item.icon);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={pathname.startsWith(item.href)}
                          render={<Link href={item.href} />}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
