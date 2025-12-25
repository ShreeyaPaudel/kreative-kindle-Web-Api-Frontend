"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Enter valid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-center text-2xl font-semibold">
          Create Account
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Register to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register("name")}
              placeholder="Full Name"
              className="w-full rounded-lg border px-4 py-2"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full rounded-lg border px-4 py-2"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full rounded-lg border px-4 py-2"
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="w-full rounded-lg border px-4 py-2"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button className="w-full rounded-lg bg-purple-500 py-2 text-white">
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
