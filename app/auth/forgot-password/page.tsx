"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { requestPasswordReset } from "@/lib/authApi";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [serverMsg, setServerMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await requestPasswordReset({ email: data.email });
      setServerMsg(res?.message || "If that email exists, a reset link has been sent.");
    } catch (err: any) {
      setServerMsg(err?.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#f7f5f2] flex items-center justify-center px-4 py-10">
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
          <div className="relative z-10 w-full flex items-center justify-center p-6 sm:p-10">
            <img
              src="/images/loginRe.png"
              alt="Forgot Password Illustration"
              className="w-full max-w-[180px] sm:max-w-[260px] md:max-w-[320px] object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 md:px-14">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-7">
              <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
                Forgot password ✨
              </h1>
              <p className="mt-1.5 text-sm text-gray-400">
                Enter your email and we’ll send a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-white py-3.5 text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {serverMsg && (
              <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {serverMsg}
              </div>
            )}

            <p className="mt-6 text-center text-sm text-gray-400">
              Remembered it?{" "}
              <Link href="/auth/login" className="text-rose-500 hover:text-rose-600 font-semibold">
                Go to login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}