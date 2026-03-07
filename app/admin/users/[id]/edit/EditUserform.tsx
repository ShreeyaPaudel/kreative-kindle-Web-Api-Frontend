"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AnyUser = {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
};

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export default function EditUserForm({
  user,
  userId,
}: {
  user: AnyUser;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState(
    user.username || user.name || user.fullName || ""
  );
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "parent");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getCookie("token");
    if (!token) {
      alert("Token missing. Please login again.");
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${base}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeURIComponent(token)}`,
        },
        body: JSON.stringify({
          username,
          email,
          role,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to update user");
        setLoading(false);
        return;
      }

      router.push(`/admin/users/${userId}`);
      router.refresh();
    } catch (err) {
      alert("Something went wrong while updating");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username / Name
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
          placeholder="Enter email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
        >
          <option value="parent">parent</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <button
        disabled={loading}
        className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
