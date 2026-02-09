"use client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const DUMMY_MEALS = [
  {
    id: "1",
    name: "Classic Beef Burger",
    price: 250,
    restaurant: "Burger King",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Chicken Biryani",
    price: 180,
    restaurant: "Kacchi Bhai",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=500",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Pepperoni Pizza",
    price: 550,
    restaurant: "Pizza Hut",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500",
    rating: 4.2,
  },
];

export default function MealsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Available Meals</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for food or restaurants..."
            className="pl-10 h-11 border-primary/20 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DUMMY_MEALS.map((meal) => (
          <Card
            key={meal.id}
            className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold text-primary">
                ⭐ {meal.rating}
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-bold text-lg truncate">{meal.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{meal.restaurant}</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <span className="text-xl font-bold text-primary">
                ৳ {meal.price}
              </span>
              <Button size="sm" className="bg-primary hover:bg-pink-700">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
