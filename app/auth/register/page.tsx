"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/lib/authApi";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter valid email"),
    address: z.string().min(5, "Address is required"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);

    try {
      await registerUser({
        email: data.email,
        username: data.name,
        password: data.password,
      });

      alert("Registration successful! Please login.");
      router.push("/auth/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Check backend / CORS.";
      setServerError(msg);
      alert(msg);
    } finally {
      setLoading(false);
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
            alt="Register Illustration"
            className="w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] object-contain drop-shadow-2xl relative z-10"
          />
        </div>

        {/* FORM PANEL */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12 md:px-14 overflow-y-auto">

          <div className="w-full max-w-sm mx-auto">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
                Create Account 🚀
              </h1>
              <p className="mt-1.5 text-sm text-gray-400">
                Sign up to get started on your journey.
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    {...register("name")}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 pl-1">{errors.name.message}</p>
                )}
              </div>

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

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    {...register("address")}
                    placeholder="Enter your address"
                    autoComplete="street-address"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-400 pl-1">{errors.address.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-rose-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white py-3.5 text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign Up"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-300 tracking-wide">OR</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => alert("Google login coming soon")}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Login link */}
            <p className="mt-5 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>

      </motion.div>
    </main>
  );
}