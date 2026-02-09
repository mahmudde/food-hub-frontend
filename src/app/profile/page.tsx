"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Store } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function EditProfile() {
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();

  const session = sessionData as unknown as AuthSession;

  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/update-all`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        toast.success("Profile updated successfully!");
        router.refresh();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeProvider = async () => {
    setProviderLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/become-provider`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Congratulations! You are now a provider.");
        router.push("/setup");
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      toast.error("Request failed");
    } finally {
      setProviderLoading(false);
    }
  };

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <Card className="shadow-lg border-t-4 border-t-orange-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="text-orange-500" /> Edit Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative w-28 h-28 rounded-full bg-slate-100 overflow-hidden ring-4 ring-orange-50">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    <User size={50} />
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Profile Picture
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Verified)</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="Profile image URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/photo.jpg"
                  className="focus-visible:ring-orange-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 h-11 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {session?.user?.role === "CUSTOMER" && (
        <Card className="border-2 border-orange-100 bg-orange-50/50 shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                  <Store size={20} /> Want to sell food?
                </h3>
                <p className="text-sm text-orange-600">
                  Become a provider and start your shop!
                </p>
              </div>
              <Button
                onClick={handleBecomeProvider}
                disabled={providerLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {providerLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                Become a Provider
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
