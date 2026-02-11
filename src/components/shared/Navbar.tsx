"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  ClipboardList,
  Loader2,
} from "lucide-react";

type AppUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: "ADMIN" | "PROVIDER" | "CUSTOMER";
};

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user as AppUser;

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/admin/dashboard";
    if (user?.role === "PROVIDER") return "/dashboard/provider";
    return "/profile";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* --- Logo --- */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary tracking-tight"
        >
          FoodHub <span className="text-2xl">🍱</span>
        </Link>

        {/* --- Central Links --- */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/meals"
            className="text-sm font-medium hover:text-primary transition-colors text-gray-700"
          >
            Browse Meals
          </Link>

          {!isPending && session && (
            <Link
              href="/orders"
              className="text-sm font-medium hover:text-primary transition-colors text-gray-700 flex items-center gap-1"
            >
              <ClipboardList className="h-4 w-4" />
              My Orders
            </Link>
          )}
        </div>

        {/* --- Right Side: Cart & Auth --- */}
        <div className="flex items-center gap-3">
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-orange-50"
            >
              <ShoppingBag className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>

          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
          ) : session ? (
            /* --- Logged In View --- */
            <div className="flex items-center gap-2 border-l pl-3 ml-1">
              <Link href={getDashboardLink()}>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-slate-900 hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user?.role === "CUSTOMER" ? "My Account" : "Dashboard"}
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/";
                      },
                    },
                  });
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* --- Guest View --- */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-orange-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
