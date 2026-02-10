"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
interface TCategory {
  id: string;
  name: string;
}

export default function AddMealModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<TCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleAddMeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const mealData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string),
      image_url:
        (formData.get("image_url") as string) ||
        "https://example.com/default-meal.jpg",
      is_available: "AVAILABLE",
      category_id: formData.get("category_id") as string,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/meals/create-meal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mealData),
          credentials: "include",
        },
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Meal Created Successfully!");
        setOpen(false);
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to create meal");
      }
    } catch (err) {
      toast.error("Network error! Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Delicious Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddMeal} className="space-y-4">
          <div className="space-y-2">
            <Input name="name" placeholder="Meal Name" required />
          </div>

          <div className="space-y-2">
            <Input
              name="price"
              type="number"
              placeholder="Price (৳)"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              name="category_id"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Textarea
              name="description"
              placeholder="Short description..."
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              name="image_url"
              placeholder="Image URL (e.g. https://...)"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Meal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
