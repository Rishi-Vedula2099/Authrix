"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  History,
  LayoutDashboard,
  ShieldAlert,
  Settings,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Analyze",
    href: "/dashboard",
    icon: ShieldAlert,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-white/10 bg-background/50 backdrop-blur-md hidden md:block">
      <div className="flex flex-col h-full gap-4 p-4">
        <div className="flex-1 space-y-2">
          {sidebarNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-4 transition-colors",
                  pathname === item.href
                    ? "bg-secondary text-primary shadow-sm"
                    : "hover:bg-neutral-800/50 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "font-medium",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.title}
                </span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Plan / Stats Area - Could add usage here later */}
        <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h4 className="font-medium text-sm text-foreground mb-1 relative z-10">Pro Plan</h4>
          <p className="text-xs text-muted-foreground relative z-10">Active subscription</p>
        </div>
      </div>
    </aside>
  );
}
