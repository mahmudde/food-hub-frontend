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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
interface TOrder {
  id: string;
  total_price: number;
  status: "PLACED" | "COOKING" | "DELIVERED";
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/provider-orders`,
      { credentials: "include" },
    )
      .then((res) => res.json())
      .then((data) => setOrders(data.data));
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        },
      );
      if (res.ok) toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Update Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order: TOrder) => (
            <TableRow key={order.id}>
              <TableCell className="text-xs">{order.id}</TableCell>
              <TableCell>৳ {order.total_price}</TableCell>
              <TableCell className="font-bold text-orange-600">
                {order.status}
              </TableCell>
              <TableCell className="text-right">
                <Select
                  onValueChange={(val) => handleStatusChange(order.id, val)}
                >
                  <SelectTrigger className="w-[130px] ml-auto">
                    <SelectValue placeholder={order.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLACED">Placed</SelectItem>
                    <SelectItem value="COOKING">Cooking</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
