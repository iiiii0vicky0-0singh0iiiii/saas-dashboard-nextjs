"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
  const checkAccess = async () => {
    const { data: auth } = await supabase.auth.getUser();

    console.log("AUTH USER:", auth.user);

    if (!auth.user) {
      router.replace("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    console.log("PROFILE:", profile);

    if (profile?.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    setChecking(false);
  };

  checkAccess();
}, []);


  
  // ⏳ While checking auth & role
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking admin access...
      </div>
    );
  }

  // 👑 Admin UI
  return (
    <div className="min-h-screen p-10 space-y-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Admin Panel 👑</h1>

      <div className="bg-white rounded shadow p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize font-medium">
                  {u.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
