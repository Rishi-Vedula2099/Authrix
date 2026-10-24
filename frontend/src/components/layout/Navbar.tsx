"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { LogOut, User as UserIcon, ShieldAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass h-16 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <ShieldAlert className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Authrix
          </span>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center gap-4">
          {!isAuthPage && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-sm font-medium">
                      Dashboard
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
                      <UserIcon className="w-5 h-5 text-neutral-300" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-card border-white/10">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm text-foreground">Account</p>
                          <p className="w-[200px] truncate text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem>
                        <Link href="/dashboard" className="cursor-pointer w-full h-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/history" className="cursor-pointer w-full h-full">
                          History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault();
                          logout();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
