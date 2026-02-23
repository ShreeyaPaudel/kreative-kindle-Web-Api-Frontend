"use client";

import { loginUser } from "@/lib/authApi";
import { saveAuth } from "@/lib/authCookies";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data);
      saveAuth(res.token, res.user);

      if (res.user?.role === "admin") {
        router.push("/admin/users");
      } else {
        router.push("/auth/dashboard");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#f7f5f2] flex items-center justify-center px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_60px_rgba(0,0,0,0.10)] overflow-hidden flex flex-row min-h-[580px]"
      >

        {/* IMAGE PANEL */}
        <div className="relative w-[48%] flex-shrink-0 bg-gradient-to-br from-[#fde8d8] via-[#fce4ec] to-[#e8d5f5] flex items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-200/50 blur-2xl" />
          <img
            src="/images/loginRe.png"
            alt="Login Illustration"
            className="w-full max-w-[340px] md:max-w-[380px] lg:max-w-[420px] object-contain drop-shadow-2xl relative z-10"
          />
        </div>

        {/* FORM PANEL */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 md:px-14">

          <div className="w-full max-w-sm mx-auto">

            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
                Welcome back 👋
              </h1>
              <p className="mt-1.5 text-sm text-gray-400">
                Sign in to continue your creative journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    {...register("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-rose-400 hover:text-rose-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-rose-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white py-3.5 text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-200 transition-all duration-200"
              >
                Login
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Sign up */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>

      </motion.div>
    </main>
  );
}