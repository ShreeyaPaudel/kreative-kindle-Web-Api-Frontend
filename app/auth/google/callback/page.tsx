"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user  = searchParams.get("user");
    const error = searchParams.get("error");

    if (error || !token || !user) {
      router.push("/auth/login?error=google_failed");
      return;
    }

    try {
      // Save token and user to cookies — same as your normal login
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `token=${encodeURIComponent(token)}; path=/; expires=${expires}`;
      document.cookie = `user=${user}; path=/; expires=${expires}`;

      // Redirect to dashboard
      router.push("/auth/dashboard");
    } catch {
      router.push("/auth/login?error=google_failed");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl animate-pulse"
          style={{ background: "linear-gradient(135deg, #fde8d8, #fce4ec)" }}>
          🔑
        </div>
        <p className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          Signing you in with Google...
        </p>
        <p className="text-xs text-gray-400 mt-1">Please wait a moment</p>
      </div>
    </div>
  );
}