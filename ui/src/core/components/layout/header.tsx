"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/auth/context";
import { Button, buttonVariants } from "@/core/components/ui/button";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold text-zinc-900 dark:text-white"
        >
          Oracle
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          ) : isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <User className="h-4 w-4" />
                <span>{user.username}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
