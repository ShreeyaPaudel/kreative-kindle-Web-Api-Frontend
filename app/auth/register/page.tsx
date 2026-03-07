"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/lib/authApi"; // <- path check: lib/authApi.ts

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
      // ✅ backend expects: email, username, password
      // name लाई username बनाइदिएको
      await registerUser({
        email: data.email,
        username: data.name,
        password: data.password,
      });

      alert("Registration successful! Please login.");
      router.push("/auth/login"); // ✅ register पछि login मा पठाउने
    } catch (err: any) {
      // axios error safe message
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
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-center text-2xl font-semibold text-gray-800">
          Create Account
        </h1>

        <p className="mb-4 text-center text-sm text-gray-500">
          Sign up to get started
        </p>

        <p className="mb-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-purple-500 hover:underline"
          >
            Login
          </Link>
        </p>

        {serverError && (
          <div className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">👤</span>
              <input
                {...register("name")}
                placeholder="Enter your name"
                className="w-full rounded-lg border pl-10 pr-4 py-2"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">📧</span>
              <input
                {...register("email")}
                placeholder="Enter your email"
                className="w-full rounded-lg border pl-10 pr-4 py-2"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Address (frontend only, backend ma ignore) */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">📍</span>
              <input
                {...register("address")}
                placeholder="Enter your address"
                className="w-full rounded-lg border pl-10 pr-4 py-2"
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">🔒</span>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter password"
                className="w-full rounded-lg border pl-10 pr-4 py-2"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">🔒</span>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm password"
                className="w-full rounded-lg border pl-10 pr-4 py-2"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-purple-500 py-2 text-white hover:bg-purple-600 disabled:opacity-60"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px w-full bg-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px w-full bg-gray-300" />
        </div>

        <button
          type="button"
          className="w-full rounded-lg border py-2 hover:bg-gray-50"
          onClick={() => alert("Google login coming soon")}
        >
          🔵 Continue with Google
        </button>
      </div>
    </main>
  );
}
