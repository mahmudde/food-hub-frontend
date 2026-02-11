"use client";

import { useEffect, useState } from "react";
// --- UI Components ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// --- Icons ---
import {
  Utensils,
  ShoppingBag,
  Loader2,
  TrendingUp,
  Store,
  Activity,
  UserCircle,
} from "lucide-react";
// --- Custom Components & Hooks ---
import AddMealModal from "@/components/AddMealModal";
import OrderList from "@/components/OrderList";
import MealList from "@/components/MealList";
import { useSession } from "@/lib/auth-client";

export default function ProviderDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeMeals: 0,
    shopStatus: "LOADING",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes, mealsRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers/profile`,
            {
              credentials: "include",
            },
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/all-orders`,
            {
              credentials: "include",
            },
          ),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meals`, {
            credentials: "include",
          }),
        ]);

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();
        const mealsData = await mealsRes.json();
        setStats({
          totalOrders: ordersData.data?.data?.length || 0,
          activeMeals: mealsData.data?.length || 0,
          shopStatus: profileData.data?.provider?.shopStatus || "OPEN",
        });
      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-600" size={56} />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your kitchen...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl animate-in fade-in duration-700">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-wider text-sm">
            <Activity size={16} />
            Control Center
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Hello,{" "}
            <span className="text-orange-600">
              {session?.user?.name || "Chef"}!
            </span>
          </h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            <UserCircle size={16} />
            Welcome back! Heres whats happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddMealModal />
        </div>
      </div>

      {/* --- Stats Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Orders */}
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-orange-50/50 rounded-[28px] group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase">
              Total Orders
            </CardTitle>
            <div className="p-2 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> Lifetime Sales
            </p>
          </CardContent>
        </Card>

        {/* Active Meals */}
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-blue-50/50 rounded-[28px] group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase">
              My Menu
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
              <Utensils className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900">
              {stats.activeMeals}
            </div>
            <p className="text-xs text-blue-600 font-bold mt-2 uppercase tracking-tighter">
              Items Currently Live
            </p>
          </CardContent>
        </Card>

        {/* Shop Status */}
        <Card
          className={`border-none shadow-md rounded-[28px] group ${stats.shopStatus === "OPEN" ? "bg-emerald-50/30" : "bg-rose-50/30"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase">
              Shop Status
            </CardTitle>
            <div
              className={`p-2 rounded-xl group-hover:rotate-12 transition-transform ${stats.shopStatus === "OPEN" ? "bg-emerald-100" : "bg-rose-100"}`}
            >
              <Store
                className={`h-5 w-5 ${stats.shopStatus === "OPEN" ? "text-emerald-600" : "text-rose-600"}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-black mb-1 ${stats.shopStatus === "OPEN" ? "text-emerald-600" : "text-rose-600"}`}
            >
              {stats.shopStatus}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`flex h-2 w-2 rounded-full ${stats.shopStatus === "OPEN" ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`}
              />
              <p className="text-xs font-bold text-gray-500 uppercase">
                Restaurant is {stats.shopStatus}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Tabs Management --- */}
      <Tabs defaultValue="orders" className="space-y-8">
        <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
          <TabsTrigger
            value="orders"
            className="rounded-xl px-8 py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all font-bold"
          >
            Manage Orders
          </TabsTrigger>
          <TabsTrigger
            value="meals"
            className="rounded-xl px-8 py-2.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all font-bold"
          >
            My Menu Items
          </TabsTrigger>
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
