"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store, MapPin } from "lucide-react";

export default function ProviderSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const profilePayload = {
      address: {
        address_line: formData.get("addressLine"),
        city: formData.get("city"),
        phone: formData.get("phone"),
      },
    };

    try {
      console.log("Step 1: Updating profile & address...");
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/update-all`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
          credentials: "include",
        },
      );

      const profileResult = await profileRes.json();

      if (!profileRes.ok)
        throw new Error(profileResult.message || "Failed to update profile");

      const addressId = profileResult.data?.address?.id;

      console.log("Step 2: Creating provider profile...");
      const providerPayload = {
        resturant_name: formData.get("restaurantName"),
        description: formData.get("description"),
        address_id: addressId,
      };

      const providerRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers/create-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(providerPayload),
          credentials: "include",
        },
      );

      const providerResult = await providerRes.json();

      if (providerRes.ok) {
        toast.success("Congratulations! Your restaurant is live. 🚀");
        router.push("/dashboard/provider");
      } else {
        throw new Error(
          providerResult.message || "Failed to create provider profile",
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Something went wrong during setup";

      console.error("Setup Error:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12 mx-auto px-4">
      <Card className="border-t-4 border-t-orange-600 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="text-orange-600" /> Register Your Restaurant
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your shop profile to start receiving orders.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-600 flex items-center gap-2 border-b pb-2">
                Shop Information
              </h3>
              <div className="space-y-2">
                <Input
                  name="restaurantName"
                  placeholder="Restaurant Name (e.g. Sultan's Dine)"
                  required
                  className="focus-visible:ring-orange-600 text-black"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  name="description"
                  placeholder="Describe your delicious food and shop vibe..."
                  required
                  className="min-h-[100px] focus-visible:ring-orange-600 text-black"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-600 flex items-center gap-2 border-b pb-2">
                <MapPin size={18} /> Location & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="city"
                  placeholder="City (e.g. Dhaka)"
                  required
                  className="focus-visible:ring-orange-600 text-black"
                />
                <Input
                  name="phone"
                  placeholder="Business Phone Number"
                  required
                  className="focus-visible:ring-orange-600 text-black"
                />
              </div>
              <Input
                name="addressLine"
                placeholder="Full Address (House, Road, Area...)"
                required
                className="focus-visible:ring-orange-600 text-black"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Setting up your
                  kitchen...
                </span>
              ) : (
                "Open My Restaurant 🚀"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
