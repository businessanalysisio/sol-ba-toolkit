"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Info, Loader2, Sun } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { EASE } from "@/lib/animations";

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    params.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);



    // Demo mode: no Supabase configured — go straight to the dashboard.
    if (!supabase) {
      await new Promise((r) => setTimeout(r, 600));
      localStorage.setItem(
        "user",
        JSON.stringify({ id: "demo-user", name: name || "Demo User", email, role: "Business Analyst" })
      );
      router.push("/dashboard");
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        setNotice("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="bg-grid mask-fade-y absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.1)_0%,transparent_65%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="glass relative w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-black/50 sm:p-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-sol-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sol-300 to-orange-500 shadow-[0_0_24px_-4px_rgba(251,191,36,0.8)]">
            <Sun className="h-5 w-5 text-night-950" strokeWidth={2.4} />
          </span>
          <span className="text-xl font-bold text-white">Sol</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {mode === "login"
            ? "Pick up right where your second brain left off."
            : "Free forever. No credit card required."}
        </p>

        {!isSupabaseConfigured && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-sky-400/20 bg-sky-400/10 p-3.5 text-xs leading-relaxed text-sky-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Demo mode: Supabase isn&apos;t configured, so any credentials will
            take you straight to the sample dashboard.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm text-zinc-400">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="glass w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-sol-400/50 focus:outline-none focus:ring-2 focus:ring-sol-400/20"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-zinc-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="glass w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-sol-400/50 focus:outline-none focus:ring-2 focus:ring-sol-400/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-zinc-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-sol-400/50 focus:outline-none focus:ring-2 focus:ring-sol-400/20"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}
          {notice && <p className="text-sm text-emerald-400">{notice}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {mode === "login" ? "New to Sol?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setNotice("");
            }}
            className="font-medium text-sol-300 transition-colors hover:text-sol-200"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
