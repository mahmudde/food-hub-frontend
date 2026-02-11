"use client";

import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  total_price?: number;
  amount?: number;
  status: "PENDING" | "PREPARING" | "DELIVERED" | "CANCELLED";
  created_at?: string;
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/all-orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const resData = await res.json();

        if (res.ok && resData.success) {
          const actualOrders = resData.data?.data || [];
          setOrders(actualOrders);
        } else {
          setError(resData.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(
          "Something went wrong in system connection. Please login again",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center m-5">
        <p className="text-rose-600 font-medium">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 p-12 rounded-[32px] text-center m-5">
        <Package className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-900">No order found</h3>
        <p className="text-gray-500">
          No order till now. If any? you can see here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden m-5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="p-6 text-sm font-bold text-gray-500 uppercase">
                Order ID
              </th>
              <th className="p-6 text-sm font-bold text-gray-500 uppercase">
                Total Price
              </th>
              <th className="p-6 text-sm font-bold text-gray-500 uppercase">
                Status
              </th>
              <th className="p-6 text-sm font-bold text-gray-500 uppercase text-right">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/30 transition-colors"
              >
                <td className="p-6 font-mono text-sm text-gray-600">
                  {order.id ? order.id.slice(-6).toUpperCase() : "N/A"}
                </td>
                <td className="p-6 font-black text-gray-900">
                  ৳ {order.total_price || order.amount || 0}
                </td>
                <td className="p-6">
                  <Badge
                    className={`rounded-full px-3 py-1 font-bold ${
                      order.status === "PENDING"
                        ? "bg-amber-100 text-amber-600"
                        : order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="p-6 text-right">
                  <select
                    className="text-sm font-bold border rounded-lg p-2 outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    defaultValue={order.status}
                    onChange={(e) => console.log("New status:", e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
