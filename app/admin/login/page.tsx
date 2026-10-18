"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      /*
       * STEP 1: AUTHENTICATE
       */
      const loginPromise = supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      const loginTimeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Login request timed out. Please check your internet connection and try again."
            )
          );
        }, 15000);
      });

      const { data, error: loginError } = await Promise.race([
        loginPromise,
        loginTimeout,
      ]);

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Unable to sign in. Please try again.");
        setLoading(false);
        return;
      }

      /*
       * STEP 2: CHECK ADMIN ACCESS
       */
      const adminPromise = supabase
        .from("admin_users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      const adminTimeout = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Admin verification timed out. Please check your Supabase connection."
            )
          );
        }, 10000);
      });

      const { data: admin, error: adminError } = await Promise.race([
        adminPromise,
        adminTimeout,
      ]);

      if (adminError) {
        await supabase.auth.signOut();

        setError(
          `Admin verification failed: ${adminError.message}`
        );

        setLoading(false);
        return;
      }

      if (!admin) {
        await supabase.auth.signOut();

        setError("You do not have admin access.");

        setLoading(false);
        return;
      }

      /*
       * STEP 3: SUCCESS
       */
      router.push("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while signing in.";

      setError(message);
      setLoading(false);
    }
  };

  return (
    <main className="flex  min-h-screen items-center justify-center bg-[#FFF9FF] px-6 py-12 ">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#750080]">
            Dammys Essence
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#41004C]">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-[#41004C]/55">
            Sign in to manage your products and collection.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-[#41004C]/10 bg-white p-8 shadow-xl shadow-[#41004C]/5 md:p-10">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#41004C]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#750080]/60"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] py-3.5 pl-11 pr-4 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#41004C]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#750080]/60"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[#41004C]/10 bg-[#FFF9FF] py-3.5 pl-11 pr-12 text-sm text-[#41004C] outline-none transition placeholder:text-[#41004C]/30 focus:border-[#750080] focus:ring-2 focus:ring-[#750080]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#41004C]/40 transition hover:text-[#750080]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.7} />
                  ) : (
                    <Eye size={18} strokeWidth={1.7} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#41004C] px-6 py-3.5 text-sm font-medium text-[#FFF9FF] transition hover:bg-[#750080] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#41004C]/35">
          Dammys Essence · Admin Portal
        </p>
      </div>
    </main>
  );
}