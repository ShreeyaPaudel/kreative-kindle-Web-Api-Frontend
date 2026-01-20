"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Registration successful!");
    router.push("/auth/dashboard");
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
            href="/login"
            className="font-medium text-purple-500 hover:underline"
          >
            Login
          </Link>
        </p>

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

          {/* Address */}
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
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
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

          <button className="w-full rounded-lg bg-purple-500 py-2 text-white hover:bg-purple-600">
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-2">
          <div className="h-px w-full bg-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px w-full bg-gray-300" />
        </div>

        {/* Google */}
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
