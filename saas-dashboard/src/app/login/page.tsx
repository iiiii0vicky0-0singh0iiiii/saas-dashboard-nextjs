"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Sign in to your SaaS Dashboard
          </p>
        </div>
    

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-2 text-center">
            {error}
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-black/80 hover:bg-black transition-all duration-200 shadow-lg disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-white underline underline-offset-4 hover:text-white/90"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
