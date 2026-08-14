import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  Flame,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchLearningPaths } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your learning progress across paths and frameworks.",
};

// Demo progress: module ids the sample user has completed
const completedModules = new Set(["m1", "m2", "m3", "m6", "m7", "m11"]);

const statCards = [
  { icon: Flame, label: "Day streak", value: "17" },
  { icon: CheckCircle2, label: "Modules completed", value: "6" },
  { icon: Brain, label: "Frameworks practiced", value: "9" },
  { icon: Award, label: "Skill score", value: "740" },
];

export default async function DashboardPage() {
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

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, <span className="text-gradient">Analyst</span>
              </h1>
              <p className="mt-2 text-zinc-400">
                Sample dashboard — connect Supabase to track real progress.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
              <TrendingUp className="h-3.5 w-3.5" /> On pace this week
            </span>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <s.icon className="h-5 w-5 text-sol-300" />
                <div className="mt-3 text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Path progress */}
          <h2 className="mt-14 text-xl font-semibold text-white">Your paths</h2>
          <div className="mt-5 space-y-5">
            {paths.map((path) => {
              const done = path.modules.filter((m) => completedModules.has(m.id)).length;
              const pct = Math.round((done / path.modules.length) * 100);
              return (
                <div key={path.id} className="glass rounded-3xl p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sol-400/25 bg-sol-400/10">
                        <BookOpen className="h-4.5 w-4.5 h-[18px] w-[18px] text-sol-300" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">{path.title}</h3>
                        <p className="text-xs text-zinc-500">
                          {done} of {path.modules.length} modules · {path.level}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-sol-300">{pct}%</span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${path.accent} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {path.modules.map((m) => {
                      const isDone = completedModules.has(m.id);
                      return (
                        <li
                          key={m.id}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-zinc-700" />
                          )}
                          <span className={isDone ? "text-zinc-300" : "text-zinc-500"}>
                            {m.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
