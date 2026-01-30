"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSignup() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created! Please check your email to verify.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-white/80 text-sm mt-1">
            
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-2 text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 text-sm text-green-200 bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-2 text-center">
            {success}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-white/90 text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-white/90 text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-black/80 hover:bg-black transition-all duration-200 shadow-lg disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-white underline underline-offset-4 hover:text-white/90"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
