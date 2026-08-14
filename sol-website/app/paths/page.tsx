import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchLearningPaths } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Structured business analysis learning tracks — from foundations to data-driven BA.",
};

const levelStyles: Record<string, string> = {
  Foundation: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Intermediate: "border-sol-400/25 bg-sol-400/10 text-sol-300",
  Advanced: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

export default async function PathsPage() {
  const paths = await fetchLearningPaths();

  return (
    <>
      <Navbar />
      <main className="section-pad min-h-screen pt-36">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-sol-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Learning <span className="text-gradient">paths</span>
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-400 sm:text-lg">
            Each path sequences modules in the order skills actually build on
            each other. Finish one before starting the next — that&apos;s the
            whole trick.
          </p>

          <div className="mt-14 space-y-6">
            {paths.map((path) => (
              <article
                key={path.id}
                className="glass glass-hover relative overflow-hidden rounded-3xl p-7 sm:p-9"
              >
                <div
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${path.accent}`}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${levelStyles[path.level]}`}
                  >
                    {path.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                    <BookOpen className="h-4 w-4" /> {path.modules.length} modules
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                    <Clock className="h-4 w-4" /> {path.duration}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{path.title}</h2>
                <p className="mt-2 max-w-2xl text-zinc-400">{path.description}</p>

                <ol className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {path.modules.map((m, i) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sol-400/30 bg-sol-400/10 text-xs font-semibold text-sol-300">
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-300">{m.title}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-7">
                  <Link href="/login?mode=signup" className="btn-primary">
                    Start this path
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
