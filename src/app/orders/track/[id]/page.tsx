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
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

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

    if (id) {
      fetchOrder();
      const intervalId = setInterval(() => {
        fetchOrder();
      }, 10000);
      return () => clearInterval(intervalId);
    }
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-gray-500 font-bold animate-pulse">
          Locating your meal...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24 px-4">
        <h2 className="text-2xl font-black text-gray-800">Order Not Found</h2>
        <Link
          href="/orders"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="bg-gray-50/30 min-h-screen pt-10 pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Back to My Orders
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Track Order
          </h1>
          <p className="text-gray-500 font-medium">
            Live status of your delicious meal!
          </p>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 bg-slate-900 text-white">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Order ID
                </p>
                <p className="text-xl font-mono font-black">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Amount
                </p>
                <p className="text-2xl font-black text-orange-500">
                  ৳{order.total_price}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Tracking Progress Bar */}
            <div className="relative flex justify-between">
              <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full" />
              <div
                className="absolute top-6 left-0 h-1 bg-orange-500 transition-all duration-700 rounded-full"
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
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 
                      ${isCompleted || isCurrent ? "bg-orange-500 text-white scale-110 shadow-lg" : "bg-white text-gray-300 border-2 border-gray-100"}`}
                    >
                      <StepIcon
                        className={`h-6 w-6 ${isCurrent ? "animate-pulse" : ""}`}
                      />
                    </div>
                    <span
                      className={`absolute -bottom-8 text-[10px] font-black uppercase ${isCurrent ? "text-orange-500" : "text-gray-400"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4 pt-10">
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl">
                <Store className="text-orange-500" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Restaurant
                  </p>
                  <p className="text-lg font-bold">
                    {order.provider?.resturant_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-orange-50/50 rounded-3xl border border-orange-100">
                <MapPin className="text-orange-500" />
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase">
                    Delivery to
                  </p>
                  <p className="text-gray-800 font-bold">
                    {order.delivery_address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
