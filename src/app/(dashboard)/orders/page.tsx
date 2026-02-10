"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Package,
  ChevronRight,
  XCircle,
  Clock,
  Store,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type TOrder = {
  id: string;
  total_price: number;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  provider: { resturant_name: string };
};

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const fetchOrders = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/api/v1/orders/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (session?.user) fetchOrders();
  }, [session, fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/api/v1/orders/cancel/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to cancel order");
      }

      if (result.success) {
        toast.success("Order cancelled successfully!");
        fetchOrders();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      PLACED: "bg-blue-50 text-blue-600 border-blue-100",
      PROCESSING: "bg-amber-50 text-amber-600 border-amber-100",
      SHIPPED: "bg-indigo-50 text-indigo-600 border-indigo-100",
      DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
      CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-400 font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            History of your delicious journey
          </p>
        </div>
        <Link href="/meals">
          <Button className="rounded-2xl bg-primary hover:bg-orange-600 transition-all shadow-lg shadow-primary/20">
            Order New Meal
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>
          <p className="text-gray-400 mt-2 mb-8">Hungry? Lets fix that!</p>
          <Link href="/meals">
            <Button variant="outline" className="rounded-xl border-2">
              Explore Menu
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-2xl text-primary">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-xl text-gray-900 group-hover:text-primary transition-colors">
                        {order.provider?.resturant_name || "FoodHub Restaurant"}
                      </p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`${getStatusStyle(order.status)} border rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider`}
                    >
                      {order.status}
                    </Badge>
                    <span className="text-gray-300">|</span>
                    <p className="text-xs font-mono text-gray-400 font-bold uppercase tracking-tighter">
                      ID: #{order.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between md:items-end gap-2">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      Grand Total
                    </p>
                    <p className="font-black text-3xl text-gray-900">
                      ৳{order.total_price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <Link href={`/orders/track/${order.id}`}>
                      <Button
                        size="sm"
                        className="rounded-2xl bg-gray-900 hover:bg-black text-xs font-bold px-5"
                      >
                        Track Order
                      </Button>
                    </Link>

                    {order.status === "PLACED" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-2xl"
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        {cancellingId === order.id ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
