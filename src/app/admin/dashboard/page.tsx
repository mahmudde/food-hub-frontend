"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  Store,
  ShieldCheck,
  Activity,
  Search,
  UserCheck,
  UserMinus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "ADMIN" | "CUSTOMER" | "PROVIDER";
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: sessionData, isPending } = authClient.useSession();
  const router = useRouter();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const session = sessionData as { user: ExtendedUser } | null;

  useEffect(() => {
    if (!isPending) {
      if (!session || session.user.role !== "ADMIN") {
        toast.error("Access Denied! Admins only.");
        router.push("/");
      } else {
        fetchUsers();
      }
    }
  }, [session, isPending, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/all-users`,
        {
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
      toast.success("Users updated");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load user list");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-white">
        <Loader2 className="animate-spin h-10 w-10 text-orange-600" />
        <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  const providers = users.filter((u) => u.role === "PROVIDER").length;
  const customers = users.filter((u) => u.role === "CUSTOMER").length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Admin Control
            </h1>
            <p className="text-gray-500 font-medium">
              Managing {users.length} total members in the system
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-5 py-2.5 bg-white border border-orange-100 rounded-full shadow-sm">
            <span className="text-sm font-bold text-orange-600">
              Welcome, {session?.user.name}
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Users"
            count={users.length}
            color="bg-blue-600"
          />
          <StatCard
            icon={<Store className="w-6 h-6" />}
            label="Providers"
            count={providers}
            color="bg-emerald-600"
          />
          <StatCard
            icon={<ShieldCheck className="w-6 h-6" />}
            label="Customers"
            count={customers}
            color="bg-orange-600"
          />
        </div>

        {/* User Table Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-white flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">User Management</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search email or name..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b">
                <tr className="text-left text-xs uppercase text-gray-500 font-bold tracking-widest">
                  <th className="px-6 py-5">Identity</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                          user.role === "ADMIN"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                        <Activity className="w-3 h-3" /> ACTIVE
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                          title="Promote"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                          title="Deactivate"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component (Typed)
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
}

function StatCard({ icon, label, count, color }: StatCardProps) {
  return (
    <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-2xl text-white shadow-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-gray-900 leading-none">
          {count}
        </p>
      </div>
    </div>
  );
}
