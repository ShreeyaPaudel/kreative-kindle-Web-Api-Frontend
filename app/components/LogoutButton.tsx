"use client";

import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/authCookies";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={`rounded-lg border py-2 text-gray-700 hover:bg-gray-50 ${className}`}
    >
      Logout
    </button>
  );
}
