"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface TMeal {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function MealList() {
  const [meals, setMeals] = useState<TMeal[]>([]);
  const [loading, setLoading] = useState(true);

  // Update Modal States
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<TMeal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meals`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data?.success) setMeals(data.data);
    } catch (error) {
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meals/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        setMeals((prev) => prev.filter((m) => m.id !== id));
        toast.success("Meal deleted!");
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeal) return;

    try {
      setIsUpdating(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meals/${selectedMeal.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: selectedMeal.name,
            price: Number(selectedMeal.price),
            description: selectedMeal.description,
            image: selectedMeal.image,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        setMeals((prev) =>
          prev.map((m) => (m.id === selectedMeal.id ? selectedMeal : m)),
        );
        toast.success("Meal updated successfully!");
        setIsUpdateOpen(false);
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );

  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Meal Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.length > 0 ? (
            meals.map((meal) => (
              <TableRow
                key={meal.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell>
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-700">
                  {meal.name}
                </TableCell>
                <TableCell className="text-orange-600 font-bold">
                  ৳ {meal.price}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedMeal(meal);
                      setIsUpdateOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(meal.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-10 text-gray-400"
              >
                No meals available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* --- UPDATE MODAL DIALOG --- */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Meal Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Meal Name</Label>
              <Input
                id="name"
                value={selectedMeal?.name || ""}
                onChange={(e) =>
                  setSelectedMeal((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (৳)</Label>
              <Input
                id="price"
                type="number"
                value={selectedMeal?.price || ""}
                onChange={(e) =>
                  setSelectedMeal((prev) =>
                    prev ? { ...prev, price: Number(e.target.value) } : null,
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={selectedMeal?.image || ""}
                onChange={(e) =>
                  setSelectedMeal((prev) =>
                    prev ? { ...prev, image: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <textarea
                id="desc"
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                rows={3}
                value={selectedMeal?.description || ""}
                onChange={(e) =>
                  setSelectedMeal((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
