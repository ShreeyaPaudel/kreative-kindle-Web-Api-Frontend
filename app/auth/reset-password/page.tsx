"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";

import { resetPassword } from "@/lib/authApi"; 
import { requestPasswordReset } from "@/lib/authApi";

const schema = z
  .object({
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ token comes from URL: /auth/reset-password?token=xxxx
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [serverMsg, setServerMsg] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerMsg("");
    setStatus("idle");

    if (!token) {
      setStatus("error");
      setServerMsg("Missing token. Please open the latest reset link from your email.");
      return;
    }

    try {
      // ✅ Backend expects: { token, password }
      const res = await resetPassword({ token, password: data.password });

      setStatus("success");
      setServerMsg(res?.message || "Password reset successful.");

      // ✅ redirect only on success
      setTimeout(() => router.replace("/auth/login"), 1200);
    } catch (error: any) {
      setStatus("error");
      setServerMsg(error?.response?.data?.message || "Invalid or expired token.");
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#f7f5f2] flex items-center justify-center px-4 py-10">
      {/* ✅ single smooth animation only (container) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_60px_rgba(0,0,0,0.10)] overflow-hidden flex flex-row min-h-[520px]"
      >
        {/* IMAGE PANEL */}
        <div className="relative w-[42%] sm:w-1/2 flex-shrink-0 bg-gradient-to-br from-[#fde8d8] via-[#fce4ec] to-[#e8d5f5] flex items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-200/50 blur-2xl" />

          <div className="relative z-10 w-full flex items-center justify-center p-8 sm:p-12">
            <img
              src="/images/loginRe.png"
              alt="Reset Illustration"
              className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px] object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 md:px-14">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-7">
              <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
                Reset password ✨
              </h1>
              <p className="mt-1.5 text-sm text-gray-400">
                Choose a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white py-3.5 text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update password"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Status */}
              {serverMsg && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm border ${
                    status === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-rose-50 border-rose-100 text-rose-700"
                  }`}
                >
                  {serverMsg}
                  {status === "success" && (
                    <div className="mt-1 text-xs text-emerald-600/80">
                      Redirecting to login...
                    </div>
                  )}
                </div>
              )}

              {/* Links */}
              <p className="text-center text-sm text-gray-400">
                Need a new link?{" "}
                <Link
                  href="/auth/forgot-password"
                  className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                >
                  Request again
                </Link>
              </p>

              {/* Token missing hint */}
              {!token && (
                <p className="text-center text-xs text-gray-300">
                  (Tip: open the reset link from your email — it contains the token.)
                </p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}