"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface TMeal {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  provider_id?: string;
}

export default function HomePage() {
  const [meals, setMeals] = useState<TMeal[]>([]);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meals`,
        );
        const data = await res.json();
        if (data?.success) {
          setMeals(data.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch meals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleAddToCart = (meal: TMeal) => {
    addToCart({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      image_url: meal.image_url,
      quantity: 1,
      provider_id: meal.provider_id || "default_provider",
    });

    toast.success(`${meal.name} added to cart! 🍱`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Hero Section --- */}
      <section className="relative h-[550px] w-full bg-slate-900 flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')] bg-cover bg-center opacity-30 h-full w-full scale-105 transition-transform duration-1000" />
        </div>
        <div className="relative z-10 max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            It&apos;s the food you love, <br />
            <span className="text-primary italic">delivered light fast</span>
          </h1>
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
              <Input
                placeholder="What are you craving today?"
                className="pl-12 h-14 border-none focus-visible:ring-0 text-lg placeholder:text-gray-400"
              />
            </div>
            <Button className="bg-primary hover:bg-orange-600 h-14 px-10 text-lg font-bold rounded-xl transition-all">
              Find Food
            </Button>
          </div>
        </div>
      </section>

      {/* --- Featured Meals Section --- */}
      <section className="container mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Featured Meals
            </h2>
            <p className="text-gray-500 font-medium">
              Delicious dishes from your local providers
            </p>
          </div>
          <Link
            href="/meals"
            className="group text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            View all meals <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary h-12 w-10" />
            <p className="text-gray-400 font-medium">Loading yummy meals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={meal.image_url || "/placeholder-food.jpg"}
                    alt={meal.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full font-black text-primary shadow-sm text-sm">
                    ৳{meal.price}
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {meal.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
                    {meal.description}
                  </p>
                  <Button
                    onClick={() => handleAddToCart(meal)}
                    className="w-full mt-4 bg-orange-50 text-primary border border-orange-100 hover:bg-primary hover:text-white font-bold h-11 rounded-xl transition-all flex gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto py-20 px-4 bg-slate-50 rounded-[40px] mb-20">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-black text-gray-900">
            Cuisines you love
          </h2>
          <p className="text-gray-500 font-medium">Explore by category</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {["Burgers", "Pizza", "Deshi", "Healthy", "Cakes", "Pasta"].map(
            (cat) => (
              <div
                key={cat}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="h-28 w-28 rounded-full bg-white shadow-md flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 border-4 border-transparent group-hover:border-orange-100">
                  <span className="text-3xl font-black text-primary group-hover:text-white">
                    {cat[0]}
                  </span>
                </div>
                <p className="font-bold text-gray-700 group-hover:text-primary transition-colors">
                  {cat}
                </p>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
