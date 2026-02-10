"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, ShoppingBag, Settings, Loader2 } from "lucide-react";
import AddMealModal from "@/components/AddMealModal";
import OrderList from "@/components/OrderList";
import MealList from "@/components/MealList";

export default function ProviderDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeMeals: 0,
    shopStatus: "LOADING",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers/profile`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();

        if (res.ok) {
          setStats({
            totalOrders: data.data.totalOrders,
            activeMeals: data.data.activeMeals,
            shopStatus: data.data.shopStatus,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-600">
            Provider Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your restaurant, meals, and orders.
          </p>
        </div>
        <AddMealModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Meals</CardTitle>
            <Utensils className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMeals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shop Status</CardTitle>
            <Settings
              className={`h-4 w-4 ${stats.shopStatus === "OPEN" ? "text-green-600" : "text-red-600"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-lg font-bold ${stats.shopStatus === "OPEN" ? "text-green-600" : "text-red-600"}`}
            >
              {stats.shopStatus}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="bg-orange-50">
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
          <TabsTrigger value="meals">My Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrderList />
        </TabsContent>

        <TabsContent value="meals">
          <MealList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
