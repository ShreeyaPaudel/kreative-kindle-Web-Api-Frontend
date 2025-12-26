"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-center text-2xl font-semibold text-gray-800">
          Welcome Back
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Please login to continue
        </p>

        {/* Signup link */}
        <p className="mb-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-purple-500 hover:underline"
          >
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
              <input
                {...register("email")}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-500 py-2 text-white transition hover:bg-purple-600"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
