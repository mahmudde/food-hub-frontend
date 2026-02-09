"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";
type AppUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: "PROVIDER" | "USER";
};

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary tracking-tight"
        >
          FoodHub <span className="text-gray-800">🍱</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/meals"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Browse Meals
          </Link>
        </div>

        {/* Right Side: Auth & Cart */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {/* Cart badge can be added here later */}
            </Button>
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href={
                  session.user && (session.user as AppUser)?.role === "PROVIDER"
                    ? "/provider/dashboard"
                    : "/profile"
                }
              >
                <Button variant="outline" size="sm">
                  My Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-pink-700">
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
