"use client";

import { loginUser } from "@/lib/authApi";
import { saveAuth } from "@/lib/authCookies";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data); // { email, password }

      // save token + user in cookies
      saveAuth(res.token, res.user);

      alert("Login successful!");
      router.push("/auth/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800">
          Welcome Back
        </h1>

        <p className="mb-4 text-center text-sm text-gray-500">
          Please login to continue
        </p>

        <p className="mb-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-purple-500 hover:underline"
          >
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button className="w-full rounded-lg bg-purple-500 py-2 text-white hover:bg-purple-600">
            Login
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
