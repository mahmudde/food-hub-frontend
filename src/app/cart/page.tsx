"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Types ---
interface TOrderPayload {
  items: {
    id: string;
    quantity: number;
    price: number;
  }[];
  total_price: number;
  delivery_address: string;
  provider_id: string;
  payment_method: string;
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, removeFromCart, addToCart, totalPrice, clearCart } =
    useCartStore();
  const [loading, setLoading] = useState(false);

  // --- Empty State ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-orange-50 p-6 rounded-full mb-6">
          <ShoppingCart className="h-16 w-16 text-primary opacity-50" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you havent added anything to your cart yet. Go ahead and
          explore top meals.
        </p>
        <Link href="/meals">
          <Button className="bg-primary hover:bg-orange-600 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-orange-200 transition-all">
            Browse Delicious Meals
          </Button>
        </Link>
      </div>
    );
  }

  // --- Checkout Logic ---
  const handleCheckout = async () => {
    if (!session?.user) {
      toast.error("Please login to place an order!");
      return;
    }

    setLoading(true);

    const orderData: TOrderPayload = {
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total_price: totalPrice() + 50,
      delivery_address: "Default Address, Dhaka",
      provider_id: items[0].provider_id || "default_provider",
      payment_method: "CASH_ON_DELIVERY",
    };

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("accessToken")}`,
        },

        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (response.status === 401) {
        throw new Error("Login session expired. Please login again.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Order placed successfully! 🎉");
        clearCart();
        router.push(`/orders/track/${result.data.id}`);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/meals">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-sm border"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Your Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-0 p-5 rounded-3xl shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-primary font-black text-lg">
                      ৳{item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-white hover:text-primary"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 font-bold text-gray-700 w-10 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-white hover:text-primary"
                      onClick={() => addToCart(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="link"
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => {
                if (confirm("Clear entire cart?")) clearCart();
              }}
            >
              Clear Shopping Cart
            </Button>
          </div>

          {/* Order Summary Card */}
          <div className="relative">
            <div className="bg-white p-8 rounded-[32px] border-0 shadow-xl shadow-gray-200/50 sticky top-24">
              <h2 className="text-2xl font-black mb-6 text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500 font-medium text-lg">
                  <span>Subtotal</span>
                  <span className="text-gray-900">৳{totalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-lg">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900">৳50</span>
                </div>
                <div className="h-px bg-gray-100 my-6" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-primary">
                    ৳{totalPrice() + 50}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 h-16 text-xl font-bold rounded-2xl mt-10 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Order"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
