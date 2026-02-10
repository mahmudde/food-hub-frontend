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
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
interface TMeal {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function MealList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers/my-meal`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader2 className="animate-spin mx-auto mt-10" />;

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals?.map((meal: TMeal) => (
            <TableRow key={meal.id}>
              <TableCell>
                <img
                  src={meal.image}
                  className="w-10 h-10 rounded object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{meal.name}</TableCell>
              <TableCell>৳ {meal.price}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
