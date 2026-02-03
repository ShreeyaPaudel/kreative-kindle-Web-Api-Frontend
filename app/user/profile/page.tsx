"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserFromCookie, getTokenFromCookie } from "@/lib/authCookies";
import { updateUserProfile } from "@/lib/userApi";

type User = {
  id: string;
  email: string;
  username: string;
  role?: string;
  image?: string;
};

export default function UserProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    const storedUser = getUserFromCookie();

    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }

    setUser(storedUser);
    setEmail(storedUser.email || "");
    setUsername(storedUser.username || "");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);

      // image optional
      if (image) {
        formData.append("image", image);
      }

      const res = await updateUserProfile(user.id, formData);

      alert("Profile updated!");

      // optional: refresh to show latest data in UI
      // If backend returns updated user, update state
      if (res?.user) {
        setUser(res.user);
        setEmail(res.user.email || "");
        setUsername(res.user.username || "");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your details (image optional).
        </p>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Logged in as:</span> {user.username} ({user.email})
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Role:</span> {user.role || "N/A"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Profile Image (optional)
            </label>
            <input
              className="mt-1 w-full"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}