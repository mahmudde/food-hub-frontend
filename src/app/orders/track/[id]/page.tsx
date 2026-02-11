"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Store,
} from "lucide-react";

type TOrderItem = {
  id: string;
  meal: { name: string; image_url: string };
  quantity: number;
  price: number;
};

type TOrder = {
  id: string;
  total_price: number;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  delivery_address: string;
  provider: { resturant_name: string };
  items: TOrderItem[];
};

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/orders/track/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        });

        const result = await res.json();
        if (result.success) {
          setOrder(result.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, baseUrl]);

  const steps = useMemo(
    () => [
      { label: "Placed", status: "PLACED", icon: Clock },
      { label: "Preparing", status: "PROCESSING", icon: Package },
      { label: "On the way", status: "SHIPPED", icon: Truck },
      { label: "Delivered", status: "DELIVERED", icon: CheckCircle },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
        </div>
        <p className="text-gray-500 font-bold animate-bounce">
          Locating your meal...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24 px-4">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="text-red-400 h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-800">Order Not Found</h2>
        <p className="text-gray-500 mt-2">
          The order ID might be incorrect or expired.
        </p>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="bg-gray-50/30 min-h-screen pt-10 pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Track Order
          </h1>
          <p className="text-gray-500 font-medium">
            Coming hot from the kitchen to your door!
          </p>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
          {/* Top Header */}
          <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Order Reference
                </p>
                <p className="text-xl font-mono font-black">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Amount Paid
                </p>
                <p className="text-2xl font-black text-primary">
                  ৳{order.total_price}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            <div className="relative flex justify-between">
              <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full" />

              <div
                className="absolute top-6 left-0 h-1 bg-primary transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.status}
                    className="relative z-10 flex flex-col items-center group"
                  >
                    <div
                      className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                      ${isCompleted || isCurrent ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-white text-gray-300 border-2 border-gray-100"}
                    `}
                    >
                      <StepIcon
                        className={`h-6 w-6 ${isCurrent ? "animate-pulse" : ""}`}
                      />
                    </div>
                    <span
                      className={`
                      absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors
                      ${isCurrent ? "text-primary opacity-100" : "text-gray-400 opacity-60"}
                    `}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              {/* Provider Info */}
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Preparing by
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {order.provider?.resturant_name || "Chef's Kitchen"}
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-4 p-5 bg-orange-50/50 rounded-3xl border border-orange-100">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase">
                    Delivery to
                  </p>
                  <p className="text-gray-800 font-bold leading-tight">
                    {order.delivery_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Support Footer */}
            <div className="pt-4 text-center">
              <p className="text-gray-400 text-sm font-medium">
                Need help with your order?{" "}
                <span className="text-primary font-bold cursor-pointer hover:underline">
                  Contact Support
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
